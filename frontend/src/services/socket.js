import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.roomId = null;
    this.userId = null;
  }

  connect() {
    if (!this.socket) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      // If served through Vite proxy, connect to same origin, otherwise use env
      const url = import.meta.env.VITE_SOCKET_URL || origin;
      this.socket = io(url, {
        path: '/socket.io',
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.roomId = null;
      this.userId = null;
    }
  }

  joinRoom(roomId, userId) {
    this.roomId = roomId;
    this.userId = userId;
    
    if (this.socket) {
      this.socket.emit('join-room', roomId, userId);
    }
  }

  leaveRoom() {
    // socket.io-client does not support client-side leave().
    // To exit rooms without server support, disconnect the socket.
    if (this.socket) {
      this.disconnect();
    }
  }

  // Document events
  onDocumentLoad(callback) {
    if (this.socket) {
      this.socket.on('document-load', callback);
    }
  }

  onTextChange(callback) {
    if (this.socket) {
      this.socket.on('text-change', callback);
    }
  }

  emitTextChange(content) {
    if (this.socket && this.roomId && this.userId) {
      this.socket.emit('text-change', {
        roomId: this.roomId,
        content,
        userId: this.userId
      });
    }
  }

  // Cursor events
  onCursorPosition(callback) {
    if (this.socket) {
      this.socket.on('cursor-position', callback);
    }
  }

  emitCursorPosition(position) {
    if (this.socket && this.roomId && this.userId) {
      this.socket.emit('cursor-position', {
        roomId: this.roomId,
        userId: this.userId,
        position
      });
    }
  }

  // User events
  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  // Chat events
  onChatMessage(callback) {
    if (this.socket) {
      this.socket.on('chat-message', callback);
    }
  }

  offChatMessage(callback) {
    if (this.socket) {
      this.socket.off('chat-message', callback);
    }
  }

  emitChatMessage({ roomId, userId, text, ts }) {
    if (this.socket) {
      this.socket.emit('chat-message', { roomId, userId, text, ts });
    }
  }

  // Remove event listeners
  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;
