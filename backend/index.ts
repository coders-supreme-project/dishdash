import express from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3306, () => {
  console.log('Backend server running on http://localhost:3001');
});