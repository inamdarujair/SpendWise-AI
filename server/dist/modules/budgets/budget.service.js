"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetService = void 0;
const budget_model_1 = require("./budget.model");
const transaction_model_1 = require("../transactions/transaction.model");
const date_fns_1 = require("date-fns");
class BudgetService {
    static async getBudgetsWithUtilization(userId, period, scope) {
        const budgets = await budget_model_1.Budget.find({ userId, period, scope }).populate('categoryId');
        // Calculate utilization for each budget
        const budgetsWithUtilization = await Promise.all(budgets.map(async (budget) => {
            let startDate, endDate;
            if (scope === 'monthly') {
                const date = (0, date_fns_1.parse)(period, 'yyyy-MM', new Date());
                startDate = (0, date_fns_1.startOfMonth)(date);
                endDate = (0, date_fns_1.endOfMonth)(date);
            }
            else {
                const date = (0, date_fns_1.parse)(period, 'yyyy', new Date());
                startDate = (0, date_fns_1.startOfYear)(date);
                endDate = (0, date_fns_1.endOfYear)(date);
            }
            const matchQuery = {
                userId,
                type: 'expense',
                date: { $gte: startDate, $lte: endDate },
            };
            if (budget.categoryId) {
                matchQuery.categoryId = budget.categoryId;
            }
            const aggregation = await transaction_model_1.Transaction.aggregate([
                { $match: matchQuery },
                { $group: { _id: null, totalSpent: { $sum: '$amountMinorUnits' } } }
            ]);
            const spentMinorUnits = aggregation.length > 0 ? aggregation[0].totalSpent : 0;
            return {
                ...budget.toObject(),
                spentMinorUnits,
                utilizationPercentage: (spentMinorUnits / budget.limitMinorUnits) * 100
            };
        }));
        return budgetsWithUtilization;
    }
    static async createBudget(userId, data) {
        const existing = await budget_model_1.Budget.findOne({
            userId,
            period: data.period,
            categoryId: data.categoryId || null
        });
        if (existing) {
            throw new Error('Budget already exists for this category and period');
        }
        const budget = new budget_model_1.Budget({ ...data, userId });
        return await budget.save();
    }
    static async updateBudget(userId, id, data) {
        const budget = await budget_model_1.Budget.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true });
        if (!budget)
            throw new Error('Budget not found');
        return budget;
    }
    static async deleteBudget(userId, id) {
        const budget = await budget_model_1.Budget.findOneAndDelete({ _id: id, userId });
        if (!budget)
            throw new Error('Budget not found');
        return budget;
    }
}
exports.BudgetService = BudgetService;
