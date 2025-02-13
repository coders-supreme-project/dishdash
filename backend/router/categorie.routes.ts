import { Router } from 'express';
import {
  createCategory,
  getCategoriesCustomer,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getMenuItemsByCategoryId,
} from '../controller/categorie.controller';

const router = Router();

router.post('/categories', createCategory);
router.get('/categories', getCategoriesCustomer);
router.get('/categories/:id', getCategoryById);
router.get('/categories/:categoryId/menu-items', getMenuItemsByCategoryId);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;