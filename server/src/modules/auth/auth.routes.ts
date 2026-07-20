import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected routes (need auth middleware)
import { requireAuth } from '../../middleware/auth';
router.put('/profile', requireAuth, AuthController.updateProfile);
router.put('/password', requireAuth, AuthController.updatePassword);

export default router;
