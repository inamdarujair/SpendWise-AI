import { Transaction } from './transaction.model';

export class TransactionService {
  static async getTransactions(
    userId: string,
    filters: any,
    page: number = 1,
    limit: number = 20,
    sortField: string = 'date',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const query: any = { userId };

    if (filters.type) query.type = filters.type;
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.startDate || filters.endDate) {
      query.date = {} as any;
      if (filters.startDate) query.date.$gte = new Date(filters.startDate);
      if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }
    if (filters.isFavorite !== undefined) query.isFavorite = filters.isFavorite;

    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ [sortField]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .populate('categoryId', 'name icon color'),
      Transaction.countDocuments(query)
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

  static async getTransaction(userId: string, id: string) {
    const transaction = await Transaction.findOne({ _id: id, userId }).populate('categoryId');
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  static async createTransaction(userId: string, data: any) {
    const transaction = new Transaction({ ...data, userId });
    return await transaction.save();
  }

  static async updateTransaction(userId: string, id: string, data: any) {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }

  static async deleteTransaction(userId: string, id: string) {
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!transaction) throw new Error('Transaction not found');
    return transaction;
  }
}
