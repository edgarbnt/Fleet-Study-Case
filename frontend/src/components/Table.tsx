import React from 'react';

export type Column<T> = {
    id: React.Key;
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
};

interface Props<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    empty?: string;
    onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
                                                         data,
                                                         columns,
                                                         empty = 'No data.',
                                                         onRowClick,
                                                     }: Props<T>) {
    if (!data.length) return <div className="table-empty">{empty}</div>;

    const stopIfInteractive = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, a, input, select, textarea, label')) {
            e.stopPropagation();
        }
    };

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
                    <tr
                        key={i}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                        style={onRowClick ? { cursor: 'pointer' } : undefined}
                    >
                        {columns.map((c) => (
                            <td key={String(c.id)} onClick={stopIfInteractive}>
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