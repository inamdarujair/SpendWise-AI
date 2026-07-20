"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const seed_1 = require("./seed");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const run = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';
    await mongoose_1.default.connect(mongoUri);
    console.log('Connected to MongoDB, running seed...');
    await (0, seed_1.seedDatabase)();
    await mongoose_1.default.disconnect();
    console.log('Done!');
    process.exit(0);
};
run().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
