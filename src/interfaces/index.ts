export interface IClient {
  id: string;
  socketId: string;
  name: string;
}

export interface IMessage {
  id: string;
  text: string;
  clientId: string;
  timestamp: string;
  isFromAgent: boolean;
}

export interface IConversation {
  clientId: string;
  messages: IMessage[];
  unread: number;
}
