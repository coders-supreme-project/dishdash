import { Router } from 'express';
import { updateCustomerProfile } from '../controller/customer.controller';
import { authenticateJWT } from '../middleware/authMiddleware';


const router = Router();

// Add authenticateJWT middleware to protect the route
router.put('/profile', authenticateJWT, updateCustomerProfile);

export default router;
