import { Router } from 'express';
import { CategoryController } from './category.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createCategorySchema, updateCategorySchema } from './category.validation';

const router = Router();

router.use(requireAuth);

router.get('/', CategoryController.getCategories);
router.post('/', validate(createCategorySchema), CategoryController.createCategory);
router.patch('/:id', validate(updateCategorySchema), CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
