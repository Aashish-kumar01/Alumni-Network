import api from '../lib/axios';
import { Notification } from '../types';

export const notificationService = {
  getNotifications: (page = 0) =>
    api.get<Notification[]>('/notifications', { params: { page } }).then(r => r.data),

  getUnreadCount: () =>
    api.get<{ count: number }>('/notifications/unread-count').then(r => r.data.count),

  markAsRead: (id: number) =>
    api.patch(`/notifications/${id}/read`).then(r => r.data),

  markAllAsRead: () =>
    api.patch('/notifications/read-all').then(r => r.data),
};
