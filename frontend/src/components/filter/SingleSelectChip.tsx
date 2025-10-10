import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

export type Option = { value: string; label: string };

type Direction = 'auto' | 'up' | 'down';

export const SingleSelectChip: React.FC<{
    label?: string;
    placeholder?: string;
    options: Option[];
    value: string | '';
    onChange: (next: string | '') => void;
    className?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    menuDirection?: Direction;
}> = ({
          label,
          placeholder = 'Select…',
          options,
          value,
          onChange,
          className,
          searchable,
          searchPlaceholder = 'Search…',
          menuDirection = 'auto',
      }) => {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [query, setQuery] = useState('');
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const labelByValue = useMemo(() => {
        const m = new Map<string, string>();
        options.forEach(o => m.set(o.value, o.label));
        return m;
    }, [options]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!searchable || !q) return options;
        return options.filter(o => o.label.toLowerCase().includes(q));
    }, [options, searchable, query]);

    const selectedIndex = useMemo(
        () => filtered.findIndex(o => o.value === value),
        [filtered, value]
    );

    useEffect(() => {
        const onDocDown = (e: MouseEvent) => {
            const target = e.target as Node;
            if (boxRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDocDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocDown);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    useEffect(() => {
        if (open && searchable) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [open, searchable]);

    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : (filtered.length ? 0 : -1));
        }
    }, [open]);

    useEffect(() => {
        setActiveIndex(idx => {
            if (filtered.length === 0) return -1;
            if (idx < 0) return 0;
            if (idx >= filtered.length) return filtered.length - 1;
            return idx;
        });
    }, [filtered.length]);

    const openMenu = () => setOpen(true);
    const closeMenu = () => setOpen(false);
    const toggleMenu = () => (open ? closeMenu() : openMenu());

    const selectAt = (i: number) => {
        if (i < 0 || i >= filtered.length) return;
        onChange(filtered[i].value);
        closeMenu();
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault(); openMenu(); return;
        }
        if (!open) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min((i < 0 ? 0 : i) + 1, filtered.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max((i < 0 ? 0 : i) - 1, 0)); }
        else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
        else if (e.key === 'End') { e.preventDefault(); setActiveIndex(filtered.length - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); if (activeIndex >= 0) selectAt(activeIndex); }
        else if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    };

    const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min((i < 0 ? 0 : i) + 1, filtered.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max((i < 0 ? 0 : i) - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); if (activeIndex >= 0) selectAt(activeIndex); }
    };

    const [floatingStyle, setFloatingStyle] = useState<{ top: number; left: number; width: number; maxHeight: number; direction: 'up' | 'down' } | null>(null);
    useEffect(() => {
        if (!open || !boxRef.current) return;

        const GAP = 6;
        const rect = boxRef.current.getBoundingClientRect();
        const belowSpace = window.innerHeight - (rect.bottom);
        const aboveSpace = rect.top;
        let dir: 'up' | 'down';
        if (menuDirection === 'up') dir = 'up';
        else if (menuDirection === 'down') dir = 'down';
        else dir = belowSpace >= 180 || belowSpace >= aboveSpace ? 'down' : 'up';

        const avail = dir === 'down' ? belowSpace - GAP : aboveSpace - GAP;
        const maxH = Math.max(120, Math.min(260, avail));
        const top = dir === 'down'
            ? Math.round(rect.bottom + GAP)
            : Math.round(rect.top - GAP - maxH);

        const left = Math.round(rect.left);
        const width = Math.round(rect.width);

        setFloatingStyle({ top, left, width, maxHeight: maxH, direction: dir });

        const update = () => {
            const r = boxRef.current?.getBoundingClientRect();
            if (!r) return;
            const bSpace = window.innerHeight - r.bottom;
            const aSpace = r.top;
            let d: 'up' | 'down';
            if (menuDirection === 'up') d = 'up';
            else if (menuDirection === 'down') d = 'down';
            else d = bSpace >= 180 || bSpace >= aSpace ? 'down' : 'up';
            const avail2 = d === 'down' ? bSpace - GAP : aSpace - GAP;
            const maxH2 = Math.max(120, Math.min(260, avail2));
            const top2 = d === 'down' ? Math.round(r.bottom + GAP) : Math.round(r.top - GAP - maxH2);
            setFloatingStyle({
                top: top2,
                left: Math.round(r.left),
                width: Math.round(r.width),
                maxHeight: maxH2,
                direction: d
            });
        };
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [open, menuDirection]);

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
            </div>

            {open && floatingStyle
                ? ReactDOM.createPortal(
                    <div
                        ref={menuRef}
                        className={['ms-menu', floatingStyle.direction].join(' ')}
                        role="listbox"
                        style={{
                            position: 'fixed',
                            top: floatingStyle.top,
                            left: floatingStyle.left,
                            width: floatingStyle.width,
                            maxHeight: floatingStyle.maxHeight,
                            zIndex: 1100,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {searchable && (
                            <div className="ms-search" onClick={(e) => e.stopPropagation()}>
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={onSearchKeyDown}
                                    placeholder={searchPlaceholder}
                                    aria-label="Search"
                                />
                            </div>
                        )}
                        {filtered.map((o, i) => {
                            const selected = value === o.value;
                            const active = i === activeIndex;
                            return (
                                <div
                                    key={o.value}
                                    role="option"
                                    aria-selected={selected}
                                    className={[
                                        'ms-option',
                                        selected ? 'selected' : '',
                                        active ? 'active' : '',
                                    ].join(' ')}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    onClick={() => selectAt(i)}
                                >
                                    {o.label}
                                </div>
                            );
                        })}
                        {!filtered.length && (
                            <div className="ms-option disabled" aria-disabled="true">No results</div>
                        )}
                    </div>,
                    document.body
                )
                : null}
        </div>
    );
};