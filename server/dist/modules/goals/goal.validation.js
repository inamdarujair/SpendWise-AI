"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoalSchema = exports.createGoalSchema = void 0;
const zod_1 = require("zod");
const dateSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
});
exports.createGoalSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        targetAmountMinorUnits: zod_1.z.number().int().positive('Target must be positive'),
        currentAmountMinorUnits: zod_1.z.number().int().min(0).optional(),
        deadline: dateSchema.optional(),
        color: zod_1.z.string().optional(),
        milestones: zod_1.z.array(zod_1.z.object({
            amountMinorUnits: zod_1.z.number().int().positive(),
        })).optional(),
    }),
});
exports.updateGoalSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        targetAmountMinorUnits: zod_1.z.number().int().positive().optional(),
        currentAmountMinorUnits: zod_1.z.number().int().min(0).optional(),
        deadline: dateSchema.optional(),
        color: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'completed', 'abandoned']).optional(),
    }),
});
