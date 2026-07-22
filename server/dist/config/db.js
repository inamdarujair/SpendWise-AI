"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const seed_1 = require("../utils/seed");
const connectDB = async () => {
    const uri = process.env.MONGO_URI || env_1.env.MONGO_URI;
    if (!uri) {
        console.error('FATAL ERROR: MONGO_URI is missing in environment variables.');
        process.exit(1);
    }
    try {
        console.log(`Connecting to MongoDB...`);
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`MongoDB Connected: ${mongoose_1.default.connection.host}`);
        await (0, seed_1.seedDatabase)();
    }
    catch (error) {
        console.error('FATAL ERROR: Failed to connect to MongoDB.', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
