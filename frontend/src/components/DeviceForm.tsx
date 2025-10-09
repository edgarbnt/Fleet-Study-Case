import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { DEVICE_KINDS, type DeviceKind, type Employee } from '../types';

export const DeviceForm: React.FC<{
    owners: Employee[];
    onSubmit: (v: { name: string; type: DeviceKind; owner_id: number | null }) => void;
    loading?: boolean;
}> = ({ owners, onSubmit, loading }) => {
    const [form, set] = useState<{
        name: string;
        type: DeviceKind;
        owner_id: number | '' | null;
    }>({
        name: '',
        type: DEVICE_KINDS[0],
        owner_id: '',
    });

    useEffect(() => {
        if (form.owner_id && !owners.find(o => o.id === form.owner_id)) {
            set(f => ({ ...f, owner_id: '' }));
        }
    }, [owners]);

    const disabled = !form.name || !form.type || !!loading;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (disabled) return;
                onSubmit({
                    name: form.name.trim(),
                    type: form.type,
                    owner_id: form.owner_id === '' ? null : Number(form.owner_id),
                });
                set({ name: '', type: DEVICE_KINDS[0], owner_id: '' });
            }}
            className="form-row"
        >
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => set((f) => ({ ...f, name: e.target.value }))}
            />

            <select
                value={form.type}
                onChange={(e) => set((f) => ({ ...f, type: e.target.value as DeviceKind }))}
                aria-label="Device type"
            >
                {DEVICE_KINDS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>

            <select
                value={form.owner_id ?? ''}
                onChange={(e) => {
                    const v = e.target.value;
                    set((f) => ({ ...f, owner_id: v === '' ? '' : Number(v) }));
                }}
                aria-label="Owner (optional)"
            >
                <option value="">No owner</option>
                {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                        {o.name} {o.role ? `(${o.role})` : ''}
                    </option>
                ))}
            </select>

            <Button disabled={disabled} loading={loading}>Add</Button>
        </form>
    );
};