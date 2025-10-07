# Fleet Study Case - Full Stack (React + Express + SQLite)

Ce projet est une petite application CRUD pour:
- Employés (nom, rôle)
- Appareils (nom, type, propriétaire)

Stack:
- Frontend: React + TypeScript (Vite)
- Backend: Express (TypeScript) + SQLite (better-sqlite3)
- Docker: 2 services (web = nginx + frontend statique, api = backend Node), 1 volume persistant pour la base SQLite