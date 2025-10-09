import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => (
    <aside className="sidebar">
        <nav>
            <NavLink to="/employees" className="nav-link">Employees</NavLink>
            <NavLink to="/devices" className="nav-link">Devices</NavLink>
        </nav>
    </aside>
);