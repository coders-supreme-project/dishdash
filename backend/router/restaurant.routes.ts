import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getRestaurantMenuByCategory,
  getRestaurantsLocation,
  signCloudinary,   
  getRestaurantIdByOwnerId,
  createRestaurant1,
  getRestaurantByUserId
} from '../controller/restaurant.controller';

const router = Router();
//@ts-ignore
router.post("/sign-cloudinary", signCloudinary);
router.get('/search', searchRestaurants);
router.get('/location', getRestaurantsLocation);
router.get('/get/:userId', getRestaurantByUserId);
router.get('/', getAllRestaurants);
router.post('/create', createRestaurant);
router.post('/creat', createRestaurant1);
router.get('/one/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);
router.get('/menu-categories/:restaurantId/', getRestaurantMenuByCategory);
router.get('/owner/:ownerId/restaurant-id', getRestaurantIdByOwnerId);

export default router;