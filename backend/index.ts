import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser"; // ✅ Add cookie-parser for authentication
import restaurantOwnerRoutes from "./controllers/restaurentOwner"; // ✅ Corrected Import

dotenv.config(); // ✅ Load environment variables

const app = express();
const prisma = new PrismaClient();

// ✅ Middleware
app.use(express.json());
// app.use(cookieParser()); // ✅ Needed for handling authentication tokens

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
