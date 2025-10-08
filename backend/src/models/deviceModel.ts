import { getDb } from '../config/database';
import { Device } from '../types';

export function findAll(): Device[] {
    return getDb().prepare('SELECT * FROM devices ORDER BY id DESC').all();
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

    if (updates.name !== undefined) {
        fields.push('name = ?'); values.push(updates.name);
    }
    if (updates.type !== undefined) {
        fields.push('type = ?'); values.push(updates.type);
    }
    if (updates.owner_id !== undefined) {
        fields.push('owner_id = ?'); values.push(updates.owner_id);
    }
    fields.push('updated_at = CURRENT_TIMESTAMP');

    getDb().prepare(`UPDATE devices SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
    return findById(id);
}

export function remove(id: number): boolean {
    const existing = findById(id);
    if (!existing)
        return false;
    getDb().prepare('DELETE FROM devices WHERE id = ?').run(id);
    return true;
}