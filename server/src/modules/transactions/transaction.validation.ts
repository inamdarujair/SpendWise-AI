import { z } from 'zod';

const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date string',
});

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(['income', 'expense']),
    amountMinorUnits: z.number().int().positive('Amount must be positive'),
    currency: z.string().optional(),
    categoryId: z.string(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
    date: dateSchema,
    isFavorite: z.boolean().optional(),
    source: z.enum(['manual', 'recurring', 'import']).optional(),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    type: z.enum(['income', 'expense']).optional(),
    amountMinorUnits: z.number().int().positive().optional(),
    currency: z.string().optional(),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
    date: dateSchema.optional(),
    isFavorite: z.boolean().optional(),
    status: z.enum(['completed', 'pending']).optional(),
  }),
});
