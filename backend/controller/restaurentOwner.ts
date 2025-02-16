import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";
import fs from "fs";
import path from "path";
cloudinary.config({
  cloud_name: "drliudydx",
  api_key: "516363278445275",
  api_secret: "dj-hWW7JRK0AYtEqiIXUUcWKuK8",
});

const prisma = new PrismaClient();


interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    passwordHash: string;
    role: string; // Assuming 'role' is a string
    phoneNumber: string | null;
    createdAt: Date;
    balance: number;
    updatedAt: Date;
  };
}
const uploadImage = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url; // Returns Cloudinary image URL
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
 
const restaurantController = {
  // ✅ Get Restaurant Owner by ID
  getRestaurantOwnerById: async (req: Request, res: Response): Promise<void> => {
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
  signCloudinary : (req: Request, res: Response) => {
    const { timestamp } = req.body;
    const secret = "dj-hWW7JRK0AYtEqiIXUUcWKuK8";
  
    if (!secret) {
      return res.status(500).json({ error: "Cloudinary secret is missing" });
    }
  
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp} ${secret}`)
      .digest("hex");
  
    res.json({
      signature,
      timestamp,
      apiKey: "516363278445275",
    });
  },

  // ✅ Create Restaurant Owner
  createRestaurantOwner: async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, userId } = req.body;

    try {
      // Validate input data
      if (!firstName || !lastName || !userId) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Check if the user already exists
      const existingUser = await prisma.restaurantOwner.findUnique({ where: { userId } });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // Create the restaurant owner
      const restOwner = await prisma.restaurantOwner.create({
        data: {
          firstName,
          lastName,
          userId: userId,
        },
      });

      // Update the user's role to 'restaurantOwner'
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'restaurantOwner' },
      });

      res.status(201).json({
        message: "Restaurant owner created successfully",
        restaurantOwner: restOwner,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // ✅ Update Restaurant Profile
  updateProfile: async (req: Request, res: Response): Promise<void> => {
    const { name, cuisineType, address, contactNumber, openingH, closingH, rating, firstName, lastName, email, password } = req.body;

    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
      }
      //@ts-ignore
      const userId = req.user.id;

      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        res.status(400).json({ message: "Email is already taken by another user." });
        return;
      }

      // Update restaurant owner
      await prisma.restaurantOwner.update({
        where: { userId },
        data: { firstName, lastName },
      });

      // Update restaurant info
      await prisma.restaurant.updateMany({
        where: { restaurantOwnerId: userId },
        data: { name, cuisineType, address, contactNumber, openingH, closingH, rating },
      });

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  },

  // ✅ Create Restaurant
  

  // ✅ Create Menu Item
  // ✅ Create Menu Item (updated)
createItem: async (req: Request, res: Response) => {
  const { restaurantId, name, description, price, isAvailable, categoryId, imageUrl } = req.body;
  
  try {
    const newItem = await prisma.menuItem.create({
      data: {
        restaurantId: Number(restaurantId),
        name,
        description,
        price: Number(price),
        imageUrl: imageUrl || "", // Use the imageUrl from request body
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
  // ✅ Update Menu Item (modified to handle imageUrl)
updateItem: async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, isAvailable, categoryId } = req.body;

  try {
    const updatedItem = await prisma.menuItem.update({
      where: { id: Number(id) },
      data: { 
        name, 
        description, 
        price: Number(price), 
        imageUrl,  // Now properly receives Cloudinary URL
        isAvailable: Boolean(isAvailable), 
        categoryId: categoryId ? Number(categoryId) : null 
      },
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