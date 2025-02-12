import { User } from '@prisma/client'; // Import your User type from Prisma

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property to the Request interface
    }
  }
}