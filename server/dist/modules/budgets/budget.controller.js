"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetController = void 0;
const budget_service_1 = require("./budget.service");
class BudgetController {
    static async getBudgets(req, res) {
        try {
            const { period, scope } = req.query;
            if (!period || !scope) {
                res.status(400).json({ error: 'period and scope are required query parameters' });
                return;
            }
            const budgets = await budget_service_1.BudgetService.getBudgetsWithUtilization(req.user.userId, period, scope);
            res.json(budgets);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async createBudget(req, res) {
        try {
            const budget = await budget_service_1.BudgetService.createBudget(req.user.userId, req.body);
            res.status(201).json(budget);
        }
        catch (error) {
            if (error.message === 'Budget already exists for this category and period') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateBudget(req, res) {
        try {
            const budget = await budget_service_1.BudgetService.updateBudget(req.user.userId, req.params.id, req.body);
            res.json(budget);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteBudget(req, res) {
        try {
            await budget_service_1.BudgetService.deleteBudget(req.user.userId, req.params.id);
            res.json({ message: 'Budget deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.BudgetController = BudgetController;
