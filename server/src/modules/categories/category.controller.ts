import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CategoryService } from './category.service';

export class CategoryController {
  static async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await CategoryService.getCategories(req.user!.userId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async createCategory(req: AuthRequest, res: Response) {
    try {
      const category = await CategoryService.createCategory(req.user!.userId, req.body);
      res.status(201).json(category);
    } catch (error: any) {
      if (error.message === 'Category already exists') {
        res.status(409).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async updateCategory(req: AuthRequest, res: Response) {
    try {
      const category = await CategoryService.updateCategory(req.user!.userId, req.params.id as string, req.body);
      res.json(category);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteCategory(req: AuthRequest, res: Response) {
    try {
      await CategoryService.deleteCategory(req.user!.userId, req.params.id as string);
      res.json({ message: 'Category deleted successfully' });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}
