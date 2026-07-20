import { Category, ICategory } from './category.model';

export class CategoryService {
  static async getCategories(userId: string) {
    return await Category.find({
      $or: [{ userId }, { isSystem: true }],
    }).sort({ type: 1, name: 1 });
  }

  static async createCategory(userId: string, data: Partial<ICategory>) {
    const existing = await Category.findOne({ userId, name: data.name, type: data.type });
    if (existing) {
      throw new Error('Category already exists');
    }
    const category = new Category({ ...data, userId, isSystem: false });
    return await category.save();
  }

  static async updateCategory(userId: string, categoryId: string, data: Partial<ICategory>) {
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, userId, isSystem: false },
      { $set: data },
      { new: true }
    );
    if (!category) throw new Error('Category not found or cannot be modified');
    return category;
  }

  static async deleteCategory(userId: string, categoryId: string) {
    const category = await Category.findOneAndDelete({ _id: categoryId, userId, isSystem: false });
    if (!category) throw new Error('Category not found or cannot be modified');
    return category;
  }
}
