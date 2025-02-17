import { Router } from 'express';
import { 
  createOrder, 
  getOrders, 
  updateOrderStatus, 
  deleteOrderItem,
 
  confirmPayment,
  createPaymentIntent
} from '../controller/order.controller';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Order routes with authentication
router.post('/', authenticateJWT, createOrder);
router.get('/', authenticateJWT, getOrders);
router.patch('/:orderId', authenticateJWT, updateOrderStatus);

router.delete('/:orderId/items/:itemId', authenticateJWT, deleteOrderItem);

router.post('/confirm-payment', authenticateJWT, confirmPayment);

router.post('/payment-intent', authenticateJWT, createPaymentIntent);

export default router;