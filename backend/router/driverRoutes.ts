// driverRoutes.js
import { Router, RequestHandler, Response, NextFunction } from 'express';
import { registerDriver, fetchData, verifyDriver, updateDriver, getDriverByUserId } from '../controller/driverController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types';

// Add this helper type
type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Add this wrapper function
// const authenticatedRoute = (handler: AuthenticatedRequestHandler): RequestHandler => {
//   return (req, res, next) => handler(req as AuthenticatedRequest, res, next);
// };

const DriverRouter = Router();

DriverRouter.post('/register', registerDriver);
DriverRouter.post('/verifyDriver', verifyDriver);
DriverRouter.post('/dashboard', fetchData);
DriverRouter.put('/updateDriver/:id', updateDriver);
DriverRouter.get('/:userId', getDriverByUserId);

export default DriverRouter;