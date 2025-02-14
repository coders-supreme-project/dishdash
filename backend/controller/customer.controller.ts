import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from './user';
const prisma = new PrismaClient();

export const updateCustomerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const reqAuth = req as AuthenticatedRequest;
    const userId = reqAuth.user?.id;
    
    if (!userId) {
      console.log('No user ID found in token');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { firstName, lastName, email, phoneNumber, deliveryAddress, imageUrl, password } = req.body;

    // Find the customer associated with the authenticated user
    const customer = await prisma.customer.findFirst({
      where: { userId: userId }
    });

    if (!customer) {
      console.log('No customer found for userId:', userId);
      res.status(404).json({ error: 'Customer profile not found' });
      return;
    }

    // Prepare the update data
    const updateData: any = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      deliveryAddress: deliveryAddress || undefined,
      imageUrl: imageUrl || undefined,
      user: {
        update: {
          email: email || undefined,
          phoneNumber: phoneNumber || undefined,
        }
      }
    };

    // If password is provided, hash it and include in update
    if (password) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.user.update.passwordHash = hashedPassword;
    }

    // Update the customer profile
    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    console.log('Profile updated successfully:', updatedCustomer);
    res.json(updatedCustomer);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
