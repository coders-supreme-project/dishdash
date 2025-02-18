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
      where: { userId: Number(userId) }
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

    let numberOfDelivered = delivered.length;
    let numberOfAvailable = available.length;

    res.status(200).json({
      isDriver: true,
      driver: currentDriver,
      balance: user.balance,
      Delivered: numberOfDelivered,
      available: numberOfAvailable
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

export const updateDriverLocation = async (req: Request, res: Response): Promise<void> => {
  const { driverId, latitude, longitude } = req.body;

  if (!driverId || !latitude || !longitude) {
     res.status(400).json({ message: 'driverId, latitude, and longitude are required' });
  }

  try {
    // Check if a location entry already exists for the driver
    const existingLocation = await prisma.geoLocation.findUnique({
      where: { id: Number(driverId) },
    });

    let location;
    if (existingLocation) {
      // Update the existing location
      location = await prisma.geoLocation.update({
        where: { driverId: Number(driverId) },
        data: {
          latitude,
          longitude,
        },
      });
    } else {
      // Create a new location entry if it doesn't exist
      location = await prisma.geoLocation.create({
        data: {
          latitude,
          longitude,
          driverId: Number(driverId),
        },
      });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error('Error updating driver location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const updateDriver = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const {id} = req.params;
    const { firstName, lastName, vehicleType, licenseNumber } = req.body;

    // Check authentication
    if (!id) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Find existing driver
    const existingDriver = await prisma.driver.findUnique({
      where: { userId: Number(id) }
    });

    if (!existingDriver) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    // Validate input fields if they are provided
    if (vehicleType && validator.isEmpty(vehicleType)) {
      res.status(400).json({ message: 'Vehicle type cannot be empty' });
      return;
    }

    if (licenseNumber && !validator.isAlphanumeric(licenseNumber)) {
      res.status(400).json({ message: 'License number must be alphanumeric' });
      return;
    }

    // Update driver with only provided fields
    const updatedDriver = await prisma.driver.update({
      where: { userId: Number(id) },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(vehicleType && { vehicleType }),
        ...(licenseNumber && { licenseNumber }),
      }
    });

    res.status(200).json({
      message: 'Driver updated successfully',
      driver: updatedDriver
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDriverByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
  
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;

    }

    const driver = await prisma.driver.findUnique({
      where: { userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        vehicleType: true,
        licenseNumber: true,
        balance: true
      }
    });

    if (!driver) {
      res.status(404).json({ message: 'Driver not found' });
      return;
    }

    res.status(200).json(driver);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const getCustomerGeoLocationByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    // Step 1: Find the order by ID and get the customerId
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      select: { customerId: true }, // Only fetch the customerId
    });

    // Step 2: Check if the order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Step 3: Find the latest GeoLocation for the customer
    const geoLocation = await prisma.geoLocation.findFirst({
      where: { customerId: order.customerId },
      orderBy: { createdAt: "desc" }, // Get the most recent GeoLocation
      select: { latitude: true, longitude: true }, // Only fetch latitude and longitude
    });

    // Step 4: Check if GeoLocation exists for the customer
    if (!geoLocation) {
      return res.status(404).json({ message: "No geoLocation found for this customer" });
    }

    // Step 5: Return the latitude and longitude
    res.status(200).json({
      latitude: geoLocation.latitude,
      longitude: geoLocation.longitude,
    });
  } catch (error) {
    console.error("Error fetching customer geoLocation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { registerDriver, verifyDriver, fetchData, updateDriver, getDriverByUserId,getDriverLocation,updateDriverLocation,getCustomerGeoLocationByOrderId };
