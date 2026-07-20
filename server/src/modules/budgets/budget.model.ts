import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  scope: 'monthly' | 'yearly';
  categoryId?: mongoose.Types.ObjectId; // If null, it's the overall budget
  limitMinorUnits: number;
  period: string; // e.g. "2026-07" for monthly, "2026" for yearly
  rollover: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scope: { type: String, enum: ['monthly', 'yearly'], required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    limitMinorUnits: { type: Number, required: true },
    period: { type: String, required: true },
    rollover: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BudgetSchema.index({ userId: 1, period: 1, categoryId: 1 }, { unique: true });

export const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
