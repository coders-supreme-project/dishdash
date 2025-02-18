// driverRoutes.js
import { Router, Response } from 'express';
import { registerDriver, fetchData, verifyDriver, updateDriver, getDriverByUserId ,getDriverLocation,updateDriverLocation,getCustomerGeoLocationByOrderId} from '../controller/driverController';
import { authenticateJWT } from '../middleware/authMiddleware';


const DriverRouter = Router();

DriverRouter.post('/register', registerDriver);
DriverRouter.post('/verifyDriver', verifyDriver);
DriverRouter.post('/dashboard', fetchData);
DriverRouter.get('/location/:driverId', getDriverLocation);
DriverRouter.put('/location', updateDriverLocation);
DriverRouter.get('/locationorder/:orderId', getDriverLocation);

DriverRouter.put('/updateDriver/:id', updateDriver);
DriverRouter.get('/:userId', getDriverByUserId);

export default DriverRouter;