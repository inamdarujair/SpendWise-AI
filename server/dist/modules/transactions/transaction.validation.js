"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
const dateSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
});
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['income', 'expense']),
        amountMinorUnits: zod_1.z.number().int().positive('Amount must be positive'),
        currency: zod_1.z.string().optional(),
        categoryId: zod_1.z.string(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        notes: zod_1.z.string().optional(),
        date: dateSchema,
        isFavorite: zod_1.z.boolean().optional(),
        source: zod_1.z.enum(['manual', 'recurring', 'import']).optional(),
    }),
});
exports.updateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum(['income', 'expense']).optional(),
        amountMinorUnits: zod_1.z.number().int().positive().optional(),
        currency: zod_1.z.string().optional(),
        categoryId: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        notes: zod_1.z.string().optional(),
        date: dateSchema.optional(),
        isFavorite: zod_1.z.boolean().optional(),
        status: zod_1.z.enum(['completed', 'pending']).optional(),
    }),
});
