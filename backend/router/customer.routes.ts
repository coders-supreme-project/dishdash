import { Router } from 'express';
import { updateCustomerProfile } from '../controller/customer.controller';
import { authenticateJWT } from '../midlleware/authmiddleware';

const router = Router();

// Update route to match the frontend request path
router.put('/profile', authenticateJWT, updateCustomerProfile);

export default router;
