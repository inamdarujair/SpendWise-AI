"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const transaction_model_1 = require("../transactions/transaction.model");
const csv_writer_1 = require("csv-writer");
const pdfkit_1 = __importDefault(require("pdfkit"));
class ReportsService {
    static async generateCsv(userId) {
        const transactions = await transaction_model_1.Transaction.find({ userId }).populate('categoryId').sort({ date: -1 });
        const csvStringifier = (0, csv_writer_1.createObjectCsvStringifier)({
            header: [
                { id: 'date', title: 'DATE' },
                { id: 'type', title: 'TYPE' },
                { id: 'category', title: 'CATEGORY' },
                { id: 'amount', title: 'AMOUNT' },
                { id: 'notes', title: 'NOTES' },
            ]
        });
        const records = transactions.map((t) => ({
            date: t.date.toISOString().split('T')[0],
            type: t.type,
            category: t.categoryId ? t.categoryId.name : 'Uncategorized',
            amount: (t.amountMinorUnits / 100).toFixed(2),
            notes: t.notes || '',
        }));
        const header = csvStringifier.getHeaderString();
        const recordsString = csvStringifier.stringifyRecords(records);
        return header + recordsString;
    }
    static async generatePdf(userId, writeStream) {
        const transactions = await transaction_model_1.Transaction.find({ userId }).populate('categoryId').sort({ date: -1 });
        const doc = new pdfkit_1.default();
        doc.pipe(writeStream);
        doc.fontSize(20).text('SpendWise AI - Financial Report', { align: 'center' });
        doc.moveDown();
        let income = 0;
        let expense = 0;
        transactions.forEach((t) => {
            if (t.type === 'income')
                income += t.amountMinorUnits;
            if (t.type === 'expense')
                expense += t.amountMinorUnits;
        });
        doc.fontSize(14).text(`Total Income: $${(income / 100).toFixed(2)}`);
        doc.text(`Total Expenses: $${(expense / 100).toFixed(2)}`);
        doc.text(`Net Cash Flow: $${((income - expense) / 100).toFixed(2)}`);
        doc.moveDown(2);
        doc.fontSize(16).text('Recent Transactions:');
        doc.moveDown();
        transactions.slice(0, 50).forEach((t) => {
            const date = t.date.toISOString().split('T')[0];
            const amount = `$${(t.amountMinorUnits / 100).toFixed(2)}`;
            const cat = t.categoryId ? t.categoryId.name : 'Uncategorized';
            doc.fontSize(12).text(`${date} | ${t.type.toUpperCase()} | ${cat} | ${amount}`);
        });
        doc.end();
    }
}
exports.ReportsService = ReportsService;
