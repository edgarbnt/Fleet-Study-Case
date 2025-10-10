import React from 'react';
import { Button } from '../Button.tsx';
import { InlineSelect, type Option } from './InlineSelect.tsx';

interface Props {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: number[];
    onPageSizeChange?: (size: number) => void;
}

export const Pagination: React.FC<Props> = ({
                                                page, pageSize, total, totalPages,
                                                onPageChange,
                                                pageSizeOptions = [10, 20, 50],
                                                onPageSizeChange,
                                            }) => {
    if (totalPages <= 1 && !onPageSizeChange) return null;

    const prev = () => onPageChange(Math.max(1, page - 1));
    const next = () => onPageChange(Math.min(totalPages, page + 1));

    const start = total ? (page - 1) * pageSize + 1 : 0;
    const end = Math.min(total, page * pageSize);

    const pages: (number | 'dots')[] = [];
    const DOTS: 'dots' = 'dots';
    const neighbors = [page - 1, page, page + 1].filter(n => n >= 1 && n <= totalPages);
    const unique = (arr: number[]) => Array.from(new Set(arr));
    const base = unique([1, ...neighbors, totalPages]).sort((a, b) => a - b);
    for (let i = 0; i < base.length; i++) {
        if (i > 0 && base[i] !== base[i - 1] + 1) pages.push(DOTS);
        pages.push(base[i]);
    }

    const sizeOpts: Option[] = pageSizeOptions.map(n => ({ value: String(n), label: String(n) }));

    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPages || totalPages === 0;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {onPageSizeChange ? (
                    <>
                        <span className="text-muted" style={{ fontSize: 12 }}>Rows per page:</span>
                        <InlineSelect
                            ariaLabel="Rows per page"
                            value={String(pageSize)}
                            options={sizeOpts}
                            onChange={(val) => onPageSizeChange(Number(val))}
                            direction="up"
                        />
                    </>
                ) : (
                    <div className="text-muted" style={{ fontSize: 12 }}>
                        Showing {start}-{end} of {total}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="text-muted" style={{ fontSize: 12 }}>
                    Showing {start}-{end} of {total}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Button variant="outline" onClick={prev} disabled={prevDisabled}>Prev</Button>
                    {pages.map((p, i) => p === 'dots'
                        ? <span key={`d${i}`} style={{ padding: '0 6px', opacity: .6 }}>…</span>
                        : <Button
                            key={p}
                            variant={p === page ? 'primary' : 'outline'}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </Button>
                    )}
                    <Button variant="outline" onClick={next} disabled={nextDisabled}>Next</Button>
                </div>
            </div>
        </div>
    );
};