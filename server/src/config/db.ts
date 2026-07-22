import mongoose from 'mongoose';
import { env } from './env';
import { seedDatabase } from '../utils/seed';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || env.MONGO_URI;

  if (!uri) {
    console.error('FATAL ERROR: MONGO_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    await seedDatabase();
  } catch (error) {
    console.error('FATAL ERROR: Failed to connect to MongoDB.', error);
    process.exit(1);
  }
};
