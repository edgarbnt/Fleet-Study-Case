import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setupDb } from './src/config/database';
import apiRoutes from './src/routes';

const PORT = Number(process.env.PORT || 4000);

const db = setupDb();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

process.on('SIGINT', () => {
    console.log('Closing database connection...');
    db.close();
    process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API listening on http://0.0.0.0:${PORT}`);
});