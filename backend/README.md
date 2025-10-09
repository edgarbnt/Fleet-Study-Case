# Fleet Backend API

Backend REST API (Node.js + Express + TypeScript + better-sqlite3)

---

## Stack & Prerequisites
| Component | Recommended Version |
|-----------|---------------------|
| Node.js | 20.x (consistent with the compiled better-sqlite3) |
| Database | SQLite (local file) |
| Language | TypeScript |

---

## Quick Start

### Via Docker

```bash
docker compose up --build
```

### Locally (without Docker)

```bash
cd backend
cp .env.example .env
nvm use 20
npm ci
npm start
```

---

## Environment Variables

| Name | Default | Description |
|------|---------|-------------|
| PORT | 4000 | HTTP listen port |
| DB_FILE | ./data/app.sqlite | Relative or absolute path to the SQLite file |

> The DB path is resolved to an absolute path and created if necessary.

---

## Project Structure

```
backend/
  index.ts                 # Entry point (Express server)
  src/
    config/
      database.ts          # Initialization + DB singleton
    controllers/           # HTTP logic (parsing, status codes)
    models/                # SQLite access (queries)
    routes/                # Express route definitions
    types.ts               # TypeScript interfaces (DTO models)
```

---

## Data Model

### employees
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK AUTOINCREMENT | Identifier |
| name | TEXT NOT NULL | Name |
| role | TEXT NOT NULL | Role |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Updated manually in code |

### devices
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK AUTOINCREMENT | Identifier |
| name | TEXT NOT NULL | Device name |
| type | TEXT NOT NULL | Type (e.g. laptop, phone) |
| owner_id | INTEGER NULL FK employees(id) | May be NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Updated manually in code |

---

## Response & Error Format

### Success (examples)

```json
// GET /api/employees
[
  {
    "id": 1,
    "name": "Alice",
    "role": "Developer",
    "created_at": "2025-10-09T07:50:23.000Z",
    "updated_at": "2025-10-09T07:50:23.000Z"
  }
]
```

```json
// POST /api/employees
{
  "id": 2,
  "name": "Bob",
  "role": "Designer",
  "created_at": "2025-10-09T07:51:10.000Z",
  "updated_at": "2025-10-09T07:51:10.000Z"
}
```

### Error

```json
{
  "error": "Employee not found"
}
```

Or for a server error:

```json
{
  "error": "Internal server error",
  "message": "Internal stack / detail"
}
```

---

## Endpoints Overview

| Method | Path | Description | Body Required | Success Codes |
|--------|------|-------------|---------------|---------------|
| GET | /api/health | Service check | ❌ | 200 |
| GET | /api/employees | List employees | ❌ | 200 |
| GET | /api/employees/:id | Employee detail | ❌ | 200 / 404 |
| POST | /api/employees | Create employee | ✅ `{name, role}` | 201 |
| PUT | /api/employees/:id | Update employee | ✅ (≥1 field) | 200 / 404 |
| DELETE | /api/employees/:id | Delete employee | ❌ | 204 / 404 |
| GET | /api/employees/:id/devices | Employee’s devices | ❌ | 200 / 404 |
| GET | /api/devices | List devices | ❌ | 200 |
| GET | /api/devices/:id | Device detail | ❌ | 200 / 404 |
| POST | /api/devices | Create device | ✅ `{name, type, owner_id?}` | 201 |
| PUT | /api/devices/:id | Update device | ✅ (≥1 field) | 200 / 404 |
| DELETE | /api/devices/:id | Delete device | ❌ | 204 / 404 |
| POST | /api/devices/:id/assign | Assign / unassign | ✅ `{owner_id}` (nullable) | 200 / 404 |

---

## Route Details

### Health

#### GET /api/health
Response 200:
```json
{
  "ok": true,
  "timestamp": "2025-10-09T07:55:31.123Z"
}
```

---

### Employees

#### GET /api/employees
Response 200: `Employee[]`

#### GET /api/employees/:id
- 200: `Employee`
- 404: `{ "error": "Employee not found" }`

#### POST /api/employees
JSON body:
```json
{
  "name": "Alice",
  "role": "Developer"
}
```
Validation:
- `name` non-empty string
- `role` non-empty string

Responses:
- 201: `Employee`
- 400: `{ "error": "Name and role are required" }`

#### PUT /api/employees/:id
Body (at least one field):
```json
{
  "name": "Alice Cooper",
  "role": "Lead Developer"
}
```
Responses:
- 200: Updated `Employee`
- 400: `{ "error": "At least one field to update is required" }`
- 404: `{ "error": "Employee not found" }`

#### DELETE /api/employees/:id
Responses:
- 204: (no body)
- 404: `{ "error": "Employee not found" }`

#### GET /api/employees/:id/devices
Responses:
- 200: `Device[]`
- 404: `{ "error": "Employee not found" }`

---

### Devices

#### GET /api/devices
Response 200: `Device[]`

#### GET /api/devices/:id
- 200: `Device`
- 404: `{ "error": "Device not found" }`

#### POST /api/devices
JSON body:
```json
{
  "name": "MacBook Pro",
  "type": "laptop",
  "owner_id": 1
}
```
Notes:
- `owner_id` optional
- If provided, must reference an existing employee

Responses:
- 201: `Device`
- 400: `{ "error": "Invalid owner_id, employee not found" }`
- 400 (missing fields): `{ "error": "Name and type are required" }`

#### PUT /api/devices/:id
Body (≥1 field):
```json
{
  "name": "MacBook Pro 14",
  "type": "laptop",
  "owner_id": null
}
```
Responses:
- 200: `Device`
- 400: `{ "error": "At least one field to update is required" }`
- 400: `{ "error": "Invalid owner_id, employee not found" }`
- 404: `{ "error": "Device not found" }`

#### DELETE /api/devices/:id
Responses:
- 204: (no body)
- 404: `{ "error": "Device not found" }`

#### POST /api/devices/:id/assign
Assign or unassign an owner.

Body to assign:
```json
{ "owner_id": 2 }
```

Body to unassign:
```json
{ "owner_id": null }
```

Responses:
- 200: Updated `Device`
- 400: `{ "error": "owner_id is required" }`
- 400: `{ "error": "Invalid owner_id, employee not found" }`
- 404: `{ "error": "Device not found" }`

---

## Notes & Limitations
- No pagination / filtering yet.
- No advanced validation (Zod / Joi) — only basic conditional checks.
- No transactions (current operations are simple).
- `updated_at` is only updated via explicit UPDATE statements (no DB triggers).
- `better-sqlite3` is synchronous: fine for this scope, but watch out for higher concurrency loads.