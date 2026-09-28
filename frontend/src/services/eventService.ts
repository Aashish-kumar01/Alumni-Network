import api from '../lib/axios';
import { PageResponse, Event } from '../types';

export const eventService = {
  getEvents: (params?: { search?: string; upcoming?: boolean; page?: number; size?: number }) =>
    api.get<PageResponse<Event>>('/events', { params }).then(r => r.data),

  getEventById: (id: number) =>
    api.get<Event>(`/events/${id}`).then(r => r.data),

  createEvent: (data: any) =>
    api.post<Event>('/events', data).then(r => r.data),

  rsvp: (id: number, status?: string) =>
    api.post<Event>(`/events/${id}/rsvp`, { status: status || 'GOING' }).then(r => r.data),
};
