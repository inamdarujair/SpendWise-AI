"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../modules/users/user.model");
const category_model_1 = require("../modules/categories/category.model");
const transaction_model_1 = require("../modules/transactions/transaction.model");
const budget_model_1 = require("../modules/budgets/budget.model");
const goal_model_1 = require("../modules/goals/goal.model");
const bill_model_1 = require("../modules/bills/bill.model");
const date_fns_1 = require("date-fns");
const seedDatabase = async () => {
    try {
        console.log('Seeding data...');
        await user_model_1.User.deleteMany();
        await category_model_1.Category.deleteMany();
        await transaction_model_1.Transaction.deleteMany();
        await budget_model_1.Budget.deleteMany();
        await goal_model_1.Goal.deleteMany();
        await bill_model_1.Bill.deleteMany();
        const passwordHash = await bcrypt_1.default.hash('password123', 10);
        const demoUser = await user_model_1.User.create({
            name: 'Organized Aisha',
            email: 'demo@spendwise.ai',
            passwordHash,
            role: 'user',
            currency: 'USD',
        });
        await user_model_1.User.create({
            name: 'Admin User',
            email: 'admin@spendwise.ai',
            passwordHash,
            role: 'admin',
            currency: 'USD',
        });
        // --- Income Categories ---
        const salaryCat = await category_model_1.Category.create({ name: 'Salary', type: 'income', isSystem: true, icon: 'briefcase', color: '#22c55e' });
        const freelanceCat = await category_model_1.Category.create({ name: 'Freelancing', type: 'income', isSystem: true, icon: 'laptop', color: '#10b981' });
        const businessCat = await category_model_1.Category.create({ name: 'Business', type: 'income', isSystem: true, icon: 'building', color: '#059669' });
        const investCat = await category_model_1.Category.create({ name: 'Investments', type: 'income', isSystem: true, icon: 'trending-up', color: '#16a34a' });
        const bonusCat = await category_model_1.Category.create({ name: 'Bonus', type: 'income', isSystem: true, icon: 'gift', color: '#4ade80' });
        const giftsCat = await category_model_1.Category.create({ name: 'Gifts', type: 'income', isSystem: true, icon: 'heart', color: '#86efac' });
        const refundCat = await category_model_1.Category.create({ name: 'Refund', type: 'income', isSystem: true, icon: 'refresh-cw', color: '#bbf7d0' });
        const otherIncCat = await category_model_1.Category.create({ name: 'Other Income', type: 'income', isSystem: true, icon: 'plus-circle', color: '#dcfce7' });
        // --- Expense Categories ---
        const foodCat = await category_model_1.Category.create({ name: 'Food & Dining', type: 'expense', isSystem: true, icon: 'utensils', color: '#ef4444' });
        const transportCat = await category_model_1.Category.create({ name: 'Transport', type: 'expense', isSystem: true, icon: 'car', color: '#f97316' });
        const shoppingCat = await category_model_1.Category.create({ name: 'Shopping', type: 'expense', isSystem: true, icon: 'shopping-bag', color: '#f59e0b' });
        const billsCat = await category_model_1.Category.create({ name: 'Bills', type: 'expense', isSystem: true, icon: 'zap', color: '#eab308' });
        const rentCat = await category_model_1.Category.create({ name: 'Rent', type: 'expense', isSystem: true, icon: 'home', color: '#3b82f6' });
        const educationCat = await category_model_1.Category.create({ name: 'Education', type: 'expense', isSystem: true, icon: 'book-open', color: '#8b5cf6' });
        const healthCat = await category_model_1.Category.create({ name: 'Healthcare', type: 'expense', isSystem: true, icon: 'heart-pulse', color: '#ec4899' });
        const entertainCat = await category_model_1.Category.create({ name: 'Entertainment', type: 'expense', isSystem: true, icon: 'film', color: '#14b8a6' });
        const travelCat = await category_model_1.Category.create({ name: 'Travel', type: 'expense', isSystem: true, icon: 'plane', color: '#06b6d4' });
        const emiCat = await category_model_1.Category.create({ name: 'EMI / Loans', type: 'expense', isSystem: true, icon: 'credit-card', color: '#6366f1' });
        const groceriesCat = await category_model_1.Category.create({ name: 'Groceries', type: 'expense', isSystem: true, icon: 'shopping-cart', color: '#84cc16' });
        const otherExpCat = await category_model_1.Category.create({ name: 'Others', type: 'expense', isSystem: true, icon: 'more-horizontal', color: '#94a3b8' });
        // --- Transactions across 6 months ---
        const now = new Date();
        const txs = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, i));
            txs.push({ userId: demoUser._id, type: 'income', amountMinorUnits: 500000, categoryId: salaryCat._id, date: (0, date_fns_1.addDays)(monthStart, 0), notes: 'Monthly Salary' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 150000, categoryId: rentCat._id, date: (0, date_fns_1.addDays)(monthStart, 1), notes: 'Apartment Rent' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 4500, categoryId: foodCat._id, date: (0, date_fns_1.addDays)(monthStart, 3), notes: 'Starbucks Coffee' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 18000, categoryId: groceriesCat._id, date: (0, date_fns_1.addDays)(monthStart, 4), notes: 'Weekly Groceries' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 12000, categoryId: transportCat._id, date: (0, date_fns_1.addDays)(monthStart, 5), notes: 'Monthly Metro Pass' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 9999, categoryId: entertainCat._id, date: (0, date_fns_1.addDays)(monthStart, 8), notes: 'Netflix & Spotify' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 25000, categoryId: shoppingCat._id, date: (0, date_fns_1.addDays)(monthStart, 10), notes: 'Amazon Shopping' }, { userId: demoUser._id, type: 'income', amountMinorUnits: 50000, categoryId: freelanceCat._id, date: (0, date_fns_1.addDays)(monthStart, 15), notes: 'Client Project' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 30000, categoryId: emiCat._id, date: (0, date_fns_1.addDays)(monthStart, 16), notes: 'Phone EMI' }, { userId: demoUser._id, type: 'expense', amountMinorUnits: 8000, categoryId: healthCat._id, date: (0, date_fns_1.addDays)(monthStart, 20), notes: 'Doctor Consultation' });
        }
        await transaction_model_1.Transaction.create(txs);
        // --- Budgets ---
        const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        await budget_model_1.Budget.create([
            { userId: demoUser._id, scope: 'monthly', categoryId: rentCat._id, limitMinorUnits: 160000, period },
            { userId: demoUser._id, scope: 'monthly', categoryId: foodCat._id, limitMinorUnits: 30000, period },
            { userId: demoUser._id, scope: 'monthly', categoryId: shoppingCat._id, limitMinorUnits: 20000, period },
            { userId: demoUser._id, scope: 'monthly', categoryId: entertainCat._id, limitMinorUnits: 15000, period },
            { userId: demoUser._id, scope: 'monthly', categoryId: transportCat._id, limitMinorUnits: 15000, period },
        ]);
        // --- Goals ---
        await goal_model_1.Goal.create([
            {
                userId: demoUser._id,
                name: 'Emergency Fund',
                targetAmountMinorUnits: 1000000,
                currentAmountMinorUnits: 350000,
                deadline: (0, date_fns_1.addDays)(now, 180),
                status: 'active',
                color: '#22c55e',
                icon: 'shield',
            },
            {
                userId: demoUser._id,
                name: 'New MacBook Pro',
                targetAmountMinorUnits: 250000,
                currentAmountMinorUnits: 120000,
                deadline: (0, date_fns_1.addDays)(now, 90),
                status: 'active',
                color: '#3b82f6',
                icon: 'laptop',
            },
            {
                userId: demoUser._id,
                name: 'Vacation to Bali',
                targetAmountMinorUnits: 300000,
                currentAmountMinorUnits: 300000,
                deadline: (0, date_fns_1.addDays)(now, -10),
                status: 'completed',
                color: '#f59e0b',
                icon: 'plane',
            },
        ]);
        // --- Bills ---
        await bill_model_1.Bill.create([
            { userId: demoUser._id, name: 'Electricity Bill', amountMinorUnits: 8000, dueDate: (0, date_fns_1.addDays)(now, 5), recurrence: 'monthly', paid: false, category: 'Bills' },
            { userId: demoUser._id, name: 'Internet Plan', amountMinorUnits: 5000, dueDate: (0, date_fns_1.addDays)(now, 8), recurrence: 'monthly', paid: false, category: 'Bills' },
            { userId: demoUser._id, name: 'Netflix', amountMinorUnits: 1499, dueDate: (0, date_fns_1.addDays)(now, 12), recurrence: 'monthly', paid: false, category: 'Entertainment' },
            { userId: demoUser._id, name: 'Gym Membership', amountMinorUnits: 3000, dueDate: (0, date_fns_1.addDays)(now, -3), recurrence: 'monthly', paid: true, category: 'Healthcare' },
            { userId: demoUser._id, name: 'Car Insurance', amountMinorUnits: 12000, dueDate: (0, date_fns_1.addDays)(now, 20), recurrence: 'yearly', paid: false, category: 'Transport' },
            { userId: demoUser._id, name: 'Phone EMI', amountMinorUnits: 30000, dueDate: (0, date_fns_1.addDays)(now, 16), recurrence: 'monthly', paid: false, category: 'EMI / Loans' },
        ]);
        console.log('✅ Seed completed! Login: demo@spendwise.ai / password123');
    }
    catch (error) {
        console.error('Seed Error:', error);
    }
};
exports.seedDatabase = seedDatabase;
