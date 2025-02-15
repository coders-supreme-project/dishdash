import express from "express";
import restaurentOwner from "../controller/restaurentOwner";
import {authenticateJWT} from "../midlleware/authmiddleware"

const router = express.Router();

// ✅ Restaurant Profile
router.put("/update-profile", restaurentOwner.updateProfile);

// ✅ Restaurant Creation
// router.post("/create", restaurentOwner.createRestaurant);

// ✅ Menu Items Management
router.post("/menu-item", restaurentOwner.createItem);
router.put("/menu-item/:id", restaurentOwner.updateItem);
router.delete("/menu-item/:id", restaurentOwner.deleteItem);

// ✅ Retrieve Items
router.get("/menu/:id", restaurentOwner.getAllItems);
router.get("/:id", restaurentOwner.getRestaurantOwnerById);

export default router;
