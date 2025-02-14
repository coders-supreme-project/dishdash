// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from "./router/user";
import dotenv from "dotenv";
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import categorieRoutes from './router/categorie.routes';
import restaurantRoutes from './router/restaurant.routes';
import customerRoutes from './router/customer.routes';
import googleRoutes from './router/google.routes';

dotenv.config(); // ✅ Load environment variables

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
app.use(cookieParser());

// Routes
app.use("/api/user", authRoutes);
app.use('/api', categorieRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', customerRoutes);

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