import React from 'react';
import { Table, type Column } from './Table';
import type { Employee } from '../types';
import { Button } from './Button';

export const EmployeesTable: React.FC<{
    data: Employee[];
    onDelete?: (id: number) => void;
}> = ({ data, onDelete }) => {
    const columns: Column<Employee>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'role', header: 'Role', accessor: 'role' },
        {
            id: 'actions',
            header: 'Actions',
            render: (row) => (
                <Button variant="outline" small onClick={() => onDelete?.(row.id!)}>Delete</Button>
            ),
        },
    ];

    return <Table<Employee> data={data} columns={columns} empty="No employees yet." />;
};