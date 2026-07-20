"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillController = void 0;
const bill_service_1 = require("./bill.service");
class BillController {
    static async getBills(req, res) {
        try {
            const bills = await bill_service_1.BillService.getBills(req.user.userId);
            res.json(bills);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async createBill(req, res) {
        try {
            const bill = await bill_service_1.BillService.createBill(req.user.userId, req.body);
            res.status(201).json(bill);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateBill(req, res) {
        try {
            const bill = await bill_service_1.BillService.updateBill(req.user.userId, req.params.id, req.body);
            res.json(bill);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteBill(req, res) {
        try {
            await bill_service_1.BillService.deleteBill(req.user.userId, req.params.id);
            res.json({ message: 'Bill deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.BillController = BillController;
