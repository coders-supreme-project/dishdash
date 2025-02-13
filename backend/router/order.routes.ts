import { Router } from 'express';
import { createOrder, getOrders, confirmPayment } from '../controller/order.controller';
import { authenticateJWT } from '../midlleware/authmiddleware';

const router = Router();

// Route to create a new order
router.post('/orders', authenticateJWT, createOrder);

// Route to get all orders
router.get('/orders', authenticateJWT, getOrders);

// Route to confirm payment
router.post('/orders/confirm-payment', authenticateJWT, confirmPayment);

export default router;