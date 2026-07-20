import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmountMinorUnits: number;
  currentAmountMinorUnits: number;
  deadline?: Date;
  color?: string;
  icon?: string;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    targetAmountMinorUnits: { type: Number, required: true },
    currentAmountMinorUnits: { type: Number, default: 0 },
    deadline: { type: Date },
    color: { type: String, default: '#22c55e' },
    icon: { type: String, default: 'target' },
    status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>('Goal', GoalSchema);
