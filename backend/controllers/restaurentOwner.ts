import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Initialize Prisma Client
const prisma = new PrismaClient();
function convertTo24HourFormat(time: string): string {
  const [hours, minutes, period] = time.match(/(\d+):(\d+)(AM|PM)/i)?.slice(1) || [];
  let hours24 = parseInt(hours, 10);
  
  if (period.toUpperCase() === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period.toUpperCase() === "AM" && hours24 === 12) {
    hours24 = 0;
  }
  
  return `${hours24.toString().padStart(2, "0")}:${minutes}:00`;
}


const restaurantController = {
  // ✅ Update Restaurant Profile
  updateProfile: async (req: Request, res: Response): Promise<void> => {
    const { name, cuisineType, address, contactNumber, openingH, closingH, rating, firstName, lastName, email, password } = req.body;

    try {
      const userId = Number(req.params.userId); // Assuming userId is passed as a parameter

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
  createItem: async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, imageUrl, isAvailable, categoryId } = req.body;

    try {
      const restaurantId = Number(req.params.restaurantId); // Assuming restaurantId is passed as a parameter

      const newItem = await prisma.menuItem.create({
        data: {
          restaurantId,
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
  updateItem: async (req: Request, res: Response): Promise<void> => {
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
createRestaurant :async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, name, cuisineType, address, contactNumber, openingH, closingH, userId } = req.body;
      const userIdNumber = Number(userId); // Ensure userId is a number
  
      // 🔹 Validate `userId`
      if (isNaN(userIdNumber)) {
         res.status(400).json({ error: "Invalid userId" });
         return
      }
  
      // 🔹 Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { id: userIdNumber } });
      if (!existingUser) {
         res.status(404).json({ error: "User not found" });
         return
      }
  
      // 🔹 Check if the user already owns a restaurant
      const existingOwner = await prisma.restaurantOwner.findUnique({
        where: { userId: userIdNumber },
      });
  
      if (existingOwner) {
         res.status(400).json({ error: "User already owns a restaurant" });
         return
      }
  
      // ✅ Create Restaurant Owner
      const restOwner = await prisma.restaurantOwner.create({
        data: { firstName, lastName, userId: userIdNumber },
      });
  
      // ✅ Create Restaurant
      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          cuisineType,
          address,
          contactNumber,
          openingH: new Date(`1970-01-01T${convertTo24HourFormat(openingH)}Z`), // ✅ Convert time
          closingH: new Date(`1970-01-01T${convertTo24HourFormat(closingH)}Z`),
          restaurantOwnerId: restOwner.id,
        },
      });
  
      res.status(201).json('hello');
    } catch (err) {
      console.error("Error creating restaurant:", err);
      res.status(500).json({ error: "Failed to create restaurant" });
    }
  },
  

  // ✅ Log Out (No longer needed without authentication)
  logOutResto: (req: Request, res: Response) => {
    res.send("Log out functionality is not applicable without authentication.");
  },
};

export default restaurantController;