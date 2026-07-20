import { Router } from 'express';
import { GoalController } from './goal.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createGoalSchema, updateGoalSchema } from './goal.validation';

const router = Router();

router.use(requireAuth);

router.get('/', GoalController.getGoals);
router.post('/', validate(createGoalSchema), GoalController.createGoal);
router.patch('/:id', validate(updateGoalSchema), GoalController.updateGoal);
router.delete('/:id', GoalController.deleteGoal);

export default router;
