"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const category_routes_1 = __importDefault(require("./modules/categories/category.routes"));
const transaction_routes_1 = __importDefault(require("./modules/transactions/transaction.routes"));
const budget_routes_1 = __importDefault(require("./modules/budgets/budget.routes"));
const goal_routes_1 = __importDefault(require("./modules/goals/goal.routes"));
const recurring_routes_1 = __importDefault(require("./modules/recurring/recurring.routes"));
const bill_routes_1 = __importDefault(require("./modules/bills/bill.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/reports.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
// Middleware
app.use((0, helmet_1.default)());
app.use(limiter);
app.use((0, cors_1.default)({
    origin: env_1.env.NODE_ENV === 'production' ? env_1.env.CLIENT_URL : true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/categories', category_routes_1.default);
app.use('/api/v1/transactions', transaction_routes_1.default);
app.use('/api/v1/budgets', budget_routes_1.default);
app.use('/api/v1/goals', goal_routes_1.default);
app.use('/api/v1/recurring-rules', recurring_routes_1.default);
app.use('/api/v1/bills', bill_routes_1.default);
app.use('/api/v1/analytics', analytics_routes_1.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/reports', reports_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.get('/api/v1/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});
// Start Server
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(Number(env_1.env.PORT), () => {
        console.log(`Server listening on port ${env_1.env.PORT}`);
    });
};
startServer();
