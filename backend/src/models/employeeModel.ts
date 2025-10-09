import { getDb } from '../config/database';
import { Employee } from '../types';

export function findAll(): Employee[] {
    return getDb().prepare('SELECT * FROM employees ORDER BY id').all();
}

export function findById(id: number): Employee | undefined {
    return getDb().prepare('SELECT * FROM employees WHERE id = ?').get(id);
}

export function create(employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Employee {
    const { lastInsertRowid } = getDb()
        .prepare('INSERT INTO employees (name, role) VALUES (?, ?)')
        .run(employee.name, employee.role);
    return findById(Number(lastInsertRowid)) as Employee;
}

export function update(id: number, updates: Partial<Employee>): Employee | undefined {
    const existing = findById(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.role) { fields.push('role = ?'); values.push(updates.role); }
    fields.push('updated_at = CURRENT_TIMESTAMP');

    getDb().prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return findById(id);
}

export function remove(id: number): boolean {
    const existing = findById(id);
    if (!existing)
        return false;
    getDb().prepare('UPDATE devices SET owner_id = NULL WHERE owner_id = ?').run(id);
    getDb().prepare('DELETE FROM employees WHERE id = ?').run(id);
    return true;
}