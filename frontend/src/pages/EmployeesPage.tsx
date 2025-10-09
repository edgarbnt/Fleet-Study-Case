import React from 'react';
import { EmployeesTable } from '../components/EmployeesTable';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployees } from '../useData';
import { Card } from '../components/Card';

export const EmployeesPage = () => {
    const { list, create, remove } = useEmployees();
    return (
        <div className="fade-in">
            <h2>Employees</h2>
            <Card className="mt">
                <EmployeeForm
                    loading={create.isPending}
                    onSubmit={v => create.mutate(v)}
                />
                <div style={{ marginTop: '1rem' }}>
                    {list.isLoading
                        ? 'Loading...'
                        : <EmployeesTable data={list.data || []} onDelete={id => remove.mutate(id)} />}
                </div>
            </Card>
        </div>
    );
};