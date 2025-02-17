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
router.get('/restaurants/search', searchRestaurants);
router.get('/restaurants', getAllRestaurants);
router.get('/restaurants/location', getRestaurantsLocation);
router.post('/create', createRestaurant);
router.post('/creat', createRestaurant1);
router.get('/get/:userId', getRestaurantByUserId);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.get('/restaurants/:restaurantId/menu-categories', getRestaurantMenuByCategory);
router.get('/owner/:ownerId/restaurant-id', getRestaurantIdByOwnerId);

export default router;