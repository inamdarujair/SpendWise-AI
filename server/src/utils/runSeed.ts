import mongoose from 'mongoose';
import { seedDatabase } from './seed';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB, running seed...');
  await seedDatabase();
  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
};

run().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
