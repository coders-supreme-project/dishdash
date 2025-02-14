import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const restaurantController = {
getRestaurantOwnerById : async (req: Request, res: Response): Promise<void> => {
    const ownerId = Number(req.params.id);
  
    if (isNaN(ownerId)) {
      res.status(400).json({ message: "Invalid restaurant owner ID" });
      return;
    }
  
    try {
      const owner = await prisma.restaurantOwner.findUnique({
        where: { id: ownerId },
      });
  
      if (!owner) {
        res.status(404).json({ message: "Restaurant owner not found" });
        return;
      }
  
      res.json(owner);
    } catch (error) {
      console.error("Error fetching restaurant owner:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // ✅ Update Restaurant Profile
  updateProfile: async (req: Request, res: Response) => {
    const { name, cuisineType, address, contactNumber, openingH, closingH, rating } = req.body;

    try {
      await prisma.restaurant.updateMany({
        where: { restaurantOwnerId: req.body.restaurantOwnerId },
        data: { name, cuisineType, address, contactNumber, openingH, closingH, rating },
      });
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  },

  // ✅ Create Restaurant
  createRestaurant: async (req: Request, res: Response) => {
    const { name, cuisineType, address, contactNumber, openingH, closingH, restaurantOwnerId } = req.body;
    
    try {
      const newRestaurant = await prisma.restaurant.create({
        data: { name, cuisineType, address, contactNumber, openingH, closingH, restaurantOwnerId },
      });
      res.status(201).json({ message: "Restaurant created successfully", newRestaurant });
    } catch (err) {
      console.error("Error creating restaurant:", err);
      res.status(500).json({ error: "Failed to create restaurant" });
    }
  },

  // ✅ Create Menu Item
  createItem: async (req: Request, res: Response) => {
    const { restaurantId, name, description, price, imageUrl, isAvailable, categoryId } = req.body;

    try {
      const newItem = await prisma.menuItem.create({
        data: {
          restaurantId: Number(restaurantId),
          name,
          description,
          price: Number(price),
          imageUrl,
          isAvailable: isAvailable === "true",
          categoryId: categoryId ? Number(categoryId) : null,
        },
      });

      res.status(201).json({ message: "Menu item created successfully", newItem });
    } catch (err) {
      console.error("Error creating menu item:", err);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  },

  // ✅ Update Menu Item
  updateItem: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body;

    try {
      const updatedItem = await prisma.menuItem.update({
        where: { id: Number(id) },
        data: { name, description, price: Number(price), imageUrl, isAvailable: Boolean(isAvailable), categoryId: categoryId ? Number(categoryId) : null },
      });
      res.status(200).json({ message: "Menu item updated successfully", updatedItem });
    } catch (err) {
      console.error("Error updating menu item:", err);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  },

  // ✅ Delete Menu Item
  deleteItem: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.menuItem.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (err) {
      console.error("Error deleting menu item:", err);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  },

  // ✅ Get All Items for a Restaurant
  getAllItems: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const items = await prisma.menuItem.findMany({ where: { restaurantId: Number(id) } });
      res.status(200).json(items);
    } catch (err) {
      console.error("Error retrieving menu items:", err);
      res.status(500).json({ error: "Failed to retrieve menu items" });
    }
  },
};

export default restaurantController;