import { useEffect, useRef, useState, useCallback } from 'react';
import { socketService } from '@/services/socket';
import { Message, SocketMessage } from '@/types';

interface UserStatus {
  user_id: number;
  is_online: boolean;
  username: string;
}

export const useSocket = (onMessage?: (message: Message) => void, onUserStatus?: (status: UserStatus) => void) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<any>(null);

  // 🔹 Handle incoming message (stable reference)
  const handleMessage = useCallback((msg: SocketMessage) => {
    const message: Message = {
      id: msg.id?.toString(),
      text: msg.content,
      sender: msg.user_name || 'Unknown',
      sender_id: parseInt(msg.user_id || '0'),
      chat_id: msg.chat_id,
      sent_at: msg.sent_at,
      tempId: msg.tempId,
    };

    setMessages((prev) => [...prev, message]);

    if (onMessage) {
      onMessage(message);
    }
  }, [onMessage]);

  // 🔹 Handle user status updates (stable reference)
  const handleUserStatus = useCallback((status: UserStatus) => {
    if (onUserStatus) {
      onUserStatus(status);
    }
  }, [onUserStatus]);

  // 🔹 Attach all listeners (DRY)
  const attachListeners = useCallback((socket: any) => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', handleMessage);
    socket.on('message_sent_confirm', handleMessage); // Handle sender confirmation
    socket.on('user_status', handleUserStatus);
  }, [handleMessage]);

  // 🔹 Remove listeners (clean)
  const detachListeners = useCallback((socket: any) => {
    socket.off('connect');
    socket.off('disconnect');
    socket.off('receive_message', handleMessage);
    socket.off('message_sent_confirm', handleMessage);
    socket.off('user_status', handleUserStatus);
  }, [handleMessage]);

  // 🔹 Default connection (no auth)
  useEffect(() => {
    const socket = socketService.connect();
    socketRef.current = socket;

    attachListeners(socket);

    return () => {
      if (socketRef.current) {
        detachListeners(socketRef.current);
      }
    };
  }, [attachListeners, detachListeners]);

  // 🔹 Send message
  const sendMessage = useCallback((message: SocketMessage) => {
    const socket = socketRef.current;

    if (socket && socket.connected) {
      socket.emit('send_message', message);
    }
  }, []);

  // Mark messages as read in a chat
  const markMessagesRead = useCallback((chatId: number) => {
    const socket = socketRef.current;

    if (socket && socket.connected) {
      socket.emit('mark_messages_read', { chat_id: chatId });
    }
  }, []);

  // 🔹 Disconnect manually
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      detachListeners(socketRef.current);
      socketService.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, [detachListeners]);

  // 🔹 Connect with authentication
  const connectWithAuth = useCallback((userId: string, token: string) => {
    // Clean previous socket if exists
    if (socketRef.current) {
      detachListeners(socketRef.current);
      socketService.disconnect();
    }

    const socket = socketService.connectWithAuth(userId, token);
    socketRef.current = socket;

    attachListeners(socket);
  }, [attachListeners, detachListeners]);

  return {
    messages,
    isConnected,
    sendMessage,
    markMessagesRead,
    disconnect,
    connectWithAuth,
    setMessages,
  };
};