"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const user_model_1 = require("../users/user.model");
const transaction_model_1 = require("../transactions/transaction.model");
class AdminController {
    static async getUsers(req, res) {
        try {
            const users = await user_model_1.User.find().select('-passwordHash').sort({ createdAt: -1 });
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    static async getSystemAnalytics(req, res) {
        try {
            const totalUsers = await user_model_1.User.countDocuments();
            const totalTransactions = await transaction_model_1.Transaction.countDocuments();
            const transactionsAggregation = await transaction_model_1.Transaction.aggregate([
                { $group: { _id: null, totalVolume: { $sum: '$amountMinorUnits' } } }
            ]);
            const totalVolume = transactionsAggregation.length > 0 ? transactionsAggregation[0].totalVolume : 0;
            res.json({
                totalUsers,
                totalTransactions,
                totalVolumeMinorUnits: totalVolume
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.AdminController = AdminController;
