import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { verifyRefreshToken } from '../../utils/jwt';
import { env } from '../../config/env';

const isProduction = env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'strict') as 'none' | 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.status(201).json({ user: result.user, accessToken: result.accessToken });
    } catch (error: any) {
      if (error.message === 'Email already in use') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.json({ user: result.user, accessToken: result.accessToken });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ error: 'No refresh token provided' });
        return;
      }

      const decoded = verifyRefreshToken(refreshToken);
      const result = await AuthService.refresh(decoded.userId);

      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.json({ accessToken: result.accessToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ message: 'Logged out successfully' });
  }

  static async updateProfile(req: any, res: Response): Promise<void> {
    try {
      const { name, currency, theme } = req.body;
      const user = await AuthService.updateProfile(req.user.userId, { name, currency, theme });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updatePassword(req: any, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.updatePassword(req.user.userId, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update password' });
    }
  }
}
