import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
  };
}

export const registerDriver = async (req: AuthRequest, res: Response) => {
  const prismaTransaction = await prisma.$transaction(async (tx) => {
    try {
      const { firstName, lastName, vehicleType, licenseNumber } = req.body;
      const userId = req.user?.id;

      // Validation
      if (!userId || !firstName || !lastName || !vehicleType || !licenseNumber) {
        return res.status(401).json({ message: 'All fields are required' });
      }

      if (!validator.isNumeric(userId.toString())) {
        return res.status(400).json({ message: 'User ID must be a number' });
      }

      if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        return res.status(400).json({ message: 'Names must contain only letters' });
      }

      if (validator.isEmpty(vehicleType)) {
        return res.status(402).json({ message: 'Vehicle type is required' });
      }

      if (!validator.isAlphanumeric(licenseNumber)) {
        return res.status(403).json({ message: 'License number must be alphanumeric' });
      }

      // Check if driver exists
      const existingDriver = await tx.driver.findUnique({
        where: { userId }
      });

      if (existingDriver) {
        return res.status(400).json({ message: 'User is already registered as a driver' });
      }

      // Create driver
      const newDriver = await tx.driver.create({
        data: {
          userId,
          firstName,
          lastName,
          vehicleType,
          licenseNumber,
        }
      });

      const driverToken = jwt.sign(
        { userId: newDriver.userId, driverId: newDriver.id },
        process.env.JWT_SECRET || "12345",
        { expiresIn: '7d' }
      );

      res.cookie('auth_token', driverToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: 'Driver registered successfully',
        driver: newDriver,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

  return prismaTransaction;
};

export const verifyDriver = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const driver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (!driver) return res.status(404).json({ isDriver: false });

    return res.status(200).json({ isDriver: true, driver });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const fetchData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) return res.status(404).json({ message: 'Unauthorized' });

    const currentDriver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (!currentDriver) return res.status(400).json({ message: "something went wrong" });

    const [delivered, available] = await Promise.all([
      prisma.order.findMany({
        where: {
          status: 'delivered',
          driverId: currentDriver.id
        }
      }),
      prisma.order.findMany({
        where: {
          status: 'prepared',
          driverId: currentDriver.id
        }
      })
    ]);

    return res.status(200).json({
      isDriver: true,
      driver: currentDriver,
      balance: user.balance,
      Delivered: delivered.length,
      available: available.length
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerDriver, verifyDriver, fetchData };
