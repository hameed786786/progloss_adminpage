let socket: any = null;

const DEFAULT_SOCKET_URL = 'https://progloss-adminpage-xg48.onrender.com';

export async function getSocket() {
  if (socket) return socket;
  const mod = await import('socket.io-client');
  const url = (import.meta.env.VITE_API_URL ?? DEFAULT_SOCKET_URL).replace(/\/$/, '');
  socket = mod.io(url, { transports: ['websocket'] });
  return socket;
}

export function getSocketSync() {
  return socket;
}

export default getSocket;
