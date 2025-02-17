import { Router } from 'express';
import {
  createCategory,
  getCategoriesCustomer,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getMenuItemsByCategoryId,
} from '../controller/categorie.controller';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Add error handling middleware
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/', asyncHandler(createCategory));
router.get('/', asyncHandler(getCategoriesCustomer));
router.get('/one/:id', asyncHandler(getCategoryById));
router.get('/menu-items/:categoryId', asyncHandler(getMenuItemsByCategoryId));
router.put('/:id', asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

// Add error handling middleware at the end
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default router;