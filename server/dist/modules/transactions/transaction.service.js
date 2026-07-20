"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_model_1 = require("./transaction.model");
class TransactionService {
    static async getTransactions(userId, filters, page = 1, limit = 20, sortField = 'date', sortOrder = 'desc') {
        const query = { userId };
        if (filters.type)
            query.type = filters.type;
        if (filters.categoryId)
            query.categoryId = filters.categoryId;
        if (filters.startDate || filters.endDate) {
            query.date = {};
            if (filters.startDate)
                query.date.$gte = new Date(filters.startDate);
            if (filters.endDate)
                query.date.$lte = new Date(filters.endDate);
        }
        if (filters.isFavorite !== undefined)
            query.isFavorite = filters.isFavorite;
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            transaction_model_1.Transaction.find(query)
                .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
                .skip(skip)
                .limit(limit)
                .populate('categoryId', 'name icon color'),
            transaction_model_1.Transaction.countDocuments(query)
        ]);
        return {
            data: transactions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    static async getTransaction(userId, id) {
        const transaction = await transaction_model_1.Transaction.findOne({ _id: id, userId }).populate('categoryId');
        if (!transaction)
            throw new Error('Transaction not found');
        return transaction;
    }
    static async createTransaction(userId, data) {
        const transaction = new transaction_model_1.Transaction({ ...data, userId });
        return await transaction.save();
    }
    static async updateTransaction(userId, id, data) {
        const transaction = await transaction_model_1.Transaction.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true });
        if (!transaction)
            throw new Error('Transaction not found');
        return transaction;
    }
    static async deleteTransaction(userId, id) {
        const transaction = await transaction_model_1.Transaction.findOneAndDelete({ _id: id, userId });
        if (!transaction)
            throw new Error('Transaction not found');
        return transaction;
    }
}
exports.TransactionService = TransactionService;
