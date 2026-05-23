import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

let io: any = null;

export function initSocket(server: Server) {
  io = new SocketServer(server, {
    cors: { origin: true, credentials: true }
  });

  io.on('connection', (socket: any) => {
    socket.on('ping', () => socket.emit('pong', { ok: true }));
  });

  return io;
}

export function emitRoleUpdate(payload: any) {
  io?.emit('roles:update', payload);
}

export function emitPermissionUpdate(payload: any) {
  io?.emit('roles:update', payload);
}

export function emit(channel: string, payload: any) {
  io?.emit(channel, payload);
}
