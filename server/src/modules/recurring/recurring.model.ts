import mongoose, { Schema, Document } from 'mongoose';

export interface IRecurringRule extends Document {
  userId: mongoose.Types.ObjectId;
  cadence: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextRunDate: Date;
  template: {
    type: 'income' | 'expense';
    amountMinorUnits: number;
    currency: string;
    categoryId: mongoose.Types.ObjectId;
    tags: string[];
    notes?: string;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringRuleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cadence: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], required: true },
    nextRunDate: { type: Date, required: true },
    template: {
      type: { type: String, enum: ['income', 'expense'], required: true },
      amountMinorUnits: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
      tags: [{ type: String }],
      notes: { type: String },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RecurringRule = mongoose.model<IRecurringRule>('RecurringRule', RecurringRuleSchema);
