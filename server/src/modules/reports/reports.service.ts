import { Transaction } from '../transactions/transaction.model';
import { createObjectCsvStringifier } from 'csv-writer';
import PDFDocument from 'pdfkit';

export class ReportsService {
  static async generateCsv(userId: string) {
    const transactions = await Transaction.find({ userId }).populate('categoryId').sort({ date: -1 });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'date', title: 'DATE' },
        { id: 'type', title: 'TYPE' },
        { id: 'category', title: 'CATEGORY' },
        { id: 'amount', title: 'AMOUNT' },
        { id: 'notes', title: 'NOTES' },
      ]
    });

    const records = transactions.map((t: any) => ({
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

  static async generatePdf(userId: string, writeStream: NodeJS.WritableStream) {
    const transactions = await Transaction.find({ userId }).populate('categoryId').sort({ date: -1 });
    
    const doc = new PDFDocument();
    doc.pipe(writeStream);

    doc.fontSize(20).text('SpendWise AI - Financial Report', { align: 'center' });
    doc.moveDown();

    let income = 0;
    let expense = 0;

    transactions.forEach((t: any) => {
      if (t.type === 'income') income += t.amountMinorUnits;
      if (t.type === 'expense') expense += t.amountMinorUnits;
    });

    doc.fontSize(14).text(`Total Income: $${(income / 100).toFixed(2)}`);
    doc.text(`Total Expenses: $${(expense / 100).toFixed(2)}`);
    doc.text(`Net Cash Flow: $${((income - expense) / 100).toFixed(2)}`);
    doc.moveDown(2);

    doc.fontSize(16).text('Recent Transactions:');
    doc.moveDown();

    transactions.slice(0, 50).forEach((t: any) => {
      const date = t.date.toISOString().split('T')[0];
      const amount = `$${(t.amountMinorUnits / 100).toFixed(2)}`;
      const cat = t.categoryId ? t.categoryId.name : 'Uncategorized';
      doc.fontSize(12).text(`${date} | ${t.type.toUpperCase()} | ${cat} | ${amount}`);
    });

    doc.end();
  }
}
