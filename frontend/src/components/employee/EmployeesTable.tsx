import React from 'react';
import { Table, type Column } from '../Table.tsx';
import type { Employee } from '../../types.ts';
import { Button } from '../Button.tsx';

export const EmployeesTable: React.FC<{
    data: Employee[];
    onDelete?: (id: number) => void;
    onRowClick?: (employee: Employee) => void;
}> = ({ data, onDelete, onRowClick }) => {
    const columns: Column<Employee>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'role', header: 'Role', accessor: 'role' },
        {
            id: 'actions',
            header: 'Actions',
            render: (row) => (
                <Button variant="primary" small onClick={() => onDelete?.(row.id!)}>Delete</Button>
            ),
        },
    ];

    return <Table<Employee> data={data} columns={columns} empty="No employees yet." onRowClick={onRowClick} />;
};