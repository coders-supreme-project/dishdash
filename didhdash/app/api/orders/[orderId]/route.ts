import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = parseInt(params.orderId);

    // Delete all order items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: orderId
      }
    });

    // Then delete the order
    await prisma.order.delete({
      where: {
        id: orderId
      }
    });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 