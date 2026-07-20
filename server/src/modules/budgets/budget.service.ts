import { Budget, IBudget } from './budget.model';
import { Transaction } from '../transactions/transaction.model';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, parse } from 'date-fns';

export class BudgetService {
  static async getBudgetsWithUtilization(userId: string, period: string, scope: 'monthly' | 'yearly') {
    const budgets = await Budget.find({ userId, period, scope }).populate('categoryId');
    
    // Calculate utilization for each budget
    const budgetsWithUtilization = await Promise.all(
      budgets.map(async (budget) => {
        let startDate, endDate;
        if (scope === 'monthly') {
          const date = parse(period, 'yyyy-MM', new Date());
          startDate = startOfMonth(date);
          endDate = endOfMonth(date);
        } else {
          const date = parse(period, 'yyyy', new Date());
          startDate = startOfYear(date);
          endDate = endOfYear(date);
        }

        const matchQuery: any = {
          userId,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        };

        if (budget.categoryId) {
          matchQuery.categoryId = budget.categoryId;
        }

        const aggregation = await Transaction.aggregate([
          { $match: matchQuery },
          { $group: { _id: null, totalSpent: { $sum: '$amountMinorUnits' } } }
        ]);

        const spentMinorUnits = aggregation.length > 0 ? aggregation[0].totalSpent : 0;

        return {
          ...budget.toObject(),
          spentMinorUnits,
          utilizationPercentage: (spentMinorUnits / budget.limitMinorUnits) * 100
        };
      })
    );

    return budgetsWithUtilization;
  }

  static async createBudget(userId: string, data: Partial<IBudget>) {
    const existing = await Budget.findOne({ 
      userId, 
      period: data.period, 
      categoryId: data.categoryId || null 
    });
    
    if (existing) {
      throw new Error('Budget already exists for this category and period');
    }

    const budget = new Budget({ ...data, userId });
    return await budget.save();
  }

  static async updateBudget(userId: string, id: string, data: Partial<IBudget>) {
    const budget = await Budget.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );
    if (!budget) throw new Error('Budget not found');
    return budget;
  }

  static async deleteBudget(userId: string, id: string) {
    const budget = await Budget.findOneAndDelete({ _id: id, userId });
    if (!budget) throw new Error('Budget not found');
    return budget;
  }
}
