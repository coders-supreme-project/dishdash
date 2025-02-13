import { Router } from 'express';
import { createOrder, getOrders, confirmPayment } from '../controller/order.controller';

const router = Router();

// Route to create a new order
router.post('/orders', createOrder);

// Route to get all orders
router.get('/orders', getOrders);

// Route to confirm payment
router.post('/orders/confirm-payment', confirmPayment);

export default router;