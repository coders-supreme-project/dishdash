import express from 'express';
import { register, login } from '../controller/user'; // Import controller functions
import { authMiddleware } from '../midlleware/authmiddleware'; // Protect routes with JWT middleware

const router = express.Router();

// Register Route
router.post('/register',authMiddleware, register);

// Login Route
router.post('/login', login);

// Protected Route (Requires Authentication)
// router.get('/profile', authMiddleware, (req, res) => {
//   if (req.user) {
//     res.json({ user: req.user }); // User is attached to the request object after passing the authMiddleware
//   } else {
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// });

export default router;
