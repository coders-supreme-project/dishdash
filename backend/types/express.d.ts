import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Extend Express Request type
    }
  }
}

export {}; // Ensure TypeScript treats this as a module
