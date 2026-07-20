import { Router } from 'express';
import { BudgetController } from './budget.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createBudgetSchema, updateBudgetSchema } from './budget.validation';

const router = Router();

router.use(requireAuth);

router.get('/', BudgetController.getBudgets);
router.post('/', validate(createBudgetSchema), BudgetController.createBudget);
router.patch('/:id', validate(updateBudgetSchema), BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

export default router;
