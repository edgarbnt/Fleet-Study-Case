import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<'light'|'dark'>('light');
    React.useEffect(() => {
        document.body.classList.toggle('theme-dark', theme === 'dark');
    }, [theme]);

    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-content">
                <Header theme={theme} toggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
                <main className="app-main">{children}</main>
            </div>
        </div>
    );
};