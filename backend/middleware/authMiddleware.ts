// authmiddleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserPayload } from '../controller/user';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';

// Rename the interface to avoid conflict
interface RequestWithUser extends Request {
  user?: UserPayload;
}

const prisma = new PrismaClient();

export const authenticateJWT = async (req: RequestWithUser, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Remove 'Bearer ' prefix
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as UserPayload;
    
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        customer: true,
        restaurantOwner: true,
        driver: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Export the type for use in other files
export type { RequestWithUser };