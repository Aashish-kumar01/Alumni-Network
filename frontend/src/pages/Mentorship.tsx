import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HandshakeIcon, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { mentorshipService } from '../services/mentorshipService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const statusColors: Record<string, string> = {
  PENDING: 'badge-yellow', ACCEPTED: 'badge-green', REJECTED: 'badge-red', COMPLETED: 'badge-indigo'
};

export default function Mentorship() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'sent' | 'received'>('sent');
  const [showRequest, setShowRequest] = useState(false);
  const [mentorId, setMentorId] = useState('');
  const [message, setMessage] = useState('');
  const [goals, setGoals] = useState('');
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['mentorship', tab],
    queryFn: () => mentorshipService.getMyRequests(tab),
  });

  const { data: mentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: userService.getSuggestedMentors,
    enabled: showRequest,
  });

  const sendMutation = useMutation({
    mutationFn: () => mentorshipService.sendRequest({ mentorId: parseInt(mentorId), message, goals }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mentorship'] }); setShowRequest(false); setMentorId(''); setMessage(''); setGoals(''); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: any) => mentorshipService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mentorship'] }),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            <span className="gradient-text">Mentorship</span> Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Connect with mentors who can guide your career journey</p>
        </div>
        {user?.role === 'STUDENT' && (
          <button onClick={() => setShowRequest(!showRequest)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HandshakeIcon size={16} /> Request Mentor
          </button>
        )}
      </div>

      {/* Request form */}
      {showRequest && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>New Mentorship Request</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Select Mentor *</label>
              <select className="input" value={mentorId} onChange={e => setMentorId(e.target.value)}>
                <option value="">Choose a mentor...</option>
                {(mentors || []).map((m: any) => (
                  <option key={m.id} value={m.id}>{m.fullName} — {m.jobTitle} @ {m.company}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Message</label>
              <textarea className="input" rows={3} placeholder="Introduce yourself and explain why you want this mentor..." value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Goals</label>
              <input className="input" placeholder="What do you hope to achieve?" value={goals} onChange={e => setGoals(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => sendMutation.mutate()} className="btn-primary" disabled={!mentorId || sendMutation.isPending}>
                {sendMutation.isPending ? 'Sending...' : 'Send Request'}
              </button>
              <button onClick={() => setShowRequest(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['sent', 'received'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, background: tab === t ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-card)', color: tab === t ? 'white' : 'var(--text-secondary)' }}>
            {t === 'sent' ? '📤 Sent Requests' : '📥 Received Requests'}
          </button>
        ))}
      </div>

      {/* Request list */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array(3).fill(0).map((_, i) => <div key={i} style={{ height: 120, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(requests?.content || []).map((req: any) => (
            <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                    {tab === 'sent' ? req.mentor?.fullName?.[0] : req.mentee?.fullName?.[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{tab === 'sent' ? req.mentor?.fullName : req.mentee?.fullName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {tab === 'sent' ? `${req.mentor?.jobTitle} @ ${req.mentor?.company}` : req.mentee?.department}
                    </div>
                  </div>
                </div>
                <span className={`badge ${statusColors[req.status] || 'badge-indigo'}`}>{req.status}</span>
              </div>

              {req.message && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{req.message}</p>}
              {req.goals && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}><strong>Goals:</strong> {req.goals}</p>}

              <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.75rem' }}>
                <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
              </div>

              {tab === 'received' && req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => updateMutation.mutate({ id: req.id, status: 'ACCEPTED' })} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button onClick={() => updateMutation.mutate({ id: req.id, status: 'REJECTED' })} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f87171' }}>
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {requests?.content.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <HandshakeIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>No mentorship requests yet.</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
