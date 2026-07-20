"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
class CategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await category_service_1.CategoryService.getCategories(req.user.userId);
            res.json(categories);
        }
        catch (error) {
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async createCategory(req, res) {
        try {
            const category = await category_service_1.CategoryService.createCategory(req.user.userId, req.body);
            res.status(201).json(category);
        }
        catch (error) {
            if (error.message === 'Category already exists') {
                res.status(409).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async updateCategory(req, res) {
        try {
            const category = await category_service_1.CategoryService.updateCategory(req.user.userId, req.params.id, req.body);
            res.json(category);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    static async deleteCategory(req, res) {
        try {
            await category_service_1.CategoryService.deleteCategory(req.user.userId, req.params.id);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
exports.CategoryController = CategoryController;
