"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const goal_service_1 = require("./goal.service");
class GoalController {
    static async getGoals(req, res) {
        try {
            const goals = await goal_service_1.GoalService.getGoals(req.user.userId);
            res.json(goals);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async createGoal(req, res) {
        try {
            const goal = await goal_service_1.GoalService.createGoal(req.user.userId, req.body);
            res.status(201).json(goal);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateGoal(req, res) {
        try {
            const goal = await goal_service_1.GoalService.updateGoal(req.user.userId, req.params.id, req.body);
            res.json(goal);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteGoal(req, res) {
        try {
            await goal_service_1.GoalService.deleteGoal(req.user.userId, req.params.id);
            res.json({ message: 'Goal deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.GoalController = GoalController;
