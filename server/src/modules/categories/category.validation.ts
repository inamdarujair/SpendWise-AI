import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    parentCategoryId: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    type: z.enum(['income', 'expense']),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    parentCategoryId: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    type: z.enum(['income', 'expense']).optional(),
  }),
});
