import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { Request, Response } from 'express';
import stripe from 'stripe';
import { AuthenticatedRequest } from '../controller/user'; // Adjust path as needed

const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150';
const prisma = new PrismaClient();
const stripeClient = new stripe("sk_test_51Qrf6mKss9UqsuwKVf6SUPhV3hYE8aQzD424YODs5hjU967eKmBvsVWS20V1A631ZGJoFdxNGrqBSx5RmMQHs06l00ExuwFj9a");

export const createOrder = async (req:Request , res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { items, totalAmount, restaurantId } = req.body;
    console.log("req.body",req.body);
    
    const customerId = authReq.user?.id;
    console.log("customerId",customerId);
    console.log("restaurantId",restaurantId);
    console.log("totalAmount",totalAmount);
    console.log("items",items);

    if (!authReq.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items must be a non-empty array' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: customerId },include:{customer:true} });
    console.log("user",user);
    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: Number(user?.customer?.id),
        restaurantId: Number(restaurantId),
        totalAmount: Number(totalAmount),
        status: OrderStatus.pending,
        paymentStatus: PaymentStatus.pending,
        deliveryAddress: 'Default Address', // You might want to get this from user profile
      },
    });

    // Create order items
    const orderItems = items.map(item => ({
      orderId: order.id,
      menuItemId: item.id,
      quantity: item.quantity,
      priceAtTimeOfOrder: item.price,
    }));

    await prisma.orderItem.createMany({
      data: orderItems,
    });

    res.status(201).json({
      // success: true,
      // order,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
  throw error
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: authReq.user.id },include:{customer:true} });
    console.log("authReq.user",authReq.user);
    console.log("user",authReq.user);
    
    const orders = await prisma.order.findMany({
      where: {
        customerId: Number(user?.customer?.id),
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        restaurant: true,
      },
    });
    console.log("orders",orders);
    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { paymentIntentId } = req.body;

    console.log('Confirming payment for intent:', paymentIntentId);

    if (!paymentIntentId) {
      res.status(400).json({ error: 'Missing paymentIntentId' });
      return;
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent.metadata?.orderId) {
      res.status(400).json({ error: 'Missing orderId in payment metadata' });
      return;
    }

    const orderId = Number(paymentIntent.metadata.orderId);

    console.log('Payment intent retrieved, order ID:', orderId);

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const [payment, order] = await Promise.all([
      prisma.payment.updateMany({
        where: { paymentIntentId },
        data: { status: PaymentStatus.completed },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.confirmed, paymentStatus: PaymentStatus.completed },
      }),
    ]);

    console.log('Payment and order status updated:', { payment, order });

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and order status updated',
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status: status as OrderStatus },
      include: {
        orderItems: {
          include: {
            menuItem: true, // Include related menuItem if needed
          },
        },
      },
    });

    res.json(order);
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, itemId } = req.params;

    await prisma.orderItem.delete({
      where: {
        id: Number(itemId),
        orderId: Number(orderId),
      },
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: error.message });
  }
};