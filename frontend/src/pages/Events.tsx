import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, CheckCircle, Clock } from 'lucide-react';
import { eventService } from '../services/eventService';

function EventCard({ event }: any) {
  const queryClient = useQueryClient();
  const date = new Date(event.startDate);

  const rsvpMutation = useMutation({
    mutationFn: () => eventService.rsvp(event.id, 'GOING'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });

  return (
    <motion.div whileHover={{ y: -3 }} className="glass card-hover" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
      {/* Header gradient */}
      <div className="gradient-bg" style={{ height: 6 }} />
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 600 }}>{date.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
              <span style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800 }}>{date.getDate()}</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{event.title}</div>
              {event.eventType && <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{event.eventType}</span>}
            </div>
          </div>
          {event.userRsvped && (
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }}>
              <CheckCircle size={11} /> Going
            </span>
          )}
        </div>

        {event.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {event.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {event.location}</span>}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={13} /> {event.attendeeCount} attending</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {!event.userRsvped && (
          <button onClick={() => rsvpMutation.mutate()} className="btn-primary" style={{ width: '100%', fontSize: '0.875rem' }} disabled={rsvpMutation.isPending}>
            {rsvpMutation.isPending ? 'RSVPing...' : 'RSVP — I\'m Going!'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Events() {
  const [search, setSearch] = useState('');
  const [upcoming, setUpcoming] = useState<boolean | undefined>(true);

  const { data, isLoading } = useQuery({
    queryKey: ['events', search, upcoming],
    queryFn: () => eventService.getEvents({ search: search || undefined, upcoming, size: 12 }),
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Events & <span className="gradient-text">Reunions</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Stay connected through events, webinars, and campus reunions</p>
      </div>

      <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input" style={{ flex: 1, minWidth: 200 }} placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[{ label: 'Upcoming', value: true }, { label: 'Past', value: false }, { label: 'All', value: undefined }].map(({ label, value }) => (
            <button key={label} onClick={() => setUpcoming(value)}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: upcoming === value ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-card)',
                color: upcoming === value ? 'white' : 'var(--text-secondary)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {Array(6).fill(0).map((_, i) => <div key={i} style={{ height: 200, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {data?.content.map(event => <EventCard key={event.id} event={event} />)}
          {data?.content.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>No events found. Check back later!</p>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
