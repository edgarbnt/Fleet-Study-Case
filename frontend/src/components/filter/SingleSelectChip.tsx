import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Option = { value: string; label: string };

export const SingleSelectChip: React.FC<{
    label?: string;
    placeholder?: string;
    options: Option[];
    value: string | '';
    onChange: (next: string | '') => void;
    className?: string;
}> = ({ label, placeholder = 'Select…', options, value, onChange, className }) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const boxRef = useRef<HTMLDivElement>(null);

    const labelByValue = useMemo(() => {
        const m = new Map<string, string>();
        options.forEach(o => m.set(o.value, o.label));
        return m;
    }, [options]);

    const selectedIndex = useMemo(
        () => options.findIndex(o => o.value === value),
        [options, value]
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target as Node)) setOpen(false);
        };
        const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', handler);
        document.addEventListener('keydown', keyHandler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('keydown', keyHandler);
        };
    }, []);

    const openMenu = () => {
        setOpen(true);
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : (options.length ? 0 : -1));
    };
    const closeMenu = () => setOpen(false);
    const toggleMenu = () => (open ? closeMenu() : openMenu());

    const selectAt = (i: number) => {
        if (i < 0 || i >= options.length) return;
        onChange(options[i].value);
        closeMenu();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openMenu(); return; }
        if (!open) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min((i < 0 ? 0 : i) + 1, options.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max((i < 0 ? 0 : i) - 1, 0)); }
        else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
        else if (e.key === 'End') { e.preventDefault(); setActiveIndex(options.length - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (activeIndex >= 0) selectAt(activeIndex); }
        else if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    };

    return (
        <div className={['ms-container', className].filter(Boolean).join(' ')}>
            {label ? <div className="ms-label">{label}</div> : null}

            <div
                ref={boxRef}
                className={['ms-box', 'ms-pill', open ? 'open' : ''].join(' ')}
                role="combobox"
                aria-expanded={open}
                tabIndex={0}
                onClick={toggleMenu}
                onKeyDown={onKeyDown}
                style={{ position: 'relative' }}
            >
                <div className="ms-chips">
                    {value ? (
                        <span className="ms-chip" onClick={(e) => e.stopPropagation()}>
              {labelByValue.get(value) ?? value}
                            <button
                                className="ms-chip-x"
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                                aria-label={`Remove ${value}`}
                            >
                ×
              </button>
            </span>
                    ) : (
                        <span className="ms-placeholder">{placeholder}</span>
                    )}
                </div>

                <span className="ms-caret" aria-hidden>▾</span>

                {open && (
                    <div className="ms-menu down" role="listbox">
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
                        {!options.length && <div className="ms-option disabled" aria-disabled="true">No options</div>}
                    </div>
                )}
            </div>
        </div>
    );
};