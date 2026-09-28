import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Briefcase, HandshakeIcon, Calendar, MessageSquare, Gift } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';

const typeIcons: Record<string, any> = {
  MENTORSHIP_REQUEST: HandshakeIcon,
  JOB_APPLICATION: Briefcase,
  EVENT_REMINDER: Calendar,
  NEW_MESSAGE: MessageSquare,
  REFERRAL_UPDATE: Gift,
};

const typeColors: Record<string, string> = {
  MENTORSHIP_REQUEST: '#6366f1',
  JOB_APPLICATION: '#06b6d4',
  EVENT_REMINDER: '#a855f7',
  NEW_MESSAGE: '#22d3ee',
  REFERRAL_UPDATE: '#c084fc',
};

export default function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
            <span className="gradient-text">Notifications</span>
            {unreadCount > 0 && (
              <span style={{ marginLeft: '0.75rem', background: '#6366f1', color: 'white', fontSize: '0.875rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 600 }}>
                {unreadCount}
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Stay updated with your network activity</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllMutation.mutate()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 80, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(notifications || []).map(n => {
            const Icon = typeIcons[n.type] || Bell;
            const color = typeColors[n.type] || '#6366f1';
            return (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => !n.isRead && markReadMutation.mutate(n.id)}
                className="glass"
                style={{ padding: '1.25rem', borderRadius: '0.875rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: !n.isRead ? 'pointer' : 'default',
                  borderLeft: !n.isRead ? `3px solid ${color}` : '3px solid transparent', opacity: n.isRead ? 0.7 : 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{n.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginTop: '0.4rem' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: '0.5rem' }} />}
              </motion.div>
            );
          })}

          {!notifications?.length && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No notifications yet. Check back after some activity!</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
