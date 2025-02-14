import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, Role } from "@prisma/client";
import jwt from "jsonwebtoken";

// Initialize Prisma Client
const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    passwordHash: string;
    role: Role;
    phoneNumber: string | null;
    createdAt: Date;
    balance: number;
    updatedAt: Date;
  };
}


  // ✅ Create Restaurant Owner
  export const createRestaurantOwner= async (req: Request, res: Response): Promise<void> => {
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
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'restaurantOwner' }
      });
      res.status(201).json({
        message: "Restaurant owner created successfully",
        restaurantOwner: restOwner,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Other functions...

  // ✅ Update Restaurant Profile
  export const  updateProfile= async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, cuisineType, address, contactNumber, openingH, closingH, rating, firstName, lastName, email, password } = req.body;

    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized access" });
        return;
      }

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
  }

  // Other functions...


