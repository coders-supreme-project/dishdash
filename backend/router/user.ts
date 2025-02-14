import express, { Request } from 'express';
import { registerUser, loginUser, getUserProfile } from "../controller/user";
import { authenticateJWT } from "../midlleware/authmiddleware";
import { Role } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    passwordHash: string;
    role: Role;
    phoneNumber: string | null;
    createdAt: Date;
    balance: number;
    updatedAt: Date;
  };
}

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", 
  authenticateJWT as express.RequestHandler, 
  getUserProfile as express.RequestHandler
);

export default router;