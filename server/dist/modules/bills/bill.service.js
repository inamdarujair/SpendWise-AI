"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillService = void 0;
const bill_model_1 = require("./bill.model");
class BillService {
    static async getBills(userId) {
        return await bill_model_1.Bill.find({ userId }).sort({ dueDate: 1 });
    }
    static async createBill(userId, data) {
        const bill = new bill_model_1.Bill({ ...data, userId });
        return await bill.save();
    }
    static async updateBill(userId, id, data) {
        const bill = await bill_model_1.Bill.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true });
        if (!bill)
            throw new Error('Bill not found');
        return bill;
    }
    static async deleteBill(userId, id) {
        const bill = await bill_model_1.Bill.findOneAndDelete({ _id: id, userId });
        if (!bill)
            throw new Error('Bill not found');
        return bill;
    }
}
exports.BillService = BillService;
