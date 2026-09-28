import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Plus, DollarSign } from 'lucide-react';
import { donationService } from '../services/donationService';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', margin: '0.75rem 0' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }} transition={{ duration: 1, ease: 'easeOut' }}
        style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
    </div>
  );
}

function CampaignCard({ campaign }: any) {
  const [showDonate, setShowDonate] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const donateMutation = useMutation({
    mutationFn: () => donationService.donate(campaign.id, { amount: parseFloat(amount), message }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['campaigns'] }); setShowDonate(false); setAmount(''); setMessage(''); },
  });

  const daysLeft = campaign.endDate
    ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <motion.div whileHover={{ y: -4 }} className="glass card-hover" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
      <div className="gradient-bg" style={{ height: 4 }} />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{campaign.title}</h3>
          {daysLeft !== null && <span className={`badge ${daysLeft > 0 ? 'badge-cyan' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>{daysLeft > 0 ? `${daysLeft}d left` : 'Ended'}</span>}
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '1rem' }}>
          {campaign.description}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={13} color="#4ade80" />
            <span style={{ color: '#4ade80', fontWeight: 700 }}>₹{Number(campaign.raisedAmount).toLocaleString()}</span>
            raised
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Target size={13} /> ₹{Number(campaign.goalAmount).toLocaleString()} goal
          </span>
        </div>

        <ProgressBar percent={campaign.progressPercent} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={12} /> {campaign.donorCount} donors</span>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>{campaign.progressPercent.toFixed(0)}% funded</span>
        </div>

        {campaign.active && (
          <button onClick={() => setShowDonate(!showDonate)} className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <Heart size={15} /> {showDonate ? 'Cancel' : 'Donate Now'}
          </button>
        )}

        {showDonate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Amount (₹) *</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {[500, 1000, 5000, 10000].map(a => (
                  <button key={a} onClick={() => setAmount(a.toString())} className={amount === a.toString() ? 'btn-primary' : 'btn-secondary'} style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem' }}>
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input type="number" className="input" placeholder="Custom amount..." value={amount} onChange={e => setAmount(e.target.value)} min="1" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Message (optional)</label>
              <input className="input" placeholder="Leave an encouraging message..." value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <button onClick={() => donateMutation.mutate()} className="btn-primary" disabled={!amount || donateMutation.isPending}>
              {donateMutation.isPending ? 'Processing...' : `Donate ₹${amount || '0'}`}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Donations() {
  const { data, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => donationService.getCampaigns(),
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          <span className="gradient-text">Donation</span> Campaigns
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Give back to the community that shaped your career</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {Array(3).fill(0).map((_, i) => <div key={i} style={{ height: 280, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {data?.content.map(c => <CampaignCard key={c.id} campaign={c} />)}
          {!data?.content.length && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Heart size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No active campaigns. Check back soon!</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
