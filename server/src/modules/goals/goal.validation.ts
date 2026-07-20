import { z } from 'zod';

const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date string',
});

export const createGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    targetAmountMinorUnits: z.number().int().positive('Target must be positive'),
    currentAmountMinorUnits: z.number().int().min(0).optional(),
    deadline: dateSchema.optional(),
    color: z.string().optional(),
    milestones: z.array(
      z.object({
        amountMinorUnits: z.number().int().positive(),
      })
    ).optional(),
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    targetAmountMinorUnits: z.number().int().positive().optional(),
    currentAmountMinorUnits: z.number().int().min(0).optional(),
    deadline: dateSchema.optional(),
    color: z.string().optional(),
    status: z.enum(['active', 'completed', 'abandoned']).optional(),
  }),
});
