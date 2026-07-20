"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        parentCategoryId: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        type: zod_1.z.enum(['income', 'expense']),
    }),
});
exports.updateCategorySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).optional(),
        parentCategoryId: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        color: zod_1.z.string().optional(),
        type: zod_1.z.enum(['income', 'expense']).optional(),
    }),
});
