import React, { useState } from 'react';
import { Button } from '../Button.tsx';
import { EMPLOYEE_ROLES, type EmployeeRole } from '../../types.ts';

export const EmployeeForm: React.FC<{
    onSubmit: (v: { name: string; role: EmployeeRole }) => void;
    loading?: boolean;
}> = ({ onSubmit, loading }) => {
    const [form, set] = useState<{ name: string; role: EmployeeRole }>({
        name: '',
        role: EMPLOYEE_ROLES[0],
    });

    const disabled = !form.name || !form.role || !!loading;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (disabled) return;
                onSubmit(form);
                set({ name: '', role: EMPLOYEE_ROLES[0] });
            }}
            className="form-row"
        >
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => set((f) => ({ ...f, name: e.target.value }))}
            />

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

            <Button disabled={disabled} loading={loading}>
                Add
            </Button>
        </form>
    );
};