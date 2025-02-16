import express from "express";
import restaurentOwner from "../controller/restaurentOwner";
import {authenticateJWT} from "..//middleware/authMiddleware"
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// ✅ Restaurant Profile
router.put("/:id", restaurentOwner.updateProfile);

// ✅ Restaurant Creation
// router.post("/create", restaurentOwner.createRestaurant);

// ✅ Menu Items Management
router.post("/menu-item", restaurentOwner.createItem);
router.put("/menu-item/:id", restaurentOwner.updateItem);
router.delete("/menu-item/:id", restaurentOwner.deleteItem);
router.post("/create",restaurentOwner.createRestaurantOwner)

// ✅ Retrieve Items
router.get("/menu/:id", restaurentOwner.getAllItems);
router.get("/:id", restaurentOwner.getRestaurantOwnerById);
//@ts-ignore
router.post("/sign-cloudinary", restaurentOwner.signCloudinary);

export default router;
