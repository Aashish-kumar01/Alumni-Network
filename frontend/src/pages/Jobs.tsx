import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Clock, Briefcase, CheckCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';

function JobCard({ job, onApply }: any) {
  const [showApply, setShowApply] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const { user } = useAuth();

  return (
    <motion.div whileHover={{ y: -2 }} className="glass card-hover" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{job.title}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={13} /> {job.company}
            {job.location && <><MapPin size={13} /> {job.location}</>}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          {job.jobType && <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>{job.jobType}</span>}
          {job.alreadyApplied && <span className="badge badge-green" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={10} /> Applied</span>}
        </div>
      </div>

      {(job.salaryMin || job.salaryMax) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4ade80', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          <DollarSign size={13} />
          {job.salaryMin && `₹${(job.salaryMin / 100000).toFixed(0)}L`}
          {job.salaryMin && job.salaryMax && ' - '}
          {job.salaryMax && `₹${(job.salaryMax / 100000).toFixed(0)}L`} / year
        </div>
      )}

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '0.75rem' }}>
        {job.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {(job.requiredSkills || []).slice(0, 4).map((s: string) => (
          <span key={s} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{s}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Clock size={12} />
          {job.applicationCount} applicants
          {job.deadline && ` · Deadline: ${new Date(job.deadline).toLocaleDateString()}`}
        </div>
        {user?.role !== 'ADMIN' && !job.alreadyApplied && (
          <button onClick={() => setShowApply(!showApply)} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
            {showApply ? 'Cancel' : 'Apply Now'}
          </button>
        )}
      </div>

      {showApply && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Cover Letter (optional)</label>
          <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
            className="input" rows={3} placeholder="Tell them why you're a great fit..."
            style={{ resize: 'vertical', minHeight: 80 }} />
          <button onClick={() => { onApply(job.id, coverLetter); setShowApply(false); }}
            className="btn-primary" style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.875rem' }}>
            Submit Application
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Jobs() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, location, page],
    queryFn: () => jobService.getJobs({ search: search || undefined, location: location || undefined, page, size: 10 }),
  });

  const applyMutation = useMutation({
    mutationFn: ({ jobId, coverLetter }: any) => jobService.applyForJob(jobId, { coverLetter }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Job <span className="gradient-text">Portal</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Exclusive job opportunities posted by alumni — referrals preferred</p>
      </div>

      <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Search jobs, companies..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
        </div>
        <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
          <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input className="input" style={{ paddingLeft: '2.25rem' }} placeholder="Location..." value={location} onChange={e => { setLocation(e.target.value); setPage(0); }} />
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array(4).fill(0).map((_, i) => <div key={i} style={{ height: 180, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />)}
        </div>
      ) : (
        <>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {data?.totalElements || 0} jobs found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data?.content.map(job => (
              <JobCard key={job.id} job={job} onApply={(jobId: number, coverLetter: string) => applyMutation.mutate({ jobId, coverLetter })} />
            ))}
          </div>
          {data && data.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} style={{ width: 36, height: 36, borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, background: page === i ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-card)', color: page === i ? 'white' : 'var(--text-secondary)' }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
