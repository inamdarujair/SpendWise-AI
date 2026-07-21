import mongoose from 'mongoose';
import { env } from './env';
import { seedDatabase } from '../utils/seed';

let mongoServer: any;

export const connectDB = async () => {
  const isProduction = env.NODE_ENV === 'production';

  if (isProduction || env.MONGO_URI.includes('mongodb+srv')) {
    // Production or Atlas URI: connect ONLY to Atlas via MONGO_URI, no fallback
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Atlas Connected: ${mongoose.connection.host}`);

    // Seed demo data if it doesn't already exist
    await seedDatabase();
  } else {
    // Development: try local MongoDB, fall back to in-memory server
    try {
      await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
      console.log('Local MongoDB not found. Starting in-memory database automatically...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`MongoDB Memory Server Connected: ${uri}`);

      // Seed the database automatically since it's an ephemeral memory instance
      await seedDatabase();
    }
  }
};
