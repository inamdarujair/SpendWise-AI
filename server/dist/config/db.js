"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const seed_1 = require("../utils/seed");
let mongoServer;
const connectDB = async () => {
    try {
        // Attempt connecting to the user's local database first
        await mongoose_1.default.connect(env_1.env.MONGO_URI, {
            serverSelectionTimeoutMS: 2000,
        });
        console.log(`MongoDB Connected: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.log('Local MongoDB not found. Starting in-memory database automatically...');
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose_1.default.connect(uri);
        console.log(`MongoDB Memory Server Connected: ${uri}`);
        // Seed the database automatically since it's an ephemeral memory instance
        await (0, seed_1.seedDatabase)();
    }
};
exports.connectDB = connectDB;
