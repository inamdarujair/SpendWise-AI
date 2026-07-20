import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createTransactionSchema, updateTransactionSchema } from './transaction.validation';

const router = Router();

router.use(requireAuth);

router.get('/', TransactionController.getTransactions);
router.get('/:id', TransactionController.getTransaction);
router.post('/', validate(createTransactionSchema), TransactionController.createTransaction);
router.patch('/:id', validate(updateTransactionSchema), TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;
