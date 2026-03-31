import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/constants';

export class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  connectWithAuth(userId: string, token: string): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: {
          userId,
          token
        }
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
