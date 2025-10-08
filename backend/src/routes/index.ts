import { Router } from 'express';
import employeeRoutes from './employees';
import deviceRoutes from './devices';

const router = Router();
router.use('/employees', employeeRoutes);
router.use('/devices', deviceRoutes);

export default router;