import React, { useState, useEffect } from 'react';
import { Button } from '../Button.tsx';
import { DEVICE_KINDS, type DeviceKind, type Employee, type Device } from '../../types.ts';
import { SingleSelectChip, type Option } from '../filter/SingleSelectChip';

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

    const ownerOptions: Option[] = [
        { value: '', label: 'No owner' },
        ...owners.map(o => ({ value: String(o.id!), label: `${o.name}${o.role ? ` (${o.role})` : ''}` })),
    ];

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (disabled) return;
                onSubmit({
                    name: form.name,
                    type: form.type,
                    owner_id: form.owner_id === '' ? null : (form.owner_id as number),
                });
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
                aria-label="Type"
            >
                {DEVICE_KINDS.map((k) => (
                    <option key={k} value={k}>
                        {k}
                    </option>
                ))}
            </select>

            <SingleSelectChip
                label="Owner (optional)"
                placeholder="Search owner…"
                options={ownerOptions}
                value={form.owner_id === '' ? '' : String(form.owner_id)}
                onChange={(val) => set((f) => ({ ...f, owner_id: val === '' ? '' : Number(val) }))}
                searchable
                searchPlaceholder="Type a name…"
            />

            <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                <Button disabled={disabled} loading={loading}>Save</Button>
            </div>
        </form>
    );
};