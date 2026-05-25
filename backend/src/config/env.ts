import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  MONGO_URL: z.string().default('mongodb://localhost:27017/progloss'),
  DNS_SERVERS: z.string().optional(),
  JWT_SECRET: z.string().min(10).default('dev-secret-change-me'),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_DAYS: z.string().default('30'),
  RATE_LIMIT_WINDOW_MS: z.string().default(String(15 * 60 * 1000)),
  RATE_LIMIT_MAX: z.string().default('100')
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
  console.error('Invalid environment variables', result.error.format());
  process.exit(1);
}

export const env = result.data;
