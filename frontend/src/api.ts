import type { Employee, NewEmployee, Device, NewDevice } from './types';

const BASE = '/api';
const url = (p: string) => `${BASE}${p.startsWith('/') ? p : `/${p}`}`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url(path), options);
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.error || res.statusText);
    return data as T;
}

export const api = {
    getEmployees: () => request<Employee[]>('/employees'),
    createEmployee: (payload: NewEmployee) =>
        request<Employee>('/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }),
    deleteEmployee: (id: number) =>
        request<void>(`/employees/${id}`, { method: 'DELETE' }),

    getDevices: () => request<Device[]>('/devices'),
    createDevice: (payload: NewDevice) =>
        request<Device>('/devices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }),
    deleteDevice: (id: number) =>
        request<void>(`/devices/${id}`, { method: 'DELETE' }),
};