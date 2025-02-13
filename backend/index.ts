import express from 'express';
import { PrismaClient } from '@prisma/client';
import categorieRoutes from './router/categorie.routes';
import reviewRoutes from './router/review.routes';
import restaurantRoutes from './router/restaurant.routes';
import customerRoutes from './router/customer.routes';

import dotenv from "dotenv";
import restaurantOwnerRoutes from "./controller/restaurentOwner.controller"; // ✅ Corrected Import

dotenv.config(); // ✅ Load environment variables

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(express.json());
// app.use(cookieParser()); // ✅ Needed for handling authentication tokens


app.use('/api', categorieRoutes);
app.use('/api', reviewRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', customerRoutes);
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3300, () => {
  console.log('Backend server running on http://localhost:3001');
});
// ✅ Test Database Connection
const testDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if DB fails
  }
};

// ✅ Run Test on Server Start
testDB();

// ✅ Routes
// app.use("/api/restaurant-owner", restaurantOwnerRoutes); // ✅ Fixed route naming

// ✅ Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Ensure Prisma disconnects when server stops
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit();
});
