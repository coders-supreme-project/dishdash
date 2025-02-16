// filepath: /c:/Users/drong/OneDrive/Bureau/project/dishdash/backend/controller/driverController.ts
import { PrismaClient, Role } from '@prisma/client';
import { Request, Response } from 'express';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: number;
    balance: number;
    email: string;
    passwordHash: string;
    role: Role;
    phoneNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const registerDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { firstName, lastName, vehicleType, licenseNumber, userId } = req.body;

    // Validation
    if (!userId || !firstName || !lastName || !vehicleType || !licenseNumber) {
      res.status(401).json({ message: 'All fields are required' });
      return;
    }

    if (!validator.isNumeric(userId.toString())) {
      res.status(400).json({ message: 'User ID must be a number' });
      return;
    }

  

    if (validator.isEmpty(vehicleType)) {
      res.status(402).json({ message: 'Vehicle type is required' });
      return;
    }

    if (!validator.isAlphanumeric(licenseNumber)) {
      res.status(403).json({ message: 'License number must be alphanumeric' });
      return;
    }

    // Check if driver exists
    const existingDriver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (existingDriver) {
      res.status(400).json({ message: 'User is already registered as a driver' });
      return;
    }

    // Create driver
    const newDriver = await prisma.driver.create({
      data: {
        userId,
        firstName,
        lastName,
        vehicleType,
        licenseNumber,
      }
    });

    // Update user's role to driver
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'driver' }
    });

    const driverToken = jwt.sign(
      { userId: newDriver.userId, driverId: newDriver.id },
      process.env.JWT_SECRET || "1234",
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Driver registered successfully',
      driver: newDriver,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const driver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (!driver) {
      res.status(404).json({ isDriver: false });
      return;
    }

    res.status(200).json({ isDriver: true, driver });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const fetchData = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ message: 'Unauthorized' });
      return;
    }

    const currentDriver = await prisma.driver.findUnique({
      where: { userId }
    });

    if (!currentDriver) {
      res.status(400).json({ message: "something went wrong" });
      return;
    }

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

    res.status(200).json({
      isDriver: true,
      driver: currentDriver,
      balance: user.balance,
      Delivered: delivered.length,
      available: available.length
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getDriverLocation = async (req: Request, res: Response): Promise<void> => {
  const { driverId } = req.params;

  try {
    // Fetch the latest location for the driver
    const location = await prisma.geoLocation.findFirst({
      where: { driverId: parseInt(driverId) },
      orderBy: { createdAt: 'desc' }, 
    });

    if (!location) {
      res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error('Error fetching driver location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateDriverLocation = async (req: Request, res: Response) => {
  const { driverId, latitude, longitude } = req.body;

  try {
    // Create a new GeoLocation entry for the driver
    const location = await prisma.geoLocation.create({
      data: {
        latitude,
        longitude,
        driverId,
      },
    });

    res.status(200).json(location);
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerDriver, verifyDriver, fetchData,getDriverLocation,updateDriverLocation };