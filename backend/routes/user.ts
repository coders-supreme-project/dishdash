import express, { Request, Response } from 'express';
import { register, login } from '../controller/user'; // Import controller functions
import  authMiddleware  from '../midlleware/authmiddleware'; // Protect routes with JWT middleware
import { User } from '@prisma/client';

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Protected Route (Requires Authentication)
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  if (req.user) {
    res.json({ user: req.user }); // User is attached to the request object after passing the authMiddleware
    const user = req.user as User;
  // res.json({ user });

  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;
