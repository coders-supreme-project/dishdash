import express from 'express';
import { PrismaClient } from '@prisma/client';
import categorieRoutes from './router/categorie.routes';
import reviewRoutes from './router/review.routes';
import restaurantRoutes from './router/restaurant.routes';


import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 
// import restaurantOwnerRoutes from "./router/restaurentOwner.routes"; // ✅ Corrected Import

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

// ✅ Use the correct route file
// app.use("/api/restaurant-owner", restaurantOwnerRoutes);
app.use('/api', categorieRoutes);
app.use('/api', reviewRoutes);
app.use('/api', restaurantRoutes);
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
const testDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if DB fails
  }
};
testDB();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit();
});
