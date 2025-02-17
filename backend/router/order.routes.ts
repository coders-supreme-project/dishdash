import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrderItem, confirmPayment, getOrdersByDriver} from '../controller/order.controller';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Order routes with authentication
router.post('/orders', authenticateJWT, createOrder);
router.get('/orders', authenticateJWT, getOrders);
router.patch('/orders/:orderId', authenticateJWT, updateOrderStatus);
router.get('/:id', authenticateJWT, getOrdersByDriver);
router.delete('/orders/:orderId/items/:itemId', authenticateJWT, deleteOrderItem);
router.post('/orders/confirm-payment', authenticateJWT, confirmPayment);

export default router;