import { User } from "@prisma/client";
import { Request } from 'express';
import { UserPayload } from '../types'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // Extend Express Request type
    }
  }
}

export {}; // Ensure TypeScript treats this as a module
import { Request, Response, NextFunction } from 'express';

export interface AsyncRequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export interface ErrorRequestHandler {
  (err: any, req: Request, res: Response, next: NextFunction): void;
}

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
} 
