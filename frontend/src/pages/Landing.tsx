import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Briefcase, MessageSquare, Calendar, Heart, Star, ArrowRight, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: Users, title: 'Alumni Directory', desc: 'Connect with thousands of alumni across industries and graduation years.', color: '#6366f1' },
  { icon: GraduationCap, title: 'Mentorship', desc: 'Get guidance from experienced alumni who have walked your path.', color: '#a855f7' },
  { icon: Briefcase, title: 'Job Portal', desc: 'Exclusive job postings and referral opportunities from alumni.', color: '#06b6d4' },
  { icon: Calendar, title: 'Events', desc: 'Attend reunions, webinars, career fairs, and networking events.', color: '#22d3ee' },
  { icon: MessageSquare, title: 'Real-time Chat', desc: 'Message alumni directly for advice, referrals, and networking.', color: '#818cf8' },
  { icon: Heart, title: 'Donations', desc: 'Give back to the institution that shaped your career.', color: '#c084fc' },
];

const stats = [
  { label: 'Alumni Registered', value: '10,000+' },
  { label: 'Jobs Posted', value: '2,500+' },
  { label: 'Mentorships', value: '1,200+' },
  { label: 'Events Hosted', value: '350+' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)', background: 'rgba(15,15,35,0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="gradient-bg" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={20} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }} className="gradient-text">Alumni Networking Hub</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Sign In
          </Link>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '8rem', paddingBottom: '5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 9999, marginBottom: '1.5rem' }}
            className="glass badge-indigo">
            <Star size={14} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>The Premier Alumni Network Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            <span className="gradient-text">Connect. Grow.</span>
            <br />Give Back.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Join thousands of students and alumni on the most powerful networking platform.
            Find mentors, land dream jobs, attend events, and build lasting connections.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Start Networking <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.875rem 2rem' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap', padding: '0 1.5rem' }}
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="glass card-hover" style={{ padding: '1.25rem 2rem', borderRadius: '1rem', textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            A complete ecosystem for professional growth and community building
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass"
              style={{ padding: '1.75rem', borderRadius: '1rem', cursor: 'default' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '0.75rem', marginBottom: '1rem',
                background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-bg"
          style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 2rem', borderRadius: '1.5rem' }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready to Join Your Network?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '2rem', fontSize: '1rem' }}>
            Create your free account and start connecting with thousands of alumni today.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'white', color: '#4f46e5', padding: '0.875rem 2rem',
            borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '1rem'
          }}>
            Get Started Free <ChevronRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <p>© 2025 Alumni Networking Hub. Built with ❤️ for the community.</p>
      </footer>
    </div>
  );
}
