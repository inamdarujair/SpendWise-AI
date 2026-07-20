import { RecurringRule, IRecurringRule } from './recurring.model';

export class RecurringService {
  static async getRules(userId: string) {
    return await RecurringRule.find({ userId }).populate('template.categoryId');
  }

  static async createRule(userId: string, data: Partial<IRecurringRule>) {
    const rule = new RecurringRule({ ...data, userId });
    return await rule.save();
  }

  static async updateRule(userId: string, id: string, data: Partial<IRecurringRule>) {
    const rule = await RecurringRule.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );
    if (!rule) throw new Error('Recurring rule not found');
    return rule;
  }

  static async deleteRule(userId: string, id: string) {
    const rule = await RecurringRule.findOneAndDelete({ _id: id, userId });
    if (!rule) throw new Error('Recurring rule not found');
    return rule;
  }
}
