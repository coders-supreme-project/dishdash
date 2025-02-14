// authmiddleware.ts
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../controller/user';
import {Request, Response, NextFunction } from 'express';
 import dotenv from 'dotenv';
 dotenv.config();
 const JWT_SECRET = process.env.JWT_SECRET || '';
export const authenticateJWT = async (
  req: AuthenticatedRequest, // Use AuthenticatedRequest here
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header received:', authHeader);

    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log('No token found in request');
      res.status(401).json({ error: "No token provided" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment');
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
      console.log('Token decoded successfully:', decoded);
      req.user = decoded; // Set the user property on the request object
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      res.status(401).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: "Authentication error" });
  }
};