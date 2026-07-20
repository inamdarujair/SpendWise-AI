import { z } from 'zod';

export const createRecurringRuleSchema = z.object({
  body: z.object({
    cadence: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    nextRunDate: z.string().datetime(),
    template: z.object({
      type: z.enum(['income', 'expense']),
      amountMinorUnits: z.number().int().positive(),
      currency: z.string().optional(),
      categoryId: z.string(),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }),
  }),
});

export const updateRecurringRuleSchema = z.object({
  body: z.object({
    cadence: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    nextRunDate: z.string().datetime().optional(),
    template: z.object({
      type: z.enum(['income', 'expense']).optional(),
      amountMinorUnits: z.number().int().positive().optional(),
      currency: z.string().optional(),
      categoryId: z.string().optional(),
      tags: z.array(z.string()).optional(),
      notes: z.string().optional(),
    }).optional(),
    active: z.boolean().optional(),
  }),
});
