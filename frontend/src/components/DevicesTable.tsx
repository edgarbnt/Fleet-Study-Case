import React from 'react';
import { Table, type Column } from './Table';
import type { Device, Employee } from '../types';
import { Button } from './Button';

export const DevicesTable: React.FC<{
    data: Device[];
    owners: Employee[];
    onDelete?: (id: number) => void;
}> = ({ data, owners, onDelete }) => {
    const ownerNameById = React.useMemo(() => {
        const m = new Map<number, string>();
        owners.forEach((o) => {
            if (o.id != null) m.set(o.id, o.name);
        });
        return m;
    }, [owners]);

    const columns: Column<Device>[] = [
        { id: 'name', header: 'Name', accessor: 'name' },
        { id: 'type', header: 'Type', accessor: 'type' },
        {
            id: 'owner',
            header: 'Owner',
            render: (row) =>
                row.owner_id != null ? (ownerNameById.get(row.owner_id) ?? '—') : '—',
        },
        {
            id: 'actions',
            header: 'Actions',
            render: (row) => (
                <Button variant="outline" small onClick={() => onDelete?.(row.id!)}>Delete</Button>
            ),
        },
    ];

    return <Table<Device> data={data} columns={columns} empty="No devices yet." />;
};