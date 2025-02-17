// driverRoutes.js
import { Router, RequestHandler, Response, NextFunction } from 'express';
import { registerDriver, fetchData, verifyDriver, updateDriver, getDriverByUserId ,getDriverLocation,updateDriverLocation} from '../controller/driverController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types';


const DriverRouter = Router();

DriverRouter.post('/register', registerDriver);
DriverRouter.post('/verifyDriver', verifyDriver);
DriverRouter.post('/dashboard', fetchData);
DriverRouter.get('/location/:driverId', getDriverLocation);
DriverRouter.post('/location/', updateDriverLocation);

DriverRouter.put('/updateDriver/:id', updateDriver);
DriverRouter.get('/:userId', getDriverByUserId);

export default DriverRouter;