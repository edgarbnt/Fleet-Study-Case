# Fleet Study Case — React + Express + SQLite

A small full‑stack CRUD application to manage employees and devices. It showcases a clean React frontend (with custom, accessible UI components) and an Express API backed by SQLite.

## Overview

The app manages:
- Employees: name and role
- Devices: name, type, and owner (an employee)

Core features:
- CRUD for employees and devices
- Assign/unassign devices to employees
- Filtering
    - Employees by role
    - Devices by type and by owner (both filters can be combined)
- Searchable owner select with typeahead for large lists
- Pagination with “rows per page” selector (drop‑up)
- Clear all filters in one click
- Edit modals with adjustable size and consistent theming
- Dark/light theme toggle
- Robust custom dropdowns with keyboard support and portal rendering (no clipping inside modals)

## Tech Stack

- Frontend
    - React + TypeScript (Vite)
    - React Router
    - TanStack Query (data fetching, caching, mutations)
    - Custom UI: chip selects, inline select, modals, tables
- Backend
    - Node.js 20 + Express
    - better‑sqlite3 (synchronous, simple, efficient for this scope)
    - SQLite file persisted locally or via Docker volume

## Project Structure

```
frontend/
  src/
    components/          # UI components (Table, Modal, Buttons, filters, etc.)
    pages/               # Devices, Employees, Dashboard
    styles/              # CSS variables, globals, dark theme, filters styles
    routes.tsx
    App.tsx, main.tsx
backend/
  index.ts               # Express server entrypoint
  src/
    config/              # database.ts (SQLite init, singleton)
    controllers/         # HTTP endpoints logic
    models/              # SQLite queries
    routes/              # Express routers
    types.ts             # DTO interfaces
docker-compose.yml
.env.example
```

## Data Model

- employees
    - id INTEGER PK AUTOINCREMENT
    - name TEXT NOT NULL
    - role TEXT NOT NULL
    - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

- devices
    - id INTEGER PK AUTOINCREMENT
    - name TEXT NOT NULL
    - type TEXT NOT NULL
    - owner_id INTEGER NULL (FK employees.id, ON DELETE SET NULL)
    - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    - updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## API Overview

Base path: `/api`

Employees
- GET `/employees` — list employees (supports pagination and role filter)
- GET `/employees/:id` — employee detail
- POST `/employees` — create { name, role }
- PUT `/employees/:id` — update at least one of { name, role }
- DELETE `/employees/:id` — delete, unassigns devices automatically
- GET `/employees/:id/devices` — devices owned by the employee

Devices
- GET `/devices` — list devices (supports pagination, filter by type and/or owner)
    - owner filter accepts either a specific owner id or the string `null` for unassigned
- GET `/devices/:id` — device detail
- POST `/devices` — create { name, type, owner_id? }
- PUT `/devices/:id` — update at least one of { name, type, owner_id }
- DELETE `/devices/:id` — delete device
- POST `/devices/:id/assign` — assign or unassign owner { owner_id } (nullable)

Responses for list endpoints are paginated:
```json
{
  "items": [/* ... */],
  "page": 1,
  "pageSize": 10,
  "total": 123,
  "totalPages": 13
}
```

## Environment Variables

At the repository root, use `.env` based on `.env.example`.

- FRONTEND_PORT (default 5173)
- BACKEND_PORT (default 4000)
- DATABASE_FILE (default /data/app.sqlite for Docker, or backend/data/app.sqlite locally)
- BACKEND_URL (used by the frontend dev server proxy, set in docker-compose)

## Running with Docker

1) Copy the example environment file
```bash
cp .env.example .env
```

2) Start with Docker Compose
```bash
docker compose up --build
```

3) Access the services
- Frontend (Vite dev server): http://localhost:5173
- API: http://localhost:4000/api

Notes:
- The API service persists the SQLite database in the `db_data` Docker volume.
- The frontend dev server proxies `/api` requests to the API service defined by `BACKEND_URL`.

To stop:
```bash
docker compose down
```

To remove volumes as well:
```bash
docker compose down -v
```

## Running Locally (without Docker)

Prerequisites:
- Node.js 20.x

Backend
```bash
cd backend
npm ci
npm start
# API listening on http://localhost:4000
```

Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server on http://localhost:5173
```

The frontend dev server proxies `/api` to `BACKEND_URL` (configured via Vite and .env). By default, it targets the backend on `http://localhost:4000`.

## UI/UX Notes

- Filters
    - Chip‑style selects using a consistent border radius and dark theme
    - Owner filter is searchable (typeahead) to handle large datasets
    - “Clear filters” resets all filter query params and returns to page 1
- Pagination
    - Page navigation and an inline “Rows per page” dropdown (drop‑up), both synced to the URL
- Modals
    - Resizable via props; height and body max‑height are CSS‑variable driven
    - Custom dropdown menus render in a portal to avoid clipping within scroll containers
- Accessibility and Keyboard
    - Dropdowns support arrow navigation, Enter, Escape, Home/End
    - Close modal with Escape
    - Focus management for searchable menus
