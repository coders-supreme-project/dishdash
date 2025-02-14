import { Request } from 'express';

// Define the UserPayload type (replace with your actual user payload type)
export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

// Extend the Express Request type to include the user property
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}