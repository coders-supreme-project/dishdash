import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import authRoutes from "./routes/user";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use("/api/auth", authRoutes);




app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});