import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrderItem } from '../controller/order.controller';
import { authenticateJWT } from '../midlleware/authmiddleware';

const router = Router();

// Route to create a new order
router.post('/orders', authenticateJWT, createOrder);

// Route to get all orders
router.get('/orders', authenticateJWT, getOrders);

// Route to update order status
router.patch('/orders/:orderId/status', authenticateJWT, updateOrderStatus);

// Route to delete an order item
router.delete('/orders/:orderId/items/:itemId', authenticateJWT, deleteOrderItem);

export default router;