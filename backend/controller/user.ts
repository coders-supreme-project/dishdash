const bcrypt = require("bcryptjs");
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from 'express';
const prisma = new PrismaClient();

// Define the structure of the user object
export interface UserPayload {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  phoneNumber: string | null;
  createdAt: Date;
  balance: number;
  updatedAt: Date;
}

// Extend the Request type to include the user property
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phoneNumber, address } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    res.status(400).json({ error: "Name, email, and password are required." });
    return;
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists." });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with related Customer
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'customer', // Default role for new users
        phoneNumber: phoneNumber || null, // Optional field
        customer: {
          create: {
            firstName: name,
            lastName: '', // Optional field
            deliveryAddress: address || '' // Optional field
          }
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            deliveryAddress: true
          }
        },
        createdAt: true
      }
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return user and token
    res.status(201).json({ user, token });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      error: "Registration failed", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user with related Customer
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        phoneNumber: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            deliveryAddress: true
          }
        },
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Remove passwordHash from the response
    const { passwordHash, ...userWithoutPassword } = user;

    // Return user and token
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

// Get user profile
export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            deliveryAddress: true
          }
        },
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      error: "Profile fetch error",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};