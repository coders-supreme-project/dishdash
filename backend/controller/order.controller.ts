import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import stripe from 'stripe';

const prisma = new PrismaClient();
const stripeClient = new stripe("sk_test_51Qrf6mKss9UqsuwKVf6SUPhV3hYE8aQzD424YODs5hjU967eKmBvsVWS20V1A631ZGJoFdxNGrqBSx5RmMQHs06l00ExuwFj9a");

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, totalAmount, customerId, restaurantId, deliveryAddress } = req.body;

    console.log('Received order data:', { items, totalAmount, customerId, restaurantId, deliveryAddress });

    // Validate required fields
    if (!items || !totalAmount || !customerId || !restaurantId || !deliveryAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }

    // Validate menuItemId for each item
    const invalidItems = items.filter(item => !item.id);
    if (invalidItems.length > 0) {
      return res.status(400).json({ error: 'Some items are missing valid IDs' });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId,
        restaurantId,
        totalAmount,
        deliveryAddress,
        status: 'pending',
        paymentStatus: 'pending',
      },
    });

    console.log('Order created:', order);

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
      order: {
        id: order.id,
      },
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;

    console.log('Confirming payment for intent:', paymentIntentId);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    const orderId = paymentIntent.metadata.orderId;

    console.log('Payment intent retrieved, order ID:', orderId);

    // Update payment and order status
    const [payment, order] = await Promise.all([
      prisma.payment.updateMany({
        where: { paymentIntentId },
        data: { status: 'paid' },
      }),
      prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'confirmed', paymentStatus: 'paid' },
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