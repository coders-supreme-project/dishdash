import { Router } from 'express';
import {
  createCategory,
  getCategoriesCustomer,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controller/categorie.controller';

const router = Router();

router.post('/categories', createCategory);
router.get('/categories', getCategoriesCustomer);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;