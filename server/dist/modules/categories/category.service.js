"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const category_model_1 = require("./category.model");
class CategoryService {
    static async getCategories(userId) {
        return await category_model_1.Category.find({
            $or: [{ userId }, { isSystem: true }],
        }).sort({ type: 1, name: 1 });
    }
    static async createCategory(userId, data) {
        const existing = await category_model_1.Category.findOne({ userId, name: data.name, type: data.type });
        if (existing) {
            throw new Error('Category already exists');
        }
        const category = new category_model_1.Category({ ...data, userId, isSystem: false });
        return await category.save();
    }
    static async updateCategory(userId, categoryId, data) {
        const category = await category_model_1.Category.findOneAndUpdate({ _id: categoryId, userId, isSystem: false }, { $set: data }, { new: true });
        if (!category)
            throw new Error('Category not found or cannot be modified');
        return category;
    }
    static async deleteCategory(userId, categoryId) {
        const category = await category_model_1.Category.findOneAndDelete({ _id: categoryId, userId, isSystem: false });
        if (!category)
            throw new Error('Category not found or cannot be modified');
        return category;
    }
}
exports.CategoryService = CategoryService;
