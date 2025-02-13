// driverRoutes.js
import { Router } from 'express';
import { registerDriver, fetchData, verifyDriver } from '../controller/driverController';
import authMiddleware from '../middlewares/authMiddleware';

const DriverRouter = Router();

DriverRouter.post('/register', authMiddleware, registerDriver);
DriverRouter.post('/verifyDriver', authMiddleware, verifyDriver);
DriverRouter.post('/dashboard', authMiddleware, fetchData);

export default DriverRouter;