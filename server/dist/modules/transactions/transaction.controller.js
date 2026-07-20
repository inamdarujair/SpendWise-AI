"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
class TransactionController {
    static async getTransactions(req, res) {
        try {
            const { page, limit, sort, order, ...filters } = req.query;
            const result = await transaction_service_1.TransactionService.getTransactions(req.user.userId, filters, Number(page) || 1, Number(limit) || 20, sort || 'date', order || 'desc');
            res.json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async getTransaction(req, res) {
        try {
            const transaction = await transaction_service_1.TransactionService.getTransaction(req.user.userId, req.params.id);
            res.json(transaction);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async createTransaction(req, res) {
        try {
            const transaction = await transaction_service_1.TransactionService.createTransaction(req.user.userId, req.body);
            res.status(201).json(transaction);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateTransaction(req, res) {
        try {
            const transaction = await transaction_service_1.TransactionService.updateTransaction(req.user.userId, req.params.id, req.body);
            res.json(transaction);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteTransaction(req, res) {
        try {
            await transaction_service_1.TransactionService.deleteTransaction(req.user.userId, req.params.id);
            res.json({ message: 'Transaction deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.TransactionController = TransactionController;
