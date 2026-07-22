"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../users/user.model");
const category_model_1 = require("../categories/category.model");
const jwt_1 = require("../../utils/jwt");
class AuthService {
    static async register(data) {
        const email = data.email.toLowerCase().trim();
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const user = new user_model_1.User({
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
        await category_model_1.Category.insertMany(defaultCategories);
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken,
        };
    }
    static async login(data) {
        const email = data.email.toLowerCase().trim();
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            console.error(`Login failed: No user found for email [${email}]`);
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isMatch) {
            console.error(`Login failed: Password mismatch for user [${email}]`);
            throw new Error('Invalid credentials');
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        return {
            user: this.sanitizeUser(user),
            accessToken,
            refreshToken,
        };
    }
    static async refresh(userId) {
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user._id.toString(), user.role);
        return {
            accessToken,
            refreshToken,
        };
    }
    static async updateProfile(userId, data) {
        const user = await user_model_1.User.findByIdAndUpdate(userId, { $set: data }, { new: true });
        if (!user)
            throw new Error('User not found');
        return this.sanitizeUser(user);
    }
    static async updatePassword(userId, current, newPass) {
        const user = await user_model_1.User.findById(userId);
        if (!user)
            throw new Error('User not found');
        const isMatch = await bcryptjs_1.default.compare(current, user.passwordHash);
        if (!isMatch)
            throw new Error('Incorrect current password');
        const salt = await bcryptjs_1.default.genSalt(10);
        user.passwordHash = await bcryptjs_1.default.hash(newPass, salt);
        await user.save();
        return true;
    }
    static sanitizeUser(user) {
        const obj = user.toObject();
        const { passwordHash, ...safeUser } = obj;
        return safeUser;
    }
}
exports.AuthService = AuthService;
