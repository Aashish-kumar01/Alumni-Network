import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, HandshakeIcon, ArrowRight, Star, Bell, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { eventService } from '../services/eventService';
import { analyticsService } from '../services/analyticsService';

function StatCard({ icon: Icon, label, value, color, link }: any) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass card-hover" style={{ padding: '1.5rem', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 1rem 0 80px', background: `${color}15` }} />
      <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{label}</div>
      {link && (
        <Link to={link} style={{ position: 'absolute', bottom: '1rem', right: '1rem', color, fontSize: '0.75rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          View <ArrowRight size={12} />
        </Link>
      )}
    </motion.div>
  );
}

function UserCard({ user }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass" style={{ padding: '1rem', borderRadius: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {user.profilePhotoUrl
          ? <img src={user.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          : <span style={{ color: 'white', fontWeight: 700 }}>{user.fullName?.[0]}</span>
        }
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user.jobTitle || user.department} {user.company ? `@ ${user.company}` : ''}</div>
      </div>
      {user.availableForMentorship && (
        <span className="badge badge-green" style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '0.65rem' }}>Mentor</span>
      )}
    </motion.div>
  );
}

function JobCard({ job }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{job.title}</div>
        <span className="badge badge-indigo" style={{ fontSize: '0.65rem', flexShrink: 0, marginLeft: '0.5rem' }}>{job.jobType}</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{job.company} · {job.location}</div>
      <Link to={`/jobs/${job.id}`} style={{ color: '#818cf8', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
        View <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}

function EventCard({ event }: any) {
  const date = new Date(event.startDate);
  return (
    <motion.div whileHover={{ y: -2 }} className="glass" style={{ padding: '1rem', borderRadius: '0.875rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '0.625rem', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: 'white', fontSize: '0.65rem', fontWeight: 600 }}>{date.toLocaleString('default', { month: 'short' })}</span>
        <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800 }}>{date.getDate()}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{event.location} · {event.attendeeCount} attending</div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data: alumni } = useQuery({ queryKey: ['suggestedAlumni'], queryFn: userService.getSuggestedAlumni, enabled: !isAdmin });
  const { data: mentors } = useQuery({ queryKey: ['suggestedMentors'], queryFn: userService.getSuggestedMentors, enabled: !isAdmin });
  const { data: jobs } = useQuery({ queryKey: ['recentJobs'], queryFn: () => jobService.getJobs({ size: 4 }), enabled: !isAdmin });
  const { data: events } = useQuery({ queryKey: ['upcomingEvents'], queryFn: () => eventService.getEvents({ upcoming: true, size: 4 }) });
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: analyticsService.getAnalytics, enabled: isAdmin });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          {greeting()}, <span className="gradient-text">{user?.fullName?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {isAdmin ? 'Platform overview and management' : "Here's what's happening in your network"}
        </p>
      </motion.div>

      {/* Admin Stats */}
      {isAdmin && analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} color="#6366f1" link="/admin" />
          <StatCard icon={TrendingUp} label="Alumni" value={analytics.totalAlumni} color="#a855f7" />
          <StatCard icon={Briefcase} label="Jobs Posted" value={analytics.totalJobs} color="#06b6d4" link="/jobs" />
          <StatCard icon={Calendar} label="Events" value={analytics.totalEvents} color="#22d3ee" link="/events" />
          <StatCard icon={HandshakeIcon} label="Mentorships" value={analytics.totalMentorshipRequests} color="#818cf8" />
          <StatCard icon={Star} label="Donations" value={`₹${Number(analytics.totalDonationAmount || 0).toLocaleString()}`} color="#c084fc" />
        </div>
      )}

      {/* Non-admin dashboard */}
      {!isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard icon={Users} label="Alumni Network" value="10K+" color="#6366f1" link="/alumni" />
          <StatCard icon={Briefcase} label="Open Jobs" value={jobs?.totalElements || 0} color="#06b6d4" link="/jobs" />
          <StatCard icon={Calendar} label="Upcoming Events" value={events?.totalElements || 0} color="#a855f7" link="/events" />
          <StatCard icon={HandshakeIcon} label="Mentors Available" value={mentors?.length || 0} color="#22d3ee" link="/mentorship" />
        </div>
      )}

      {/* Content grid */}
      {!isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Suggested Alumni / Mentors */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>
                {user?.role === 'STUDENT' ? 'Suggested Mentors' : 'Your Network'}
              </h2>
              <Link to="/alumni" style={{ color: '#818cf8', fontSize: '0.75rem', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(mentors || alumni || []).slice(0, 5).map((u: any) => <UserCard key={u.id} user={u} />)}
              {(!mentors && !alumni) && Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ height: 60, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Jobs</h2>
              <Link to="/jobs" style={{ color: '#818cf8', fontSize: '0.75rem', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(jobs?.content || []).map((j: any) => <JobCard key={j.id} job={j} />)}
              {!jobs && Array(3).fill(0).map((_, i) => (
                <div key={i} style={{ height: 80, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Upcoming Events</h2>
              <Link to="/events" style={{ color: '#818cf8', fontSize: '0.75rem', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(events?.content || []).map((e: any) => <EventCard key={e.id} event={e} />)}
              {!events && Array(3).fill(0).map((_, i) => (
                <div key={i} style={{ height: 68, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
