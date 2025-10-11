import { Request, Response } from 'express';
import * as employeeModel from '../models/employeeModel';
import * as deviceModel from '../models/deviceModel';

export const getAllEmployees = (req: Request, res: Response) => {
    try {
        const role = typeof req.query.role === 'string' ? req.query.role : undefined;
        const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
        const pageSize = Math.max(1, Math.min(100, parseInt(String(req.query.pageSize || '10'), 10) || 10));
        const sortBy = typeof req.query.sortBy === 'string' ? (req.query.sortBy as any) : undefined;
        const sortDir = typeof req.query.sortDir === 'string' ? (req.query.sortDir as any) : undefined;

        const result = employeeModel.search({ role }, { page, pageSize }, { sortBy, sortDir });
        res.json(result);
    } catch {
        res.status(500).json({ error: 'Failed to retrieve employees' });
    }
};

export const getEmployeeById = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employeeModel.findById(id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch {
        res.status(500).json({ error: 'Failed to retrieve employee' });
    }
};

export const createEmployee = (req: Request, res: Response) => {
    try {
        const { name, role } = req.body;
        if (!name || !role) return res.status(400).json({ error: 'Name and role are required' });
        const created = employeeModel.create({ name, role });
        res.status(201).json(created);
    } catch {
        res.status(500).json({ error: 'Failed to create employee' });
    }
};

export const updateEmployee = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updates = req.body || {};
        const updated = employeeModel.update(id, updates);
        if (!updated) return res.status(404).json({ error: 'Employee not found' });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

export const deleteEmployee = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const ok = employeeModel.remove(id);
        if (!ok) return res.status(404).json({ error: 'Employee not found' });
        res.status(204).send();
    } catch {
        res.status(500).json({ error: 'Failed to delete employee' });
    }
};

export const getEmployeeDevices = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employeeModel.findById(id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.json(deviceModel.findByOwner(id));
    } catch {
        res.status(500).json({ error: 'Failed to retrieve employee devices' });
    }
};