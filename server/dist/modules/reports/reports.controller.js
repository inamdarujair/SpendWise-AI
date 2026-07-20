"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const reports_service_1 = require("./reports.service");
class ReportsController {
    static async exportCsv(req, res) {
        try {
            const csv = await reports_service_1.ReportsService.generateCsv(req.user.userId);
            res.header('Content-Type', 'text/csv');
            res.attachment('spendwise-report.csv');
            res.send(csv);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async exportPdf(req, res) {
        try {
            res.header('Content-Type', 'application/pdf');
            res.attachment('spendwise-report.pdf');
            await reports_service_1.ReportsService.generatePdf(req.user.userId, res);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ReportsController = ReportsController;
