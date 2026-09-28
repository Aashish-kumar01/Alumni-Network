import api from '../lib/axios';
import { PageResponse, Job, JobApplication } from '../types';

export const jobService = {
  getJobs: (params?: { search?: string; location?: string; company?: string; page?: number; size?: number }) =>
    api.get<PageResponse<Job>>('/jobs', { params }).then(r => r.data),

  getJobById: (id: number) =>
    api.get<Job>(`/jobs/${id}`).then(r => r.data),

  createJob: (data: any) =>
    api.post<Job>('/jobs', data).then(r => r.data),

  applyForJob: (id: number, data: any) =>
    api.post<JobApplication>(`/jobs/${id}/apply`, data).then(r => r.data),

  getMyApplications: (page = 0, size = 10) =>
    api.get<PageResponse<JobApplication>>('/jobs/my-applications', { params: { page, size } }).then(r => r.data),

  getJobApplications: (jobId: number, page = 0) =>
    api.get<PageResponse<JobApplication>>(`/jobs/${jobId}/applications`, { params: { page } }).then(r => r.data),

  updateApplicationStatus: (applicationId: number, status: string) =>
    api.patch(`/jobs/applications/${applicationId}/status`, null, { params: { status } }).then(r => r.data),
};
