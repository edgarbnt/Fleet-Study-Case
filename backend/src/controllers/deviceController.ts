import { Request, Response } from 'express';
import * as deviceModel from '../models/deviceModel';
import * as employeeModel from '../models/employeeModel';

function toArray(v: undefined | string | string[]): string[] {
    if (v === undefined) return [];
    return Array.isArray(v) ? v : [v];
}

export const getAllDevices = (req: Request, res: Response) => {
    try {
        const types = toArray(req.query.type).filter(Boolean) as string[];

        const ownerRaw = toArray(req.query.owner_id).filter(Boolean);
        const ownerIds: number[] = [];
        let includeUnassigned = false;
        for (const o of ownerRaw) {
            if (String(o).toLowerCase() === 'null') includeUnassigned = true;
            else {
                const n = parseInt(String(o), 10);
                if (Number.isNaN(n)) return res.status(400).json({ error: 'Invalid owner_id query parameter' });
                ownerIds.push(n);
            }
        }

        const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
        const pageSize = Math.max(1, Math.min(100, parseInt(String(req.query.pageSize || '10'), 10) || 10));
        const sortBy = typeof req.query.sortBy === 'string' ? (req.query.sortBy as any) : undefined;
        const sortDir = typeof req.query.sortDir === 'string' ? (req.query.sortDir as any) : undefined;

        const result = deviceModel.search(
            { type: types.length ? types : undefined, ownerIds, includeUnassigned },
            { page, pageSize },
            { sortBy, sortDir },
        );
        res.json(result);
    } catch {
        res.status(500).json({ error: 'Failed to retrieve devices' });
    }
};

export const getDeviceById = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const device = deviceModel.findById(id);
        if (!device) return res.status(404).json({ error: 'Device not found' });
        res.json(device);
    } catch { res.status(500).json({ error: 'Failed to retrieve device' }); }
};

export const createDevice = (req: Request, res: Response) => {
    try {
        const { name, type, owner_id } = req.body;
        if (!name || !type) return res.status(400).json({ error: 'Name and type are required' });
        if (owner_id) {
            const employee = employeeModel.findById(owner_id);
            if (!employee) return res.status(400).json({ error: 'Invalid owner_id, employee not found' });
        }
        const newDevice = deviceModel.create({ name, type, owner_id });
        res.status(201).json(newDevice);
    } catch { res.status(500).json({ error: 'Failed to create device' }); }
};

export const updateDevice = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, type, owner_id } = req.body;
        if (!name && !type && owner_id === undefined) {
            return res.status(400).json({ error: 'At least one field to update is required' });
        }
        if (owner_id !== undefined && owner_id !== null) {
            const employee = employeeModel.findById(owner_id);
            if (!employee) return res.status(400).json({ error: 'Invalid owner_id, employee not found' });
        }
        const updated = deviceModel.update(id, { name, type, owner_id });
        if (!updated) return res.status(404).json({ error: 'Device not found' });
        res.json(updated);
    } catch { res.status(500).json({ error: 'Failed to update device' }); }
};

export const deleteDevice = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const ok = deviceModel.remove(id);
        if (!ok) return res.status(404).json({ error: 'Device not found' });
        res.status(204).send();
    } catch { res.status(500).json({ error: 'Failed to delete device' }); }
};

export const assignDevice = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { owner_id } = req.body;
        if (owner_id === undefined) return res.status(400).json({ error: 'owner_id is required' });
        const dev = deviceModel.findById(id);
        if (!dev) return res.status(404).json({ error: 'Device not found' });
        if (owner_id !== null) {
            const employee = employeeModel.findById(owner_id);
            if (!employee) return res.status(400).json({ error: 'Invalid owner_id, employee not found' });
        }
        const updated = deviceModel.update(id, { owner_id });
        res.json(updated);
    } catch { res.status(500).json({ error: 'Failed to assign device' }); }
};