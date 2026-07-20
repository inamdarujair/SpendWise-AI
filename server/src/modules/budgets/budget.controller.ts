import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { BudgetService } from './budget.service';

export class BudgetController {
  static async getBudgets(req: AuthRequest, res: Response) {
    try {
      const { period, scope } = req.query;
      if (!period || !scope) {
        res.status(400).json({ error: 'period and scope are required query parameters' });
        return;
      }
      const budgets = await BudgetService.getBudgetsWithUtilization(
        req.user!.userId,
        period as string,
        scope as 'monthly' | 'yearly'
      );
      res.json(budgets);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async createBudget(req: AuthRequest, res: Response) {
    try {
      const budget = await BudgetService.createBudget(req.user!.userId, req.body);
      res.status(201).json(budget);
    } catch (error: any) {
      if (error.message === 'Budget already exists for this category and period') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateBudget(req: AuthRequest, res: Response) {
    try {
      const budget = await BudgetService.updateBudget(req.user!.userId, req.params.id as string, req.body);
      res.json(budget);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteBudget(req: AuthRequest, res: Response) {
    try {
      await BudgetService.deleteBudget(req.user!.userId, req.params.id as string);
      res.json({ message: 'Budget deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
