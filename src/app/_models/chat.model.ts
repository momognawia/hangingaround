export type ChatRoomType = 'group' | 'direct';
export type MessageType = 'text' | 'image' | 'audio' | 'system';

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  groupId?: string;
  members: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  senderUserId: string;
  messageType: MessageType;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  editedAt?: Date;
}
