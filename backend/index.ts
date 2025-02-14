import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from "./router/user";
import dotenv from "dotenv";
import helmet from 'helmet';
import cookieParser from "cookie-parser"; // ✅ Add cookie-parser for authentication
// import restaurantOwnerRoutes from "./router/restaurentOwner.routes"; // Fix typo in file name
import categorieRoutes from './router/categorie.routes';
// import reviewRoutes from './router/review.routes';
import restaurantRoutes from './router/restaurant.routes';
import customerRoutes from './router/customer.routes';


dotenv.config(); // ✅ Load environment variables

const app = express();
app.use(helmet())
app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/api/user", authRoutes);



app.use(cors({ origin: "http://localhost:3000", credentials: true }));

const prisma = new PrismaClient();

// ✅ Middleware
app.use(cors());
app.use(express.json());
// app.use(cookieParser()); // ✅ Needed for handling authentication tokens


app.use('/api', categorieRoutes);
// app.use('/api', reviewRoutes);
app.use('/api', restaurantRoutes);
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
    process.exit(1); // Exit process if DB fails
  }
};
testDB();

// ✅ Routes
// app.use("/api/restaurant-owner", restaurantOwnerRoutes); // ✅ Fixed route naming

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected");
  process.exit();
});
