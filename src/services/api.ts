import { API_BASE_URL } from '@/constants';
import { Message, User } from '@/types';

export class ApiService {
  
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getMessages(): Promise<Message[]> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/messages`);
      const data = await response.json();
      
      return data.map((msg: any) => ({
        text: msg.content,
        sender: msg.sender,
        sender_id: Number(msg.sender_id),
        sent_at: msg.sent_at,
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  async getConversationMessages(chatId: number): Promise<Message[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/conversations/conversation/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation messages');
      }
      
      const data = await response.json();
      return data.map((msg: any) => ({
        id: msg.id?.toString(),
        text: msg.content,
        sender: msg.sender,
        sender_id: Number(msg.sender_id),
        chat_id: Number(msg.chat_id),
        sent_at: msg.sent_at,
      }));
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error);
      throw error;
    }
  }

  async getConversations(): Promise<any[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/conversations/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }
  }

  async createPrivateChat(userOneId: number, userTwoId: number): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/conversations/create_private_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_one_id: userOneId,
          user_two_id: userTwoId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create private chat');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create private chat:', error);
      throw error;
    }
  }

  async sendMessage(receiverId: number, content: string, chatId: number): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseUrl}/conversations/send_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          content: content,
          chat_id: chatId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData: { username: string; email: string; password: string }) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
