import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { RecurringService } from './recurring.service';

export class RecurringController {
  static async getRules(req: AuthRequest, res: Response) {
    try {
      const rules = await RecurringService.getRules(req.user!.userId);
      res.json(rules);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async createRule(req: AuthRequest, res: Response) {
    try {
      const rule = await RecurringService.createRule(req.user!.userId, req.body);
      res.status(201).json(rule);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateRule(req: AuthRequest, res: Response) {
    try {
      const rule = await RecurringService.updateRule(req.user!.userId, req.params.id as string, req.body);
      res.json(rule);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteRule(req: AuthRequest, res: Response) {
    try {
      await RecurringService.deleteRule(req.user!.userId, req.params.id as string);
      res.json({ message: 'Recurring rule deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
