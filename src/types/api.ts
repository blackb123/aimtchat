import { ChatListItem } from './index';

export interface ChatListResponse {
  conversations: ChatListItem[];
  users: ChatListItem[];
}
