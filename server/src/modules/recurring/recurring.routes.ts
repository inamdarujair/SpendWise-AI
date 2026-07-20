import { Router } from 'express';
import { RecurringController } from './recurring.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createRecurringRuleSchema, updateRecurringRuleSchema } from './recurring.validation';

const router = Router();

router.use(requireAuth);

router.get('/', RecurringController.getRules);
router.post('/', validate(createRecurringRuleSchema), RecurringController.createRule);
router.patch('/:id', validate(updateRecurringRuleSchema), RecurringController.updateRule);
router.delete('/:id', RecurringController.deleteRule);

export default router;
