export type Conversation = {
  chatId: string;
  users: string[];
  lastMessage?: string;
  lastSent: number;
  senderName: string;
  avatar?: string;
};

export type Message = {
  PK: string;
  SK: string;
  data: string;
  senderId: string;
  sentAt: number;
};

export type SearchUser = {
  PK: string;
  name: string;
  email: string;
  avatar?: string;
};
