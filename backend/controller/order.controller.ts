import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { Request, Response } from 'express';
import stripe from 'stripe';

const prisma = new PrismaClient();
const stripeClient = new stripe("sk_test_51Qrf6mKss9UqsuwKVf6SUPhV3hYE8aQzD424YODs5hjU967eKmBvsVWS20V1A631ZGJoFdxNGrqBSx5RmMQHs06l00ExuwFj9a");

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, customerId, restaurantId, deliveryAddress } = req.body;

    console.log('Received order data:', { items, totalAmount, customerId, restaurantId, deliveryAddress });

    if (!items || !totalAmount || !customerId || !restaurantId || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    const invalidItems = items.filter(item => !item.id);
    if (invalidItems.length > 0) {
      return res.status(400).json({ error: 'Some items are missing valid IDs' });
    }

    const order = await prisma.order.create({
      data: {
        customerId,
        restaurantId,
        totalAmount,
        deliveryAddress,
        status: OrderStatus.pending, // ✅ Using enum
        paymentStatus: PaymentStatus.pending, // ✅ Using enum
      },
    });

    console.log('Order created:', order);

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
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });

    res.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
}

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    console.log('Confirming payment for intent:', paymentIntentId);

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Missing paymentIntentId' });
    }

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent.metadata?.orderId) {
      return res.status(400).json({ error: 'Missing orderId in payment metadata' });
    }

    const orderId = Number(paymentIntent.metadata.orderId);

    console.log('Payment intent retrieved, order ID:', orderId);

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
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
