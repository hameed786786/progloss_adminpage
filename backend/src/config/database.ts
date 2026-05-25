import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env';

let connectPromise: Promise<typeof mongoose> | undefined;

export function configureDnsForAtlas(url: string) {
  if (!url.startsWith('mongodb+srv://')) return;

  const servers = env.DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(servers && servers.length > 0 ? servers : ['1.1.1.1', '8.8.8.8']);
}

export async function connect() {
  const url = env.MONGO_URL;
  configureDnsForAtlas(url);
  mongoose.set('strictQuery', false);
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectPromise) {
    connectPromise = mongoose.connect(url);
  }
  await connectPromise;
  return mongoose;
}

export default mongoose;