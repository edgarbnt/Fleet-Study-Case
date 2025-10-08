import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export function initDatabase() {
    const DB_FILE = process.env.DB_FILE || './data/app.sqlite';

    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const db = new Database(DB_FILE);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    db.exec(`
        CREATE TABLE IF NOT EXISTS employees (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         role TEXT NOT NULL,
         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS devices (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT NOT NULL,
           type TEXT NOT NULL,
           owner_id INTEGER NULL,
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
           FOREIGN KEY(owner_id) REFERENCES employees(id) ON DELETE SET NULL
            );
    `);

    return db;
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!_db) {
        throw new Error('Database not initialized');
    }
    return _db;
}

export function setupDb(): Database.Database {
    _db = initDatabase();
    return _db;
}