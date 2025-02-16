import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';
import { Request, Response } from 'express';
import stripe from 'stripe';
import { AuthenticatedRequest } from '../controller/user'; // Adjust path as needed
import { Decimal } from '@prisma/client/runtime/library';

const DEFAULT_FOOD_IMAGE = 'https://via.placeholder.com/150';
const prisma = new PrismaClient();
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || '');

interface OrderItemInput {
  menuItemId: number;
  quantity: number;
  price: number;
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { items, totalAmount, restaurant } = req.body;

    if (!authReq.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({ 
      where: { id: authReq.user.id },
      include: { customer: true } 
    });

    // Ensure totalAmount and restaurant are valid
    if (!totalAmount || !restaurant) {
      res.status(400).json({ error: 'Invalid order data' });
      return;
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        totalAmount: new Decimal(totalAmount),
        status: OrderStatus.pending,
        paymentStatus: PaymentStatus.pending,
        deliveryAddress: user?.customer?.deliveryAddress || 'Default Address',
        customerId: Number(user?.customer?.id),
        restaurantId: Number(restaurant)
      }
    });

    // Create order items
    await prisma.orderItem.createMany({
      data: items.map((item: OrderItemInput) => ({
        orderId: order.id,
        menuItemId: Number(item.menuItemId),
        quantity: Number(item.quantity),
        priceAtTimeOfOrder: new Decimal(item.price)
      }))
    });

    // Create Stripe payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId: order.id.toString() }
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: new Decimal(totalAmount),
        paymentIntentId: paymentIntent.id,
        status: PaymentStatus.pending,
        paymentMethod: 'card',
        currency: 'usd'
      }
    });

    res.status(201).json({
      success: true,
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
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

    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      res.status(400).json({ error: 'Payment not successful' });
      return;
    }

    const orderId = Number(paymentIntent.metadata.orderId);

    // Update order and payment status
    await Promise.all([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.confirmed,
          paymentStatus: PaymentStatus.completed
        }
      }),
      prisma.payment.update({
        where: { paymentIntentId },
        data: { 
          status: PaymentStatus.completed,
          updatedAt: new Date()
        }
      })
    ]);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { orderId, status } = req.body;
    console.log('Received request body:', req.body);

    // Validate request payload
    if (!orderId || isNaN(Number(orderId))) {
      res.status(400).json({ error: 'Invalid orderId' });
      return;
    }
    if (!status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    // Ensure status is lowercase & valid
    const validStatuses = ["pending", "confirmed", "prepared", "out_for_delivery", "delivered"];
    const normalizedStatus = status.toLowerCase();

    if (!validStatuses.includes(normalizedStatus)) {
      res.status(400).json({ error: `Invalid status value. Expected one of: ${validStatuses.join(', ')}` });
      return;
    }

    // Fetch user & customer info
    const user = await prisma.user.findUnique({ 
      where: { id: authReq.user.id },
      include: { customer: true },
    });

    if (!user || !user.customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.customerId !== user.customer.id) {
      res.status(403).json({ error: 'You are not authorized to update this order' });
      return;
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        status: normalizedStatus as OrderStatus,
        paymentStatus: PaymentStatus.completed,
      },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    console.log('Order updated successfully:', updatedOrder);
    res.json(updatedOrder);
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

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.body;
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { orderItems: true }
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(Number(order.totalAmount) * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId: order.id.toString() }
    });

    res.json({ 
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};
