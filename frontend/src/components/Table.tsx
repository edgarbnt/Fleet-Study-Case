import React from 'react';

export interface Column<T> {
    id: React.Key;
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
}

interface Props<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    empty?: string;
}

export function Table<T extends Record<string, any>>({
                                                         data,
                                                         columns,
                                                         empty = 'No data.',
                                                     }: Props<T>) {
    if (!data.length) return <div className="table-empty">{empty}</div>;
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    {columns.map((c) => (
                        <th key={String(c.id)}>{c.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((c) => (
                            <td key={String(c.id)}>
                                {c.render ? c.render(row) : String(c.accessor ? row[c.accessor] ?? '' : '')}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}