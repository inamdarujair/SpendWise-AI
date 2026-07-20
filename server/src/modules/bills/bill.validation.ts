import { z } from 'zod';

// allow standard ISO 8601 or YYYY-MM-DD string
const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date string',
});

export const createBillSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    amountMinorUnits: z.number().int().positive(),
    dueDate: dateSchema,
    recurrence: z.enum(['none', 'monthly', 'yearly', 'weekly', 'one-time']).optional(),
    category: z.string().optional(),
    paid: z.boolean().optional(),
    reminderLeadDays: z.number().int().min(0).optional(),
  }),
});

export const updateBillSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    amountMinorUnits: z.number().int().positive().optional(),
    dueDate: dateSchema.optional(),
    recurrence: z.enum(['none', 'monthly', 'yearly', 'weekly', 'one-time']).optional(),
    category: z.string().optional(),
    paid: z.boolean().optional(),
    reminderLeadDays: z.number().int().min(0).optional(),
  }),
});
