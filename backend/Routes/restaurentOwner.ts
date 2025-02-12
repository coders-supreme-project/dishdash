import express from "express";
import restaurantController from "../controller/restaurentOwner";

const router = express.Router();

// ✅ Restaurant Profile
router.put("/update-profile",  restaurantController.updateProfile);

// ✅ Restaurant Creation
router.post("/create",  restaurantController.createRestaurant);

// ✅ Menu Items Management
router.post("/menu-item",  restaurantController.createItem);
router.put("/menu-item/:id", restaurantController.updateItem);
router.delete("/menu-item/:id",  restaurantController.deleteItem);

// ✅ Categories
router.post("/category",  restaurantController.addCategory);
router.get("/menu/:id", restaurantController.getAllItems);

// ✅ Authentication & Logout
router.post("/logout", restaurantController.logOutResto);

export default router;
