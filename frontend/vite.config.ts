import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
    const FRONTEND_PORT = Number(process.env.FRONTEND_PORT || 5173);
    const BACKEND_PORT = String(process.env.BACKEND_PORT || 4000);

    console.log(`[vite] FRONTEND_PORT=${FRONTEND_PORT} BACKEND_PORT=${BACKEND_PORT}`);

    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: FRONTEND_PORT,
            strictPort: true,
            watch: { usePolling: true },
            proxy: {
                "/api": {
                    target: `http://api:${BACKEND_PORT}`,
                    changeOrigin: true
                }
            }
        }
    };
});