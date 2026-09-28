import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Link2, GraduationCap, Briefcase, Star } from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user: authUser, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: () => userService.getMe(),
  });

  const [form, setForm] = useState({
    fullName: '', bio: '', company: '', jobTitle: '', department: '',
    graduationYear: '', linkedinUrl: '', skills: '', availableForMentorship: false,
  });

  const startEdit = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName || '',
      bio: profile.bio || '',
      company: profile.company || '',
      jobTitle: profile.jobTitle || '',
      department: profile.department || '',
      graduationYear: profile.graduationYear?.toString() || '',
      linkedinUrl: profile.linkedinUrl || '',
      skills: (profile.skills || []).join(', '),
      availableForMentorship: profile.availableForMentorship || false,
    });
    setEditing(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => userService.updateProfile({
      ...form,
      graduationYear: form.graduationYear ? parseInt(form.graduationYear) : undefined,
      skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
    }),
    onSuccess: (data) => {
      updateUser(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditing(false);
    },
  });

  const p = profile || authUser;
  if (!p) return null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ borderRadius: '1.25rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div className="gradient-bg" style={{ height: 120, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -40, left: '2rem', width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--bg-primary)', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: 'white' }}>
            {p.profilePhotoUrl ? <img src={p.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.fullName?.[0]}
          </div>
        </div>
        <div style={{ padding: '3rem 2rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{p.fullName}</h1>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                {p.jobTitle && <><Briefcase size={14} /> {p.jobTitle}</>}
                {p.company && <>@ {p.company}</>}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-indigo">{p.role}</span>
                {p.department && <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><GraduationCap size={11} /> {p.department} {p.graduationYear ? `'${String(p.graduationYear).slice(2)}` : ''}</span>}
                {p.availableForMentorship && <span className="badge badge-green">Available for Mentorship</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {p.linkedinUrl && (
                <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.8rem' }}>
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
              <button onClick={startEdit} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <Edit3 size={15} /> Edit Profile
              </button>
            </div>
          </div>
          {p.bio && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '1rem', maxWidth: 600 }}>{p.bio}</p>}
          {p.averageRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: '#facc15', fontSize: '0.875rem' }}>
              <Star size={15} fill="currentColor" /> {p.averageRating.toFixed(1)} mentor rating
            </div>
          )}
        </div>
      </motion.div>

      {/* Skills */}
      {(p.skills || []).length > 0 && (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {(p.skills || []).map(skill => (
              <span key={skill} className="badge badge-purple">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass" style={{ width: '100%', maxWidth: 560, borderRadius: '1.25rem', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Edit Profile</h2>
              <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                { key: 'company', label: 'Company', type: 'text', placeholder: 'Google, Microsoft...' },
                { key: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Software Engineer' },
                { key: 'graduationYear', label: 'Graduation Year', type: 'number', placeholder: '2020' },
                { key: 'linkedinUrl', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...' },
                { key: 'skills', label: 'Skills (comma-separated)', type: 'text', placeholder: 'Java, Python, React' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                  <input type={type} className="input" placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Bio</label>
                <textarea className="input" rows={3} placeholder="Tell your story..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.availableForMentorship} onChange={e => setForm(f => ({ ...f, availableForMentorship: e.target.checked }))} />
                <span style={{ fontSize: '0.875rem' }}>Available for mentorship</span>
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button onClick={() => saveMutation.mutate()} className="btn-primary" disabled={saveMutation.isPending} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Save size={15} /> {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
