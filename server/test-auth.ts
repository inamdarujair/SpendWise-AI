import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './src/modules/users/user.model';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const email = 'demo@spendwise.ai';
  const password = 'password123';

  // 1. Find user exactly how auth.service does
  // auth.service uses: const user = await User.findOne({ email: data.email });
  const users = await User.find({ email });
  console.log(`Found ${users.length} users with email ${email}`);
  for (const user of users) {
    console.log('Stored hash:', user.passwordHash);
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('Password match?', isMatch);
  }

  await mongoose.disconnect();
};

run().catch(console.error);
