import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
} from '../controller/restaurant.controller';

const router = Router();

router.post('/restaurants', createRestaurant);
router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/:id', getRestaurantById);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.get('/restaurants/search', searchRestaurants);

export default router;