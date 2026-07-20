import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { TransactionService } from './transaction.service';

export class TransactionController {
  static async getTransactions(req: AuthRequest, res: Response) {
    try {
      const { page, limit, sort, order, ...filters } = req.query;
      const result = await TransactionService.getTransactions(
        req.user!.userId,
        filters,
        Number(page) || 1,
        Number(limit) || 20,
        (sort as string) || 'date',
        (order as 'asc' | 'desc') || 'desc'
      );
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getTransaction(req: AuthRequest, res: Response) {
    try {
      const transaction = await TransactionService.getTransaction(req.user!.userId, req.params.id as string);
      res.json(transaction);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createTransaction(req: AuthRequest, res: Response) {
    try {
      const transaction = await TransactionService.createTransaction(req.user!.userId, req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateTransaction(req: AuthRequest, res: Response) {
    try {
      const transaction = await TransactionService.updateTransaction(req.user!.userId, req.params.id as string, req.body);
      res.json(transaction);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteTransaction(req: AuthRequest, res: Response) {
    try {
      await TransactionService.deleteTransaction(req.user!.userId, req.params.id as string);
      res.json({ message: 'Transaction deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
