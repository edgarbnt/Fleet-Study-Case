import React, { useState, useEffect } from 'react';
import { Button } from '../Button.tsx';
import { DEVICE_KINDS, type DeviceKind, type Employee, type Device } from '../../types.ts';

export const DeviceEditForm: React.FC<{
    initial: Device;
    owners: Employee[];
    loading?: boolean;
    onSubmit: (v: Partial<Device>) => void;
    onCancel: () => void;
}> = ({ initial, owners, loading, onSubmit, onCancel }) => {
    const [form, set] = useState<{
        name: string;
        type: DeviceKind;
        owner_id: number | '' | null;
    }>({
        name: initial.name,
        type: initial.type,
        owner_id: initial.owner_id ?? '',
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
                    name: form.name,
                    type: form.type,
                    owner_id: form.owner_id === '' ? null : form.owner_id,
                });
            }}
        >
            <div className="form-row">
                <label>Name</label>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => set((f) => ({ ...f, name: e.target.value }))}
                />
            </div>

            <div className="form-row">
                <label>Type</label>
                <select
                    value={form.type}
                    onChange={(e) => set((f) => ({ ...f, type: e.target.value as DeviceKind }))}
                >
                    {DEVICE_KINDS.map((k) => (
                        <option key={k} value={k}>
                            {k}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-row">
                <label>Owner (optional)</label>
                <select
                    value={form.owner_id === '' ? '' : String(form.owner_id)}
                    onChange={(e) =>
                        set((f) => ({
                            ...f,
                            owner_id: e.target.value === '' ? '' : Number(e.target.value),
                        }))
                    }
                >
                    <option value="">No owner</option>
                    {owners.map((o) => (
                        <option key={o.id} value={o.id}>
                            {o.name} {o.role ? `(${o.role})` : ''}
                        </option>
                    ))}
                </select>
            </div>

            <div className="modal-actions">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button disabled={disabled} loading={loading}>Save</Button>
            </div>
        </form>
    );
};