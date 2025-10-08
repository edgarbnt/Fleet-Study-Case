import { Router } from 'express';
import * as deviceController from '../controllers/deviceController';

const router = Router();

router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.post('/:id/assign', deviceController.assignDevice);

export default router;