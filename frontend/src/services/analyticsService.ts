import api from '../lib/axios';
import { Analytics } from '../types';

export const analyticsService = {
  getAnalytics: () => api.get<Analytics>('/admin/analytics').then(r => r.data),
};
