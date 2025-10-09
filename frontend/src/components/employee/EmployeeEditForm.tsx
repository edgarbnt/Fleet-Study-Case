import React, { useState } from 'react';
import { Button } from '../Button.tsx';
import { EMPLOYEE_ROLES, type EmployeeRole, type Employee } from '../../types.ts';

export const EmployeeEditForm: React.FC<{
    initial: Employee;
    loading?: boolean;
    onSubmit: (v: Partial<Employee>) => void;
    onCancel: () => void;
}> = ({ initial, loading, onSubmit, onCancel }) => {
    const [form, set] = useState<{ name: string; role: EmployeeRole }>({
        name: initial.name,
        role: initial.role,
    });

    const disabled = !form.name || !form.role || !!loading;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (disabled) return;
                onSubmit(form);
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
                <label>Role</label>
                <select
                    value={form.role}
                    onChange={(e) => set((f) => ({ ...f, role: e.target.value as EmployeeRole }))}
                >
                    {EMPLOYEE_ROLES.map((r) => (
                        <option key={r} value={r}>
                            {r}
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