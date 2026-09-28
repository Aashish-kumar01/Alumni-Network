import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Briefcase, Calendar, HandshakeIcon, Heart, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

function StatCard({ icon: Icon, label, value, color, sublabel }: any) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '0 1rem 0 100%', background: `${color}12` }} />
      <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <Icon size={24} color={color} />
      </div>
      <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
      {sublabel && <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{sublabel}</div>}
    </motion.div>
  );
}

export default function Admin() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics,
  });

  if (isLoading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {Array(8).fill(0).map((_, i) => <div key={i} style={{ height: 150, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
      <style>{`@keyframes pulse { 0%,100%{opacity:.5}50%{opacity:1} }`}</style>
    </div>
  );

  const stats = [
    { icon: Users, label: 'Total Users', value: analytics?.totalUsers, color: '#6366f1', sublabel: 'All registered accounts' },
    { icon: TrendingUp, label: 'Alumni', value: analytics?.totalAlumni, color: '#a855f7', sublabel: 'Active alumni profiles' },
    { icon: Users, label: 'Students', value: analytics?.totalStudents, color: '#06b6d4', sublabel: 'Enrolled students' },
    { icon: Briefcase, label: 'Jobs Posted', value: analytics?.totalJobs, color: '#22d3ee', sublabel: 'Active job listings' },
    { icon: Calendar, label: 'Events', value: analytics?.totalEvents, color: '#818cf8', sublabel: 'Scheduled events' },
    { icon: HandshakeIcon, label: 'Mentorships', value: analytics?.totalMentorshipRequests, color: '#c084fc', sublabel: 'Total requests' },
    { icon: Heart, label: 'Donations', value: analytics?.totalDonations, color: '#f87171', sublabel: 'Individual donations' },
    { icon: DollarSign, label: 'Amount Raised', value: `₹${Number(analytics?.totalDonationAmount || 0).toLocaleString()}`, color: '#4ade80', sublabel: 'Total donations received' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Platform-wide analytics and management overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} color="#6366f1" /> Platform Health
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Alumni / Student Ratio', value: analytics && analytics.totalStudents > 0 ? (analytics.totalAlumni / analytics.totalStudents).toFixed(1) + 'x' : 'N/A', color: '#6366f1' },
            { label: 'Jobs per Alumni', value: analytics && analytics.totalAlumni > 0 ? (analytics.totalJobs / analytics.totalAlumni).toFixed(2) : 'N/A', color: '#06b6d4' },
            { label: 'Avg Donation Size', value: analytics && analytics.totalDonations > 0 ? `₹${(Number(analytics.totalDonationAmount) / analytics.totalDonations).toFixed(0)}` : 'N/A', color: '#4ade80' },
            { label: 'Mentorship Rate', value: analytics && analytics.totalStudents > 0 ? ((analytics.totalMentorshipRequests / analytics.totalStudents) * 100).toFixed(0) + '%' : 'N/A', color: '#a855f7' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem' }}>
              <div style={{ color, fontSize: '1.5rem', fontWeight: 800 }}>{value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
