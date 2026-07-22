import mongoose from 'mongoose';
import { env } from './env';
import { seedDatabase } from '../utils/seed';

const isLocalUri = (uri: string) => {
  return uri.includes('localhost') || uri.includes('127.0.0.1');
};

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || env.MONGO_URI;

  if (env.NODE_ENV === 'production') {
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: process.env.MONGO_URI is missing in production environment variables.');
      process.exit(1);
    }
    if (isLocalUri(process.env.MONGO_URI)) {
      console.error('FATAL ERROR: Local MongoDB URI detected in production. Must use MongoDB Atlas.');
      process.exit(1);
    }

    try {
      console.log('Connecting to remote MongoDB Atlas...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      await seedDatabase();
      return;
    } catch (error) {
      console.error('FATAL ERROR: Failed to connect to MongoDB Atlas.', error);
      process.exit(1);
    }
  }

  // If the URI points to a remote database (Atlas, Render, etc.), connect directly — NO fallback
  if (!isLocalUri(uri)) {
    console.log('Connecting to remote MongoDB...');
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      await seedDatabase();
      return;
    } catch (error) {
      console.error('FATAL ERROR: Failed to connect to remote MongoDB.', error);
      process.exit(1);
    }
  }

  // Local development: try local MongoDB, fall back to in-memory server
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.log('Local MongoDB not found. Starting in-memory database automatically...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();
    await mongoose.connect(memUri);
    console.log(`MongoDB Memory Server Connected: ${memUri}`);
    await seedDatabase();
  }
};
