"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecurringRuleSchema = exports.createRecurringRuleSchema = void 0;
const zod_1 = require("zod");
exports.createRecurringRuleSchema = zod_1.z.object({
    body: zod_1.z.object({
        cadence: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly']),
        nextRunDate: zod_1.z.string().datetime(),
        template: zod_1.z.object({
            type: zod_1.z.enum(['income', 'expense']),
            amountMinorUnits: zod_1.z.number().int().positive(),
            currency: zod_1.z.string().optional(),
            categoryId: zod_1.z.string(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
            notes: zod_1.z.string().optional(),
        }),
    }),
});
exports.updateRecurringRuleSchema = zod_1.z.object({
    body: zod_1.z.object({
        cadence: zod_1.z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
        nextRunDate: zod_1.z.string().datetime().optional(),
        template: zod_1.z.object({
            type: zod_1.z.enum(['income', 'expense']).optional(),
            amountMinorUnits: zod_1.z.number().int().positive().optional(),
            currency: zod_1.z.string().optional(),
            categoryId: zod_1.z.string().optional(),
            tags: zod_1.z.array(zod_1.z.string()).optional(),
            notes: zod_1.z.string().optional(),
        }).optional(),
        active: zod_1.z.boolean().optional(),
    }),
});
