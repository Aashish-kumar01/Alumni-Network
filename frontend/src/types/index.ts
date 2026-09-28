// User types
export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  graduationYear?: number;
  department?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  linkedinUrl?: string;
  profilePhotoUrl?: string;
  resumeUrl?: string;
  skills?: string[];
  availableForMentorship: boolean;
  isApproved: boolean;
  createdAt: string;
  averageRating?: number;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  department?: string;
  company?: string;
  jobTitle?: string;
  profilePhotoUrl?: string;
  graduationYear?: number;
  availableForMentorship: boolean;
}

// Auth types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'ALUMNI' | 'ADMIN';
  profilePhotoUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'STUDENT' | 'ALUMNI';
  graduationYear?: number;
  department?: string;
  company?: string;
  jobTitle?: string;
  linkedinUrl?: string;
  skills?: string[];
}

// Job types
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'REMOTE' | 'CONTRACT';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requiredSkills: string[];
  jobType?: JobType;
  deadline?: string;
  active: boolean;
  postedBy: UserSummary;
  createdAt: string;
  applicationCount: number;
  alreadyApplied: boolean;
}

export interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  applicant: UserSummary;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
}

// Event types
export type EventType = 'NETWORKING' | 'WEBINAR' | 'REUNION' | 'CAREER_FAIR' | 'CONFERENCE' | 'WORKSHOP';

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  bannerUrl?: string;
  eventType?: EventType;
  startDate: string;
  endDate?: string;
  maxAttendees?: number;
  attendeeCount: number;
  published: boolean;
  organizer: UserSummary;
  createdAt: string;
  userRsvped: boolean;
}

// Mentorship types
export type MentorshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface MentorshipRequest {
  id: number;
  mentee: UserSummary;
  mentor: UserSummary;
  message?: string;
  goals?: string;
  preferredSchedule?: string;
  status: MentorshipStatus;
  scheduledAt?: string;
  createdAt: string;
}

// Message types
export interface Message {
  id: number;
  conversationId: number;
  sender: UserSummary;
  content: string;
  isRead: boolean;
  attachmentUrl?: string;
  sentAt: string;
}

export interface Conversation {
  id: number;
  otherParticipant: UserSummary;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

// Notification types
export type NotificationType = 'MENTORSHIP_REQUEST' | 'JOB_APPLICATION' | 'EVENT_REMINDER' | 'NEW_MESSAGE' | 'REFERRAL_UPDATE';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number;
  isRead: boolean;
  createdAt: string;
}

// Donation types
export interface DonationCampaign {
  id: number;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  progressPercent: number;
  imageUrl?: string;
  endDate?: string;
  active: boolean;
  createdBy: UserSummary;
  donorCount: number;
  createdAt: string;
}

// Analytics
export interface Analytics {
  totalUsers: number;
  totalAlumni: number;
  totalStudents: number;
  totalJobs: number;
  totalEvents: number;
  totalMentorshipRequests: number;
  totalDonations: number;
  totalDonationAmount: number;
}

// Common
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
