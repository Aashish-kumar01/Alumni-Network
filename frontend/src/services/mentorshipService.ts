import api from '../lib/axios';
import { PageResponse, MentorshipRequest } from '../types';

export const mentorshipService = {
  sendRequest: (data: { mentorId: number; message?: string; goals?: string; preferredSchedule?: string }) =>
    api.post<MentorshipRequest>('/mentorship/request', data).then(r => r.data),

  getMyRequests: (type: 'sent' | 'received' = 'sent', page = 0) =>
    api.get<PageResponse<MentorshipRequest>>('/mentorship', { params: { type, page } }).then(r => r.data),

  updateStatus: (id: number, status: string) =>
    api.patch<MentorshipRequest>(`/mentorship/${id}/status`, null, { params: { status } }).then(r => r.data),

  addReview: (id: number, data: { rating: number; comment?: string }) =>
    api.post(`/mentorship/${id}/review`, data).then(r => r.data),
};
