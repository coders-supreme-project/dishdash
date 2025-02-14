import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../controller/user'; // Adjust the import path
import { Request,Response, NextFunction } from 'express';
interface Decoded{
  id:number,
  role:string
}
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const decoded:Decoded= jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};