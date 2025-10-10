import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Paginated } from './api';
import type { NewEmployee, NewDevice, Employee, Device } from './types';

export function useEmployees(filters?: { role?: string; page?: number; pageSize?: number }) {
    const qc = useQueryClient();
    const list = useQuery<Paginated<Employee>>({
        queryKey: ['employees', filters || {}],
        queryFn: () => api.getEmployees(filters),
    });
    const create = useMutation({
        mutationFn: (data: NewEmployee) => api.createEmployee(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] })
    });
    const remove = useMutation({
        mutationFn: (id: number) => api.deleteEmployee(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] })
    });
    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Employee> }) => api.updateEmployee(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] })
    });
    return { list, create, remove, update };
}

export function useDevices(filters?: { type?: string[]; owner_id?: Array<number|'null'>; page?: number; pageSize?: number }) {
    const qc = useQueryClient();
    const list = useQuery<Paginated<Device>>({
        queryKey: ['devices', filters || {}],
        queryFn: () => api.getDevices(filters),
    });
    const create = useMutation({
        mutationFn: (data: NewDevice) => api.createDevice(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] })
    });
    const remove = useMutation({
        mutationFn: (id: number) => api.deleteDevice(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] })
    });
    const update = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Device> }) => api.updateDevice(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] })
    });
    return { list, create, remove, update };
}