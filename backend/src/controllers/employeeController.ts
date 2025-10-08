import { Request, Response } from 'express';
import * as employeeModel from '../models/employeeModel';
import * as deviceModel from '../models/deviceModel';

export const getAllEmployees = (_req: Request, res: Response) => {
    try {
        res.json(employeeModel.findAll());
    } catch {
        res.status(500).json({ error: 'Failed to retrieve employees' }); }
};

export const getEmployeeById = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employeeModel.findById(id);
        if (!employee)
            return res.status(404).json({ error: 'Employee not found' });
        res.json(employee);
    } catch { res.status(500).json({ error: 'Failed to retrieve employee' }); }
};

export const createEmployee = (req: Request, res: Response) => {
    try {
        const { name, role } = req.body;
        if (!name || !role)
            return res.status(400).json({ error: 'Name and role are required' });
        const newEmployee = employeeModel.create({ name, role });
        res.status(201).json(newEmployee);
    } catch { res.status(500).json({ error: 'Failed to create employee' }); }
};

export const updateEmployee = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { name, role } = req.body;
        if (!name && !role)
            return res.status(400).json({ error: 'At least one field to update is required' });
        const updated = employeeModel.update(id, { name, role });
        if (!updated)
            return res.status(404).json({ error: 'Employee not found' });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Failed to update employee' }); }
};

export const deleteEmployee = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const ok = employeeModel.remove(id);
        if (!ok)
            return res.status(404).json({ error: 'Employee not found' });
        res.status(204).send();
    } catch {
        res.status(500).json({ error: 'Failed to delete employee' }); }
};

export const getEmployeeDevices = (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const employee = employeeModel.findById(id);
        if (!employee)
            return res.status(404).json({ error: 'Employee not found' });
        res.json(deviceModel.findByOwner(id));
    } catch { res.status(500).json({ error: 'Failed to retrieve employee devices' }); }
};