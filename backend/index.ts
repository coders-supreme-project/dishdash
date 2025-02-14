// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from "./router/user";
import dotenv from "dotenv";
import helmet from 'helmet';
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
app.use(helmet())
app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/api/user", authRoutes);

app.use('/api/auth', googleRoutes);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// app.use(cookieParser()); // ✅ Needed for handling authentication tokens

app.use('/api/owner', restaurantOwnerRoutes);

// Routes
app.use("/api/user", authRoutes);
app.use('/api', categorieRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', customerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/media', mediaRoutes);
// app.use('/api', reviewRoutes);
app.use('/api/restaurant', restaurantRoutes);
// app.get('/api/users', async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// Test Database Connection
const testDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// Start server
const PORT = 5000; // Fixed port to match frontend expectations
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  testDB(); // Test DB connection after server starts
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit();
});

export default app;