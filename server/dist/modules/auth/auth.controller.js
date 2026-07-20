"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../config/env");
class AuthController {
    static async register(req, res) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            res.status(201).json({ user: result.user, accessToken: result.accessToken });
        }
        catch (error) {
            if (error.message === 'Email already in use') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async login(req, res) {
        try {
            const result = await auth_service_1.AuthService.login(req.body);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({ user: result.user, accessToken: result.accessToken });
        }
        catch (error) {
            if (error.message === 'Invalid credentials') {
                res.status(401).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async refresh(req, res) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ error: 'No refresh token provided' });
                return;
            }
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const result = await auth_service_1.AuthService.refresh(decoded.userId);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({ accessToken: result.accessToken });
        }
        catch (error) {
            res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
    }
    static async logout(req, res) {
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    }
    static async updateProfile(req, res) {
        try {
            const { name, currency, theme } = req.body;
            const user = await auth_service_1.AuthService.updateProfile(req.user.userId, { name, currency, theme });
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            await auth_service_1.AuthService.updatePassword(req.user.userId, currentPassword, newPassword);
            res.json({ message: 'Password updated successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message || 'Failed to update password' });
        }
    }
}
exports.AuthController = AuthController;
