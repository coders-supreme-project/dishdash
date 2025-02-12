import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} from '../controller/user';
import { authenticate, authorize } from '../midlleware/authmiddleware';
import { prisma } from '../prisma';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Profile routes (protected)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Admin routes

  router.get('/users', authenticate, authorize(['admin']), async (req, res, next) => {
     try {
       const users = await prisma.user.findMany({
         include: { customer: true, restaurantOwner: true, driver: true }
       });
       res.json(users);
     } catch (error) {
       next(error); // Now 'next' is defined as a parameter.
     }
   });

export default router;