"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBillSchema = exports.createBillSchema = void 0;
const zod_1 = require("zod");
// allow standard ISO 8601 or YYYY-MM-DD string
const dateSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
});
exports.createBillSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1),
        amountMinorUnits: zod_1.z.number().int().positive(),
        dueDate: dateSchema,
        recurrence: zod_1.z.enum(['none', 'monthly', 'yearly', 'weekly', 'one-time']).optional(),
        category: zod_1.z.string().optional(),
        paid: zod_1.z.boolean().optional(),
        reminderLeadDays: zod_1.z.number().int().min(0).optional(),
    }),
});
exports.updateBillSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        amountMinorUnits: zod_1.z.number().int().positive().optional(),
        dueDate: dateSchema.optional(),
        recurrence: zod_1.z.enum(['none', 'monthly', 'yearly', 'weekly', 'one-time']).optional(),
        category: zod_1.z.string().optional(),
        paid: zod_1.z.boolean().optional(),
        reminderLeadDays: zod_1.z.number().int().min(0).optional(),
    }),
});
