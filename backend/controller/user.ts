// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, phoneNumber, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        phoneNumber,
      },
    });

    // Create associated profile based on role
    switch (role) {
      case 'customer':
        await prisma.customer.create({
          data: {
            firstName,
            lastName,
            deliveryAddress: req.body.deliveryAddress,
            userId: user.id,
          },
        });
        break;
      case 'restaurantOwner':
        await prisma.restaurantOwner.create({
          data: {
            firstName,
            lastName,
            userId: user.id,
          },
        });
        break;
      case 'driver':
        await prisma.driver.create({
          data: {
            firstName,
            lastName,
            vehicleType: req.body.vehicleType,
            licenseNumber: req.body.licenseNumber,
            userId: user.id,
          },
        });
        break;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
        restaurantOwner: true,
        driver: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { email, phoneNumber, ...profileData } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        phoneNumber,
      },
    });

    // Update role-specific profile
    switch (user.role) {
      case 'customer':
        await prisma.customer.update({
          where: { userId },
          data: profileData,
        });
        break;
      case 'restaurantOwner':
        await prisma.restaurantOwner.update({
          where: { userId },
          data: profileData,
        });
        break;
      case 'driver':
        await prisma.driver.update({
          where: { userId },
          data: profileData,
        });
        break;
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};