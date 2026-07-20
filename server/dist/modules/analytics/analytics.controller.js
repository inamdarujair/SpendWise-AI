"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("./analytics.service");
const date_fns_1 = require("date-fns");
class AnalyticsController {
    static async getDashboard(req, res) {
        try {
            const period = req.query.period || (0, date_fns_1.format)(new Date(), 'yyyy-MM');
            const data = await analytics_service_1.AnalyticsService.getDashboardData(req.user.userId, period);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
