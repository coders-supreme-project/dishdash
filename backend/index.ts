import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import restaurantOwnerRoutes from "./Routes/restaurentOwner"; // ✅ Corrected import

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

// ✅ Use the correct route file
app.use("/api/restaurant-owner", restaurantOwnerRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit();
});
