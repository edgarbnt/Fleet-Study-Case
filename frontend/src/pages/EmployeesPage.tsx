import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmployeesTable } from '../components/employee/EmployeesTable.tsx';
import { EmployeeForm } from '../components/employee/EmployeeForm.tsx';
import { useEmployees } from '../useData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { Employee } from '../types';
import { EMPLOYEE_ROLES } from '../types';
import { EmployeeEditForm } from '../components/employee/EmployeeEditForm.tsx';
import { SingleSelectChip, type Option } from '../components/SingleSelectChip.tsx';

export const EmployeesPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roleParam = searchParams.get('role') || '';

    const employeesFilters = useMemo(() => ({ role: roleParam || undefined }), [roleParam]);

    const { list, create, remove, update } = useEmployees(employeesFilters);
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Employee | null>(null);

    const setParam = (key: string, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (!value) next.delete(key);
        else next.set(key, value);
        setSearchParams(next, { replace: true });
    };

    const roleOptions: Option[] = EMPLOYEE_ROLES.map(r => ({ value: r, label: r }));

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Employees</h2>
            </div>

            <div className="filter-row mt">
                <SingleSelectChip
                    label="Role"
                    placeholder="Select role…"
                    options={roleOptions}
                    value={roleParam}
                    onChange={(val) => setParam('role', val)}
                />

                <div style={{ marginLeft: 'auto' }}>
                    <Button onClick={() => setOpenCreate(true)}>Add employee</Button>
                </div>
            </div>

            <Card className="mt">
                <div>
                    {list.isLoading
                        ? 'Loading...'
                        : <EmployeesTable
                            data={list.data || []}
                            onDelete={id => remove.mutate(id)}
                            onRowClick={(emp) => setSelected(emp)}
                        />}
                </div>
            </Card>

            <Modal open={openCreate} title="Add employee" onClose={() => setOpenCreate(false)}>
                <EmployeeForm
                    loading={create.isPending}
                    onSubmit={(v) => create.mutate(v, { onSuccess: () => setOpenCreate(false) })}
                />
            </Modal>

            <Modal open={!!selected} title={selected ? `Edit employee: ${selected.name}` : 'Edit employee'} onClose={() => setSelected(null)}>
                {selected ? (
                    <EmployeeEditForm
                        initial={selected}
                        loading={update.isPending}
                        onCancel={() => setSelected(null)}
                        onSubmit={(data) => update.mutate({ id: selected.id!, data }, { onSuccess: () => setSelected(null) })}
                    />
                ) : null}
            </Modal>
        </div>
    );
};