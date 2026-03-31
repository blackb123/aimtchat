export const API_BASE_URL = 'http://localhost:8000';
export const SOCKET_URL = 'http://localhost:8000';
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
} as const;

export const SOCKET_EVENTS = {
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
} as const;
