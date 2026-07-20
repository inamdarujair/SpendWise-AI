import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { GoalService } from './goal.service';

export class GoalController {
  static async getGoals(req: AuthRequest, res: Response) {
    try {
      const goals = await GoalService.getGoals(req.user!.userId);
      res.json(goals);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async createGoal(req: AuthRequest, res: Response) {
    try {
      const goal = await GoalService.createGoal(req.user!.userId, req.body);
      res.status(201).json(goal);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateGoal(req: AuthRequest, res: Response) {
    try {
      const goal = await GoalService.updateGoal(req.user!.userId, req.params.id as string, req.body);
      res.json(goal);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteGoal(req: AuthRequest, res: Response) {
    try {
      await GoalService.deleteGoal(req.user!.userId, req.params.id as string);
      res.json({ message: 'Goal deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
