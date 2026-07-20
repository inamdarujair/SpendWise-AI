import { Goal, IGoal } from './goal.model';

export class GoalService {
  static async getGoals(userId: string) {
    return await Goal.find({ userId }).sort({ createdAt: -1 });
  }

  static async createGoal(userId: string, data: Partial<IGoal>) {
    const goal = new Goal({ ...data, userId });
    return await goal.save();
  }

  static async updateGoal(userId: string, id: string, data: Partial<IGoal>) {
    const update: any = { ...data };

    // Auto-complete goal if current >= target
    if (
      data.currentAmountMinorUnits !== undefined &&
      data.currentAmountMinorUnits > 0
    ) {
      const existingGoal = await Goal.findOne({ _id: id, userId });
      if (existingGoal && data.currentAmountMinorUnits >= existingGoal.targetAmountMinorUnits) {
        update.status = 'completed';
      }
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      { $set: update },
      { new: true }
    );
    if (!goal) throw new Error('Goal not found');
    return goal;
  }

  static async deleteGoal(userId: string, id: string) {
    const goal = await Goal.findOneAndDelete({ _id: id, userId });
    if (!goal) throw new Error('Goal not found');
    return goal;
  }
}
