import mongoose, { Schema, Document } from 'mongoose';

export interface IBill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amountMinorUnits: number;
  dueDate: Date;
  recurrence: 'none' | 'monthly' | 'yearly' | 'weekly' | 'one-time';
  category: string;
  paid: boolean;
  linkedTransactionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    amountMinorUnits: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    recurrence: { type: String, enum: ['none', 'monthly', 'yearly', 'weekly', 'one-time'], default: 'monthly' },
    category: { type: String, default: 'Bills' },
    paid: { type: Boolean, default: false },
    linkedTransactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
  },
  { timestamps: true }
);

export const Bill = mongoose.model<IBill>('Bill', BillSchema);
