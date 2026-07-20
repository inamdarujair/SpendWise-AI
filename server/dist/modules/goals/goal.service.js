"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalService = void 0;
const goal_model_1 = require("./goal.model");
class GoalService {
    static async getGoals(userId) {
        return await goal_model_1.Goal.find({ userId }).sort({ createdAt: -1 });
    }
    static async createGoal(userId, data) {
        const goal = new goal_model_1.Goal({ ...data, userId });
        return await goal.save();
    }
    static async updateGoal(userId, id, data) {
        const update = { ...data };
        // Auto-complete goal if current >= target
        if (data.currentAmountMinorUnits !== undefined &&
            data.currentAmountMinorUnits > 0) {
            const existingGoal = await goal_model_1.Goal.findOne({ _id: id, userId });
            if (existingGoal && data.currentAmountMinorUnits >= existingGoal.targetAmountMinorUnits) {
                update.status = 'completed';
            }
        }
        const goal = await goal_model_1.Goal.findOneAndUpdate({ _id: id, userId }, { $set: update }, { new: true });
        if (!goal)
            throw new Error('Goal not found');
        return goal;
    }
    static async deleteGoal(userId, id) {
        const goal = await goal_model_1.Goal.findOneAndDelete({ _id: id, userId });
        if (!goal)
            throw new Error('Goal not found');
        return goal;
    }
}
exports.GoalService = GoalService;
