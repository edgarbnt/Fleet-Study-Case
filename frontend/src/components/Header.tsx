import React from 'react';
interface Props { theme: 'light' | 'dark'; toggle: () => void; }
export const Header: React.FC<Props> = ({ theme, toggle }) => (
    <header className="header">
        <h1 className="logo">Fleet Manager</h1>
        <button onClick={toggle} className="btn small">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
    </header>
);