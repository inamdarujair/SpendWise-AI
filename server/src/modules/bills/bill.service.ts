import { Bill, IBill } from './bill.model';

export class BillService {
  static async getBills(userId: string) {
    return await Bill.find({ userId }).sort({ dueDate: 1 });
  }

  static async createBill(userId: string, data: Partial<IBill>) {
    const bill = new Bill({ ...data, userId });
    return await bill.save();
  }

  static async updateBill(userId: string, id: string, data: Partial<IBill>) {
    const bill = await Bill.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );
    if (!bill) throw new Error('Bill not found');
    return bill;
  }

  static async deleteBill(userId: string, id: string) {
    const bill = await Bill.findOneAndDelete({ _id: id, userId });
    if (!bill) throw new Error('Bill not found');
    return bill;
  }
}
