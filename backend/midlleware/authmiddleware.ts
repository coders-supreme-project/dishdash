import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../controller/user'; // Adjust the import path
import { Response, NextFunction } from 'express';
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ error: "JWT_SECRET is not defined" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};