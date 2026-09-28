import api from '../lib/axios';
import { PageResponse, User, UserSummary } from '../types';

export const userService = {
  getMe: () => api.get<User>('/users/me').then(r => r.data),

  getUserById: (id: number) => api.get<User>(`/users/${id}`).then(r => r.data),

  updateProfile: (data: any) => api.put<User>('/users/me', data).then(r => r.data),

  getAlumniDirectory: (params?: {
    search?: string; department?: string;
    graduationYear?: number; company?: string;
    page?: number; size?: number;
  }) => api.get<PageResponse<User>>('/users/alumni', { params }).then(r => r.data),

  getSuggestedAlumni: () => api.get<UserSummary[]>('/users/suggestions/alumni').then(r => r.data),

  getSuggestedMentors: () => api.get<UserSummary[]>('/users/suggestions/mentors').then(r => r.data),

  uploadPhoto: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string }>('/files/upload/photo', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },

  uploadResume: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<{ url: string }>('/files/upload/resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  },
};
