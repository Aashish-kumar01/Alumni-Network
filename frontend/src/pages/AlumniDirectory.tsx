import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Link2, GraduationCap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../types';

const DEPARTMENTS = ['', 'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'MBA', 'Design', 'Finance', 'Biotechnology', 'Chemistry', 'Architecture', 'Psychology'];

function AlumniCard({ user }: { user: User }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(99,102,241,0.15)' }}
      className="glass"
      style={{ padding: '1.5rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
          {user.profilePhotoUrl
            ? <img src={user.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : user.fullName?.[0]
          }
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{user.fullName}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{user.jobTitle}</div>
          {user.company && <div style={{ color: '#818cf8', fontSize: '0.8rem' }}>{user.company}</div>}
        </div>
        {user.availableForMentorship && (
          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Mentor</span>
        )}
      </div>

      {user.bio && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {user.bio}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {user.department && (
          <span className="badge badge-indigo" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <GraduationCap size={10} /> {user.department} {user.graduationYear ? `'${String(user.graduationYear).slice(2)}` : ''}
          </span>
        )}
        {(user.skills || []).slice(0, 3).map(skill => (
          <span key={skill} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{skill}</span>
        ))}
      </div>

      {user.averageRating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#facc15', fontSize: '0.8rem' }}>
          <Star size={13} fill="currentColor" /> {user.averageRating.toFixed(1)} rating
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
        <Link to={`/users/${user.id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '0.4rem', fontSize: '0.8rem' }}>
          View Profile
        </Link>
        {user.linkedinUrl && (
          <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center' }}>
            <Link2 size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function AlumniDirectory() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['alumni', search, department, graduationYear, company, page],
    queryFn: () => userService.getAlumniDirectory({
      search: search || undefined,
      department: department || undefined,
      graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
      company: company || undefined,
      page,
      size: 12,
    }),
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Alumni <span className="gradient-text">Directory</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Connect with alumni across departments, companies, and graduation years</p>
      </div>

      {/* Search and filters */}
      <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              className="input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search alumni by name or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} /> Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Department</label>
              <select className="input" value={department} onChange={e => { setDepartment(e.target.value); setPage(0); }}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'All Departments'}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Graduation Year</label>
              <input className="input" type="number" placeholder="e.g. 2020" value={graduationYear} onChange={e => { setGraduationYear(e.target.value); setPage(0); }} min="1980" max="2030" />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Company</label>
              <input className="input" placeholder="e.g. Google" value={company} onChange={e => { setCompany(e.target.value); setPage(0); }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ height: 220, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Showing {data?.content.length || 0} of {data?.totalElements || 0} alumni
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {data?.content.map(user => <AlumniCard key={user.id} user={user} />)}
          </div>
          {data && data.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  style={{ width: 36, height: 36, borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                    background: page === i ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--bg-card)',
                    color: page === i ? 'white' : 'var(--text-secondary)' }}>
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
