import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/AppShell';
import { AppRoutes } from './routes';

const client = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

export const App: React.FC = () => (
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <QueryClientProvider client={client}>
            <AppShell>
                <AppRoutes />
            </AppShell>
        </QueryClientProvider>
    </BrowserRouter>
);