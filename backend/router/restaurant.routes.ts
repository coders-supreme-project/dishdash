import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getRestaurantMenuByCategory,
  getRestaurantsLocation
} from '../controller/restaurant.controller';

const router = Router();

router.get('/restaurants/search', searchRestaurants);
router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/location', getRestaurantsLocation);
router.post('/create', createRestaurant);
router.get('/restaurants/:id', getRestaurantById);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.get('/restaurants/:restaurantId/menu-categories', getRestaurantMenuByCategory);

export default router;