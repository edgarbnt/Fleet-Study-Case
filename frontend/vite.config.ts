import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 3333);
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 4242);
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${BACKEND_PORT}`;

console.log(`[vite] BACKEND_URL=${BACKEND_URL}`);
console.log(`[vite] FRONTEND_PORT=${FRONTEND_PORT} BACKEND_PORT=${BACKEND_PORT}`);

export default defineConfig({
    plugins: [react()],
    server: {
        port: FRONTEND_PORT,
        host: true,
        proxy: {
            '/api': {
                target: BACKEND_URL,
                changeOrigin: true,
                secure: false,
            },
        },
    },
});