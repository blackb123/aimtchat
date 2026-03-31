export interface User {
  id: number;
  username: string;
  email?: string;
  token?: string;
  status?: 'online' | 'away' | 'offline';
}

export interface Message {
  id?: string;
  chat_id?: number;
  text: string;
  sender: string;
  sender_id: number;
  sent_at?: string;
  tempId?: string;
  is_read?: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  chat_id: number;
}

export interface ChatListItem {
  id: number;
  name: string;
  message?: string;
  time?: string;
  avatar: string;
  chat_id?: number;
  isConversation: boolean; // true = existing conversation, false = new user to chat with
}

export interface AuthResponse {
  token: string;
  user_id: string;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface SocketMessage {
  id?: number;
  content: string;
  user_name?: string;
  user_id?: string;
  receiver_id?: number;
  chat_id: number;
  sent_at?: string;
  tempId?: string;
}

export interface AuthPageProps {
  onLogin: (token: string, userId: string, username: string) => void;
}

export interface ChatPageProps {
  onLogout?: () => void;
}

export interface LoginComponentProps {
  isopen: string;
  setIsOpen: (value: "signup" | "login") => void;
  onLogin: (token: string, userId: string, username: string) => void;
}

export interface SignupComponentProps {
  isopen: string;
  setIsOpen: (value: "signup" | "login") => void;
}
