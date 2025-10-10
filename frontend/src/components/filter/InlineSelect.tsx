import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Option = { value: string; label: string };

export const InlineSelect: React.FC<{
    value: string;
    options: Option[];
    onChange: (next: string) => void;
    ariaLabel?: string;
    direction?: 'up' | 'down';
}> = ({ value, options, onChange, ariaLabel = 'Select', direction = 'down' }) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const ref = useRef<HTMLDivElement>(null);

    const current = useMemo(
        () => options.find(o => o.value === value) ?? options[0],
        [options, value]
    );

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    const openMenu = () => {
        setOpen(true);
        const idx = Math.max(0, options.findIndex(o => o.value === value));
        setActiveIndex(idx);
    };
    const close = () => setOpen(false);
    const toggle = () => (open ? close() : openMenu());

    const selectAt = (i: number) => {
        if (i < 0 || i >= options.length) return;
        onChange(options[i].value);
        close();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault(); openMenu(); return;
        }
        if (!open) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min((i < 0 ? 0 : i) + 1, options.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max((i < 0 ? 0 : i) - 1, 0)); }
        else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
        else if (e.key === 'End') { e.preventDefault(); setActiveIndex(options.length - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (activeIndex >= 0) selectAt(activeIndex); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
    };

    return (
        <div
            ref={ref}
            className="ms-inline"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel}
            tabIndex={0}
            onClick={toggle}
            onKeyDown={onKeyDown}
            style={{ position: 'relative' }}
        >
            <span className="ms-inline-value">{current?.label}</span>
            <span className="ms-caret" aria-hidden>▾</span>
            {open && (
                <div className={['ms-menu', direction === 'up' ? 'up' : 'down'].join(' ')} role="listbox">
                    {options.map((o, i) => {
                        const selected = value === o.value;
                        const active = i === activeIndex;
                        return (
                            <div
                                key={o.value}
                                role="option"
                                aria-selected={selected}
                                className={['ms-option', selected ? 'selected' : '', active ? 'active' : ''].join(' ')}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={(e) => { e.stopPropagation(); selectAt(i); }}
                            >
                                {o.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};