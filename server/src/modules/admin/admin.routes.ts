import { Router } from 'express';
import { AdminController } from './admin.controller';
import { requireAuth, requireAdmin } from '../../middleware/auth';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', AdminController.getUsers);
router.get('/analytics', AdminController.getSystemAnalytics);

export default router;
