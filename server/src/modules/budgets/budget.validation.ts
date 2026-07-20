import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    scope: z.enum(['monthly', 'yearly']),
    categoryId: z.string().optional().nullable(),
    limitMinorUnits: z.number().int().positive('Limit must be positive'),
    period: z.string(),
    rollover: z.boolean().optional(),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    limitMinorUnits: z.number().int().positive().optional(),
    rollover: z.boolean().optional(),
  }),
});
