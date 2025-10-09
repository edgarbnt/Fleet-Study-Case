import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { NewEmployee, NewDevice } from './types';

export function useEmployees() {
    const qc = useQueryClient();
    const list = useQuery({ queryKey: ['employees'], queryFn: api.getEmployees });
    const create = useMutation({
        mutationFn: (data: NewEmployee) => api.createEmployee(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] })
    });
    const remove = useMutation({
        mutationFn: (id: number) => api.deleteEmployee(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] })
    });
    return { list, create, remove };
}

export function useDevices() {
    const qc = useQueryClient();
    const list = useQuery({ queryKey: ['devices'], queryFn: api.getDevices });
    const create = useMutation({
        mutationFn: (data: NewDevice) => api.createDevice(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] })
    });
    const remove = useMutation({
        mutationFn: (id: number) => api.deleteDevice(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['devices'] })
    });
    return { list, create, remove };
}