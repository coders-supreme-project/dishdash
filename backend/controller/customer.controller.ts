import { Response, Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from './user';
const prisma = new PrismaClient();

export const updateCustomerProfile = async (req: Request, res: Response) => {
  try {
    const reqAuth = req as AuthenticatedRequest; // Cast the request to our custom type
    // Log incoming request data
    console.log('Update Profile Request:', {
      user: req.user,
      body: req.body
    });

    // Get the authenticated user's ID from the token
    const userId = reqAuth.user?.id;
    if (!userId){
      console.log('No user ID found in token');
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const { firstName, lastName, email, phoneNumber, deliveryAddress } = req.body;

    // Log the data we're going to update
    console.log('Updating with data:', {
      firstName,
      lastName,
      email,
      phoneNumber,
      deliveryAddress
    });

    // Find the customer associated with the authenticated user
    const customer = await prisma.customer.findFirst({
      where: { userId: userId }
    });

    if (!customer) {
      console.log('No customer found for userId:', userId);
       res.status(404).json({ error: 'Customer profile not found' });
       return;
    }

    // Update the customer profile
    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        firstName: firstName || customer.firstName,
        lastName: lastName || customer.lastName,
        deliveryAddress: deliveryAddress || customer.deliveryAddress,
        user: {
          update: {
            email: email || undefined,
            phoneNumber: phoneNumber || undefined,
          }
        }
      },
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
     res.json(updatedCustomer);  // ensure returning the response
     return

  } catch (error) {
    console.error('Profile update error:', error);
     res.status(500).json({ 
      error: 'Failed to update profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
    return
  }
};
