import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    // Decode token
    const decoded = jwt.decode(token) as Partial<User>;

    req.user = decoded as User; // ✅ TypeScript now recognizes req.user
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};

export default authMiddleware;