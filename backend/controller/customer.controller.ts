import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, deliveryAddress, userId } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        deliveryAddress,
        userId,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Get a customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
        orders: true,
      },
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

// Update a customer
export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, deliveryAddress } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        deliveryAddress,
      },
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// Delete a customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.customer.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}; 