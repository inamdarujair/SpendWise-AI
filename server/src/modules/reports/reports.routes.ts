import { Router } from 'express';
import { ReportsController } from './reports.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/export/csv', ReportsController.exportCsv);
router.get('/export/pdf', ReportsController.exportPdf);

export default router;
