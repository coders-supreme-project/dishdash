import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client'; // Import Prisma's User type

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware function to authenticate user using JWT token
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from 'Authorization: Bearer <token>'

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(token, JWT_SECRET) as User; // Decode the token and cast it to a User type
    req.user = decoded; // Store the decoded user in the request object
    next(); // Pass control to the next handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
    return;
  }
};
