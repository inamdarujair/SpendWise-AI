"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringService = void 0;
const recurring_model_1 = require("./recurring.model");
class RecurringService {
    static async getRules(userId) {
        return await recurring_model_1.RecurringRule.find({ userId }).populate('template.categoryId');
    }
    static async createRule(userId, data) {
        const rule = new recurring_model_1.RecurringRule({ ...data, userId });
        return await rule.save();
    }
    static async updateRule(userId, id, data) {
        const rule = await recurring_model_1.RecurringRule.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true });
        if (!rule)
            throw new Error('Recurring rule not found');
        return rule;
    }
    static async deleteRule(userId, id) {
        const rule = await recurring_model_1.RecurringRule.findOneAndDelete({ _id: id, userId });
        if (!rule)
            throw new Error('Recurring rule not found');
        return rule;
    }
}
exports.RecurringService = RecurringService;
