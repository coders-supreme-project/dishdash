import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrderItem, confirmPayment, getOrdersByDriver,createPaymentIntent} from '../controller/order.controller';

import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Order routes with authentication
router.post('/', authenticateJWT, createOrder);
router.get('/orders', authenticateJWT, getOrders);
router.get('/:id', authenticateJWT, getOrdersByDriver);
router.delete('/:orderId/items/:itemId', authenticateJWT, deleteOrderItem);
router.post('/orders/confirm-payment', authenticateJWT, confirmPayment);

router.get('/', authenticateJWT, getOrders);
router.patch('/:orderId', authenticateJWT, updateOrderStatus);


router.post('/payment-intent', authenticateJWT, createPaymentIntent);

export default router;