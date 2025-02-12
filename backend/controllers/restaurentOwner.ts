import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define TypeScript interface for user authentication
interface AuthenticatedRequest extends Request {
  user?: { id: number }; // Ensure user exists in the request object
}

const restaurantController = {
  // ✅ Update Restaurant Profile
  updateProfile: async (req: AuthenticatedRequest, res: Response):Promise<void>=> {
    const { name, cuisineType, address, contactNumber, openingH, closingH, rating, firstName, lastName, email, password } = req.body;

    try {
      if (!req.user) {
         res.status(401).json({ message: "Unauthorized access" });
         return
      }

      const userId = req.user.id;

      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
         res.status(400).json({ message: "Email is already taken by another user." });
         return
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

      // Update user info
      await prisma.user.update({
        where: { id: userId },
        data: { email },
      });

      // If password is provided, hash and update
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash: hashedPassword },
        });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send({ error: "Failed to update profile" });
    }
  },

  // ✅ Create Menu Item
  createItem: async (req: AuthenticatedRequest, res: Response):Promise<void> => {
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body;

    try {
      if (!req.user) {
         res.status(401).json({ message: "Unauthorized access" });
         return
      }

      const restaurant = await prisma.restaurant.findFirst({ where: { restaurantOwnerId: req.user.id } });
      if (!restaurant){
          res.status(404).json({ message: "Restaurant not found" })
            return
         };

      const newItem = await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          name,
          description,
          price: Number(price),
          imageUrl,
          isAvailable: Boolean(isAvailable),
          categoryId: categoryId ? Number(categoryId) : null,
        },
      });

      res.status(200).json(newItem);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to create item");
    }
  },

  // ✅ Update Menu Item
  updateItem: async (req: Request, res: Response):Promise<void> => {
    const { id } = req.params;
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body;

    try {
      const updatedItem = await prisma.menuItem.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price: Number(price),
          imageUrl,
          isAvailable: Boolean(isAvailable),
          categoryId: categoryId ? Number(categoryId) : null,
        },
      });

      res.status(200).json(updatedItem);
    } catch (err) {
      console.error(err);
      res.status(404).send("Item not found");
    }
  },

  // ✅ Delete Menu Item
  deleteItem: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      await prisma.menuItem.delete({ where: { id: Number(id) } });
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(404).send("Item not found");
    }
  },

  // ✅ Add Category
  addCategory: async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
      const newCategory = await prisma.category.create({ data: { name } });
      res.status(200).json(newCategory);
    } catch (err) {
      console.error(err);
      res.status(400).send("Failed to create category");
    }
  },

  // ✅ Get All Items for a Restaurant
  getAllItems: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const items = await prisma.menuItem.findMany({ where: { restaurantId: Number(id) } });
      res.status(200).json(items);
    } catch (err) {
      console.error(err);
      res.status(400).send("Failed to retrieve items");
    }
  },

  // ✅ Create Restaurant
  createRestaurant: async (req: AuthenticatedRequest, res: Response):Promise<void> => {
    const { firstName, lastName, name, cuisineType, address, contactNumber, openingH, closingH } = req.body;

    try {
      if (!req.user) {
         res.status(401).json({ message: "Unauthorized access" });
         return
      }

      // Create the restaurant owner
      const restOwner = await prisma.restaurantOwner.create({
        data: { firstName, lastName, userId: req.user.id },
      });

      // Create the restaurant
      const newRestaurant = await prisma.restaurant.create({
        data: {
          name,
          cuisineType,
          address,
          contactNumber,
          openingH,
          closingH,
          restaurantOwnerId: restOwner.id,
        },
      });

      res.status(200).json(newRestaurant);
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to create restaurant");
    }
  },

  // ✅ Log Out
  logOutResto: (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, expires: new Date(0) });
    res.send("Logged out successfully");
  },
};

export default restaurantController;
