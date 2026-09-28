import api from '../lib/axios';
import { DonationCampaign, PageResponse } from '../types';

export const donationService = {
  getCampaigns: (page = 0) =>
    api.get<PageResponse<DonationCampaign>>('/donations/campaigns', { params: { page } }).then(r => r.data),

  createCampaign: (data: { title: string; description: string; goalAmount: number; endDate?: string }) =>
    api.post<DonationCampaign>('/donations/campaigns', data).then(r => r.data),

  donate: (campaignId: number, data: { amount: number; message?: string; anonymous?: boolean }) =>
    api.post(`/donations/campaigns/${campaignId}/donate`, data).then(r => r.data),

  getMyDonations: (page = 0) =>
    api.get('/donations/my-donations', { params: { page } }).then(r => r.data),
};
