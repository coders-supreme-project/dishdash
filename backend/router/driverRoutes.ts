// driverRoutes.js
import { Router } from 'express';
import { registerDriver, fetchData, verifyDriver } from '../controller/driverController';
import { authenticateJWT } from '../midlleware/authmiddleware';

const DriverRouter = Router();

DriverRouter.post('/register', authenticateJWT, registerDriver);
DriverRouter.post('/verifyDriver', authenticateJWT, verifyDriver);
DriverRouter.post('/dashboard', authenticateJWT, fetchData);

export default DriverRouter;