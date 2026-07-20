import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AnalyticsService } from './analytics.service';
import { format } from 'date-fns';

export class AnalyticsController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const period = (req.query.period as string) || format(new Date(), 'yyyy-MM');
      const data = await AnalyticsService.getDashboardData(req.user!.userId, period);
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
