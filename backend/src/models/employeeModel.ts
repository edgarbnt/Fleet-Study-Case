import { getDb } from '../config/database';
import { Employee } from '../types';

type EmployeeFilters = { role?: string };
type Pagination = { page: number; pageSize: number };
type Sort = { sortBy?: 'name' | 'created_at' | 'updated_at'; sortDir?: 'asc' | 'desc' };

function buildWhere(filters: EmployeeFilters | undefined) {
    const where: string[] = [];
    const params: any[] = [];
    if (filters?.role) { where.push('role = ?'); params.push(filters.role); }
    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    return { whereSql, params };
}

export function search(filters: EmployeeFilters | undefined, pagination: Pagination, sort?: Sort) {
    const { whereSql, params } = buildWhere(filters);
    const db = getDb();

    const totalStmt = db.prepare(`SELECT COUNT(*) as cnt FROM employees${whereSql}`);
    const { cnt: total } = totalStmt.get(...params) as { cnt: number };

    const limit = Math.max(1, Math.min(100, pagination.pageSize || 10));
    const page = Math.max(1, pagination.page || 1);
    const offset = (page - 1) * limit;

    const allowedCols: Record<string, string> = {
        id: 'id',
        name: 'name',
        created_at: 'created_at',
        updated_at: 'updated_at',
    };
    let orderBy = 'ORDER BY id';
    if (sort?.sortBy && allowedCols[sort.sortBy]) {
        const dir = String(sort.sortDir || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        orderBy = `ORDER BY ${allowedCols[sort.sortBy]} ${dir}`;
    }

    const itemsStmt = db.prepare(`SELECT * FROM employees${whereSql} ${orderBy} LIMIT ? OFFSET ?`);
    const items = itemsStmt.all(...params, limit, offset) as Employee[];

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, page, pageSize: limit, total, totalPages };
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

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.role !== undefined) { fields.push('role = ?'); values.push(updates.role); }
    if (!fields.length) return existing;

    fields.push('updated_at = CURRENT_TIMESTAMP');

    getDb().prepare(`UPDATE employees SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return findById(id);
}

export function remove(id: number): boolean {
    const existing = findById(id);
    if (!existing) return false;
    getDb().prepare('UPDATE devices SET owner_id = NULL WHERE owner_id = ?').run(id);
    getDb().prepare('DELETE FROM employees WHERE id = ?').run(id);
    return true;
}