"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const transaction_model_1 = require("../transactions/transaction.model");
const budget_model_1 = require("../budgets/budget.model");
const goal_model_1 = require("../goals/goal.model");
const date_fns_1 = require("date-fns");
const mongoose_1 = __importDefault(require("mongoose"));
class AnalyticsService {
    static async getDashboardData(userId, currentPeriod = (0, date_fns_1.format)(new Date(), 'yyyy-MM')) {
        const date = (0, date_fns_1.parse)(currentPeriod, 'yyyy-MM', new Date());
        const startDate = (0, date_fns_1.startOfMonth)(date);
        const endDate = (0, date_fns_1.endOfMonth)(date);
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        // 1. Summary for current month
        const currentMonthTx = await transaction_model_1.Transaction.aggregate([
            { $match: { userId: userObjectId, date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$type', total: { $sum: '$amountMinorUnits' } } }
        ]);
        let income = 0, expense = 0;
        currentMonthTx.forEach(tx => {
            if (tx._id === 'income')
                income = tx.total;
            if (tx._id === 'expense')
                expense = tx.total;
        });
        const netCashFlow = income - expense;
        const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
        const allTimeTx = await transaction_model_1.Transaction.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: '$type', total: { $sum: '$amountMinorUnits' } } }
        ]);
        let allTimeIncome = 0, allTimeExpense = 0;
        allTimeTx.forEach(tx => {
            if (tx._id === 'income')
                allTimeIncome = tx.total;
            if (tx._id === 'expense')
                allTimeExpense = tx.total;
        });
        const totalBalance = allTimeIncome - allTimeExpense;
        // 2. Health Score
        let score = 50;
        const sr = income > 0 ? (income - expense) / income : 0;
        if (sr >= 0.3)
            score += 30;
        else if (sr >= 0.2)
            score += 20;
        else if (sr >= 0.1)
            score += 10;
        else if (sr < 0)
            score -= 20;
        const healthScore = Math.max(0, Math.min(100, score));
        // 3. Monthly trend — last 6 months
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const m = (0, date_fns_1.subMonths)(date, i);
            const mStart = (0, date_fns_1.startOfMonth)(m);
            const mEnd = (0, date_fns_1.endOfMonth)(m);
            const mTx = await transaction_model_1.Transaction.aggregate([
                { $match: { userId: userObjectId, date: { $gte: mStart, $lte: mEnd } } },
                { $group: { _id: '$type', total: { $sum: '$amountMinorUnits' } } }
            ]);
            let mIncome = 0, mExpense = 0;
            mTx.forEach((t) => {
                if (t._id === 'income')
                    mIncome = t.total;
                if (t._id === 'expense')
                    mExpense = t.total;
            });
            monthlyTrend.push({
                month: (0, date_fns_1.format)(m, 'MMM'),
                income: Math.round(mIncome / 100),
                expense: Math.round(mExpense / 100),
                savings: Math.round((mIncome - mExpense) / 100),
            });
        }
        // 4. Category breakdown for pie chart (expenses this month)
        const categoryBreakdown = await transaction_model_1.Transaction.aggregate([
            { $match: { userId: userObjectId, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: '$categoryId', total: { $sum: '$amountMinorUnits' } } },
            { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            { $project: { name: { $ifNull: ['$category.name', 'Uncategorized'] }, color: { $ifNull: ['$category.color', '#94a3b8'] }, total: 1 } },
            { $sort: { total: -1 } },
            { $limit: 8 },
        ]);
        // 5. Budget utilization
        const budgets = await budget_model_1.Budget.find({ userId, period: currentPeriod }).populate('categoryId', 'name color');
        const budgetsWithSpend = [];
        for (const b of budgets) {
            const spent = await transaction_model_1.Transaction.aggregate([
                { $match: { userId: userObjectId, type: 'expense', date: { $gte: startDate, $lte: endDate }, ...(b.categoryId ? { categoryId: b.categoryId._id } : {}) } },
                { $group: { _id: null, total: { $sum: '$amountMinorUnits' } } }
            ]);
            const spentAmount = spent[0]?.total || 0;
            budgetsWithSpend.push({
                _id: b._id,
                category: b.categoryId,
                limitMinorUnits: b.limitMinorUnits,
                spentMinorUnits: spentAmount,
                utilizationPercentage: b.limitMinorUnits > 0 ? (spentAmount / b.limitMinorUnits) * 100 : 0,
            });
        }
        // 6. Goals
        const goals = await goal_model_1.Goal.find({ userId }).sort({ createdAt: -1 }).limit(3);
        // 7. Recent transactions
        const recentTransactions = await transaction_model_1.Transaction.find({ userId })
            .populate('categoryId', 'name color icon')
            .sort({ date: -1 })
            .limit(5);
        return {
            period: currentPeriod,
            summary: {
                totalBalance,
                income,
                expense,
                netCashFlow,
                savingsRate: Math.round(savingsRate)
            },
            healthScore,
            healthStatus: healthScore >= 70 ? 'Excellent' : healthScore >= 50 ? 'Good' : healthScore >= 30 ? 'Fair' : 'Needs Attention',
            monthlyTrend,
            categoryBreakdown: categoryBreakdown.map(c => ({
                name: c.name,
                value: Math.round(c.total / 100),
                color: c.color,
            })),
            budgets: budgetsWithSpend,
            goals,
            recentTransactions,
        };
    }
}
exports.AnalyticsService = AnalyticsService;
