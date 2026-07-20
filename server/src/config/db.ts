import mongoose from 'mongoose';
import { env } from './env';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { seedDatabase } from '../utils/seed';

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    // Attempt connecting to the user's local database first
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not found. Starting in-memory database automatically...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB Memory Server Connected: ${uri}`);
    
    // Seed the database automatically since it's an ephemeral memory instance
    await seedDatabase();
  }
};
