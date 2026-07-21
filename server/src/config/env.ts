import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Diagnostic logging for deployment debugging
console.log('--- Environment Diagnostics ---');
console.log('NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('CLIENT_URL:', process.env.CLIENT_URL || '(not set)');
console.log('-------------------------------');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().default('mongodb://localhost:27017/spendwise'),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  OPENROUTER_API_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
