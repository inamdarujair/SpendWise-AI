import bcrypt from 'bcryptjs';
import { User, IUser } from '../users/user.model';
import { Category } from '../categories/category.model';
import { generateTokens } from '../../utils/jwt';

export class AuthService {
  static async register(data: any) {
    const email = data.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = new User({
      email,
      passwordHash,
      name: data.name,
    });

    await user.save();

    // Seed default categories
    const defaultCategories = [
      { userId: user._id, name: 'Salary', type: 'income', color: '#10B981', icon: 'Wallet' },
      { userId: user._id, name: 'Freelance', type: 'income', color: '#3B82F6', icon: 'Briefcase' },
      { userId: user._id, name: 'Investments', type: 'income', color: '#8B5CF6', icon: 'TrendingUp' },
      { userId: user._id, name: 'Housing', type: 'expense', color: '#EF4444', icon: 'Home' },
      { userId: user._id, name: 'Transport', type: 'expense', color: '#F59E0B', icon: 'Car' },
      { userId: user._id, name: 'Food', type: 'expense', color: '#F97316', icon: 'Utensils' },
      { userId: user._id, name: 'Utilities', type: 'expense', color: '#06B6D4', icon: 'Zap' },
      { userId: user._id, name: 'Healthcare', type: 'expense', color: '#EC4899', icon: 'Heart' },
      { userId: user._id, name: 'Entertainment', type: 'expense', color: '#6366F1', icon: 'Film' },
      { userId: user._id, name: 'Shopping', type: 'expense', color: '#8B5CF6', icon: 'ShoppingBag' },
      { userId: user._id, name: 'Others', type: 'expense', color: '#9CA3AF', icon: 'MoreHorizontal' },
    ];
    await Category.insertMany(defaultCategories);

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  static async login(data: any) {
    const email = data.email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`Login failed: No user found for email [${email}]`);
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      console.error(`Login failed: Password mismatch for user [${email}]`);
      throw new Error('Invalid credentials');
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  static async refresh(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async updateProfile(userId: string, data: any) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );
    if (!user) throw new Error('User not found');
    return this.sanitizeUser(user);
  }

  static async updatePassword(userId: string, current: string, newPass: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(current, user.passwordHash);
    if (!isMatch) throw new Error('Incorrect current password');

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    await user.save();
    return true;
  }

  private static sanitizeUser(user: IUser) {
    const obj = user.toObject();
    const { passwordHash, ...safeUser } = obj as any;
    return safeUser;
  }
}
