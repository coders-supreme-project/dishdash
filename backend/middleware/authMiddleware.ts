// authmiddleware.ts
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, UserPayload } from '../controller/user'; // adjust path as needed
interface Decoded{
  id:number,
  role:string
}
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("authenticatetoken");

// Rename the interface to avoid conflict
interface RequestWithUser extends Request {
  user?: UserPayload;
}

const prisma = new PrismaClient();

export const authenticateJWT = async (req: RequestWithUser, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded:Decoded= jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Export the type for use in other files
export type { RequestWithUser };