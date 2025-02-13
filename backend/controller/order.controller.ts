import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { Request, Response } from 'express';
import stripe from 'stripe';
import { AuthenticatedRequest } from '../controller/user';  // Adjust path as needed

const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150';
const prisma = new PrismaClient();
const stripeClient = new stripe("sk_test_51Qrf6mKss9UqsuwKVf6SUPhV3hYE8aQzD424YODs5hjU967eKmBvsVWS20V1A631ZGJoFdxNGrqBSx5RmMQHs06l00ExuwFj9a");

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, customerId, restaurantId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Items must be a non-empty array' });
      return;
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: Number(customerId),
        restaurantId: Number(restaurantId),
        totalAmount: Number(totalAmount),
        status: OrderStatus.pending,
        paymentStatus: PaymentStatus.pending,
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
      success: true,
      order: { id: order.id },
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const orders = await prisma.order.findMany({
      where: {
        customerId: req.user.id
      },
      include: {
        orderItems: {
          include: {
            menuItem: true
          }
        },
        restaurant: true
      },
      orderBy: {
        createdAt: 'desc'
      } as const
    });

    // Transform the data to match frontend structure
    const transformedOrders = orders.map(order => ({
      id: order.id,
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.menuItem.name,
        price: item.priceAtTimeOfOrder,
        quantity: item.quantity,
        image: item.menuItem.imageUrl || DEFAULT_FOOD_IMAGE
      })),
      totalAmount: order.totalAmount,
      status: order.status.toLowerCase(),
      date: order.createdAt.toISOString().split('T')[0],
      restaurant: order.restaurant.name
    }));

    res.json(transformedOrders);
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
      prisma.payment.updateMany({ // ✅ Fixed model name
        where: { paymentIntentId },
        data: { status: PaymentStatus.completed }, // ✅ Using enum
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.confirmed, paymentStatus: PaymentStatus.completed }, // ✅ Using enums
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
      data: { status: status as OrderStatus }
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
        orderId: Number(orderId)
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: error.message });
  }
};
