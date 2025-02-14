import { Router } from 'express';
import { updateCustomerProfile } from '../controller/customer.controller';
import { authenticateJWT } from '../midlleware/authmiddleware';

const router = Router();

// Route without middleware (as requested)
router.put('/customers/profile',authenticateJWT, updateCustomerProfile);

export default router;
