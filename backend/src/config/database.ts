import mongoose from 'mongoose';
import { env } from './env';

let connectPromise: Promise<typeof mongoose> | undefined;

export async function connect() {
  const url = env.MONGO_URL;
  mongoose.set('strictQuery', false);
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectPromise) {
    connectPromise = mongoose.connect(url);
  }
  await connectPromise;
  return mongoose;
}

export default mongoose;