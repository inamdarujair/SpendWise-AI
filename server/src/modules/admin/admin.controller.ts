import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { User } from '../users/user.model';
import { Transaction } from '../transactions/transaction.model';

export class AdminController {
  static async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSystemAnalytics(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalTransactions = await Transaction.countDocuments();
      
      const transactionsAggregation = await Transaction.aggregate([
        { $group: { _id: null, totalVolume: { $sum: '$amountMinorUnits' } } }
      ]);
      const totalVolume = transactionsAggregation.length > 0 ? transactionsAggregation[0].totalVolume : 0;

      res.json({
        totalUsers,
        totalTransactions,
        totalVolumeMinorUnits: totalVolume
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
