import React, { useState } from 'react';
import { EmployeesTable } from '../components/employee/EmployeesTable.tsx';
import { EmployeeForm } from '../components/employee/EmployeeForm.tsx';
import { useEmployees } from '../useData';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import type { Employee } from '../types';
import { EmployeeEditForm } from '../components/employee/EmployeeEditForm.tsx';

export const EmployeesPage = () => {
    const { list, create, remove, update } = useEmployees();
    const [openCreate, setOpenCreate] = useState(false);
    const [selected, setSelected] = useState<Employee | null>(null);

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2>Employees</h2>
                <Button onClick={() => setOpenCreate(true)}>Add employee</Button>
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