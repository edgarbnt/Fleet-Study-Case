import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { DevicesPage } from './pages/DevicesPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/devices" element={<DevicesPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);