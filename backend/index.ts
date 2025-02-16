// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from "./router/user";
import dotenv from "dotenv";
import helmet from 'helmet';
import cookieParser from "cookie-parser"
// import restaurantOwnerRoutes from "./router/restaurentOwner.routes"; // Fix typo in file name
import categorieRoutes from './router/categorie.routes';
import restaurantRoutes from './router/restaurant.routes';
import restaurantOwnerRoutes from './router/restaurentOwner.routes';
import driverRoutes from './router/driverRoutes';
import customerRoutes from './router/customer.routes';
import mediaRoutes from './router/media.controller';
import googleRoutes from './router/google.routes';

dotenv.config(); // ✅ Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
app.use(cors());
app.use(helmet())
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
dotenv.config();
app.use(express.json());
app.use("/api/user", authRoutes);
app.use('/api/auth', googleRoutes);


const prisma = new PrismaClient();

// ✅ Middleware
app.use(cors());
app.use(express.json());
// app.use(cookieParser()); // ✅ Needed for handling authentication tokens

app.use('/api/owner', restaurantOwnerRoutes);

app.use('/api', categorieRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/media', mediaRoutes);
// app.use('/api', reviewRoutes);
app.use('/api/restaurent', restaurantRoutes);
app.use('/api', orderRoutes);
// app.get('/api/users', async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// app.listen(3000, () => {
//   console.log('Backend server running on http://localhost:3000');
// });
// ✅ Test Database Connection
const testDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};
testDB();
const PORT = process.env.PORT || 3000;
// ✅ Routes
app.use("/api/restaurant-owner", restaurantOwnerRoutes); // ✅ Fixed route naming

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  testDB();
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log("🛑 Server stopped and Prisma disconnected");
    process.exit(0);
  });
});

export default app;