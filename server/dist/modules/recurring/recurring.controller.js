"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringController = void 0;
const recurring_service_1 = require("./recurring.service");
class RecurringController {
    static async getRules(req, res) {
        try {
            const rules = await recurring_service_1.RecurringService.getRules(req.user.userId);
            res.json(rules);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async createRule(req, res) {
        try {
            const rule = await recurring_service_1.RecurringService.createRule(req.user.userId, req.body);
            res.status(201).json(rule);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateRule(req, res) {
        try {
            const rule = await recurring_service_1.RecurringService.updateRule(req.user.userId, req.params.id, req.body);
            res.json(rule);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteRule(req, res) {
        try {
            await recurring_service_1.RecurringService.deleteRule(req.user.userId, req.params.id);
            res.json({ message: 'Recurring rule deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.RecurringController = RecurringController;
