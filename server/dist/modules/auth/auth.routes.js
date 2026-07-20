"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_1 = require("../../middleware/validate");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(auth_validation_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validate_1.validate)(auth_validation_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', auth_controller_1.AuthController.refresh);
router.post('/logout', auth_controller_1.AuthController.logout);
// Protected routes (need auth middleware)
const auth_1 = require("../../middleware/auth");
router.put('/profile', auth_1.requireAuth, auth_controller_1.AuthController.updateProfile);
router.put('/password', auth_1.requireAuth, auth_controller_1.AuthController.updatePassword);
exports.default = router;
