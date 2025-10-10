import { getDb } from '../config/database';
import { Device } from '../types';

type DeviceFilters = {
    types?: string[];
    ownerIds?: number[];
    includeUnassigned?: boolean;
};

type Pagination = { page: number; pageSize: number };

function buildWhere(filters: DeviceFilters | undefined) {
    const where: string[] = [];
    const params: any[] = [];

    if (filters?.types && filters.types.length > 0) {
        where.push(`type IN (${filters.types.map(() => '?').join(',')})`);
        params.push(...filters.types);
    }
    if ((filters?.ownerIds && filters.ownerIds.length > 0) || filters?.includeUnassigned) {
        const ownerClauses: string[] = [];
        if (filters.ownerIds && filters.ownerIds.length > 0) {
            ownerClauses.push(`owner_id IN (${filters.ownerIds.map(() => '?').join(',')})`);
            params.push(...filters.ownerIds);
        }
        if (filters.includeUnassigned) ownerClauses.push('owner_id IS NULL');
        where.push(`(${ownerClauses.join(' OR ')})`);
    }

    const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';
    return { whereSql, params };
}

export function search(filters: DeviceFilters | undefined, pagination: Pagination) {
    const { whereSql, params } = buildWhere(filters);
    const db = getDb();

    const totalStmt = db.prepare(`SELECT COUNT(*) as cnt FROM devices${whereSql}`);
    const { cnt: total } = totalStmt.get(...params) as { cnt: number };

    const limit = Math.max(1, Math.min(100, pagination.pageSize || 10));
    const page = Math.max(1, pagination.page || 1);
    const offset = (page - 1) * limit;

    const itemsStmt = db.prepare(`SELECT * FROM devices${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`);
    const items = itemsStmt.all(...params, limit, offset) as Device[];

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { items, page, pageSize: limit, total, totalPages };
}

export function findById(id: number): Device | undefined {
    return getDb().prepare('SELECT * FROM devices WHERE id = ?').get(id);
}

export function findByOwner(ownerId: number): Device[] {
    return getDb().prepare('SELECT * FROM devices WHERE owner_id = ?').all(ownerId);
}

export function create(device: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Device {
    const { lastInsertRowid } = getDb()
        .prepare('INSERT INTO devices (name, type, owner_id) VALUES (?, ?, ?)')
        .run(device.name, device.type, device.owner_id ?? null);
    return findById(Number(lastInsertRowid)) as Device;
}

export function update(id: number, updates: Partial<Device>): Device | undefined {
    const existing = findById(id);
    if (!existing) return undefined;

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.type !== undefined) { fields.push('type = ?'); values.push(updates.type); }
    if (updates.owner_id !== undefined) { fields.push('owner_id = ?'); values.push(updates.owner_id); }
    fields.push('updated_at = CURRENT_TIMESTAMP');

    getDb().prepare(`UPDATE devices SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return findById(id);
}

export function remove(id: number): boolean {
    const existing = findById(id);
    if (!existing) return false;
    getDb().prepare('DELETE FROM devices WHERE id = ?').run(id);
    return true;
}