// driverRoutes.js
import { Router } from 'express';
import { registerDriver, fetchData, verifyDriver,getDriverLocation,updateDriverLocation } from '../controller/driverController';


const DriverRouter = Router();

DriverRouter.post('/register', registerDriver);
DriverRouter.post('/verifyDriver', verifyDriver);
DriverRouter.post('/dashboard', fetchData);
DriverRouter.get('/location/:driverId', getDriverLocation);
DriverRouter.post('/location/', updateDriverLocation);


export default DriverRouter;