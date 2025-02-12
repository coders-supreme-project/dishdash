import express from 'express';
import { PrismaClient } from '@prisma/client';
import categorieRoutes from './router/categorie.routes';
import reviewRoutes from './router/review.routes';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());


app.use('/api', categorieRoutes);
app.use('/api', reviewRoutes);
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3300, () => {
  console.log('Backend server running on http://localhost:3001');
});