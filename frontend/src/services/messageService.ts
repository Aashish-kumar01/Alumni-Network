import api from '../lib/axios';
import { Conversation, Message } from '../types';

export const messageService = {
  getConversations: () => api.get<Conversation[]>('/messages/conversations').then(r => r.data),

  getMessages: (conversationId: number, page = 0) =>
    api.get<Message[]>(`/messages/conversations/${conversationId}`, { params: { page } }).then(r => r.data),

  sendMessage: (recipientId: number, content: string) =>
    api.post<Message>('/messages/send', { recipientId, content }).then(r => r.data),
};
