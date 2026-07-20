import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'income' | 'expense';
  amountMinorUnits: number;
  currency: string;
  categoryId: mongoose.Types.ObjectId;
  tags: string[];
  notes?: string;
  date: Date;
  isFavorite: boolean;
  receiptUrl?: string;
  source: 'manual' | 'recurring' | 'import';
  status: 'completed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amountMinorUnits: { type: Number, required: true }, // Store in cents
    currency: { type: String, default: 'USD' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    tags: [{ type: String }],
    notes: { type: String },
    date: { type: Date, required: true, index: true },
    isFavorite: { type: Boolean, default: false },
    receiptUrl: { type: String },
    source: { type: String, enum: ['manual', 'recurring', 'import'], default: 'manual' },
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
