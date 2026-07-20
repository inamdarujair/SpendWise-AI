import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId | null; // null for system defaults
  name: string;
  parentCategoryId?: mongoose.Types.ObjectId;
  icon?: string;
  color?: string;
  isSystem: boolean;
  type: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    parentCategoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    icon: { type: String },
    color: { type: String },
    isSystem: { type: Boolean, default: false },
    type: { type: String, enum: ['income', 'expense'], required: true },
  },
  { timestamps: true }
);

CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true, sparse: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
