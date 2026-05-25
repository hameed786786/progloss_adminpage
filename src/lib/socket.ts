let socket: any = null;

export async function getSocket() {
  if (socket) return socket;
  const mod = await import('socket.io-client');
  const url = (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';
  socket = mod.io(url, { transports: ['websocket'] });
  return socket;
}

export function getSocketSync() {
  return socket;
}

export default getSocket;
