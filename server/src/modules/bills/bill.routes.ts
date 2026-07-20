import { Router } from 'express';
import { BillController } from './bill.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createBillSchema, updateBillSchema } from './bill.validation';

const router = Router();

router.use(requireAuth);

router.get('/', BillController.getBills);
router.post('/', validate(createBillSchema), BillController.createBill);
router.patch('/:id', validate(updateBillSchema), BillController.updateBill);
router.delete('/:id', BillController.deleteBill);

export default router;
