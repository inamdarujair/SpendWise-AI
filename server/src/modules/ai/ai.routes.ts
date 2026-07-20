import { Router } from 'express';
import { AIController } from './ai.controller';
import { requireAuth } from '../../middleware/auth';

const router = Router();

router.use(requireAuth);

router.post('/categorize', AIController.categorize);
router.get('/insights', AIController.getInsights);
router.post('/extract-receipt', AIController.extractReceipt);
router.post('/advisor', AIController.askAdvisor);

export default router;
