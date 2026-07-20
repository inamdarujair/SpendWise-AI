"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
exports.createBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        scope: zod_1.z.enum(['monthly', 'yearly']),
        categoryId: zod_1.z.string().optional().nullable(),
        limitMinorUnits: zod_1.z.number().int().positive('Limit must be positive'),
        period: zod_1.z.string(),
        rollover: zod_1.z.boolean().optional(),
    }),
});
exports.updateBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        limitMinorUnits: zod_1.z.number().int().positive().optional(),
        rollover: zod_1.z.boolean().optional(),
    }),
});
