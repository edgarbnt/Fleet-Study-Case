import Database from "better-sqlite3";
import { existsSync } from "fs";
import { mkdirSync } from "fs";
import path from "path";
import { DEVICE_TYPES, ROLES } from "./types";

const DEFAULT_DB_FILE = process.env.DATABASE_FILE || "/data/app.sqlite";

function ensureDir(filePath: string) {
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

export const db = (() => {
    ensureDir(DEFAULT_DB_FILE);
    const instance = new Database(DEFAULT_DB_FILE);
    instance.pragma("journal_mode = WAL");
    instance.pragma("foreign_keys = ON");

    instance.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      owner_id INTEGER NULL,
      FOREIGN KEY(owner_id) REFERENCES employees(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
    CREATE INDEX IF NOT EXISTS idx_devices_type ON devices(type);
    CREATE INDEX IF NOT EXISTS idx_devices_owner ON devices(owner_id);
  `);

    // Seed minimal data only if empty
    const empCount = instance.prepare("SELECT COUNT(*) as c FROM employees").get() as { c: number };
    if (empCount.c === 0) {
        const insertEmp = instance.prepare("INSERT INTO employees (name, role) VALUES (?, ?)");
        insertEmp.run("hello world", ROLES[0]);
        insertEmp.run("edgar brunet", ROLES[1]);
        insertEmp.run("lorem ipsum", ROLES[2]);
    }
    const devCount = instance.prepare("SELECT COUNT(*) as c FROM devices").get() as { c: number };
    if (devCount.c === 0) {
        const insertDev = instance.prepare("INSERT INTO devices (name, type, owner_id) VALUES (?, ?, ?)");
        insertDev.run("asus", DEVICE_TYPES[0], 1);
        insertDev.run("mouse", DEVICE_TYPES[1], 1);
        insertDev.run("screen", DEVICE_TYPES[2], 2);
    }

    return instance;
})();