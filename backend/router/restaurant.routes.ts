import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getRestaurantMenuByCategory,
  signCloudinary,   
  getRestaurantIdByOwnerId,
} from '../controller/restaurant.controller';

const router = Router();
//@ts-ignore
router.post("/sign-cloudinary", signCloudinary);
router.get('/search', searchRestaurants);
router.get('/', getAllRestaurants);
router.post('/create', createRestaurant);
router.get('/one/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.get('/menu-categories/:restaurantId/', getRestaurantMenuByCategory);
router.get('/owner/:ownerId/restaurant-id', getRestaurantIdByOwnerId);

export default router;