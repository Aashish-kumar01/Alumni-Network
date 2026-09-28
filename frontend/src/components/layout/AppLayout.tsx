import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, Briefcase, Calendar, MessageSquare,
  Bell, Heart, BarChart3, LogOut, Sun, Moon, Menu, X,
  GraduationCap, HandshakeIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: Users, label: 'Alumni Directory', path: '/alumni', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: HandshakeIcon, label: 'Mentorship', path: '/mentorship', roles: ['STUDENT', 'ALUMNI'] },
  { icon: Briefcase, label: 'Jobs', path: '/jobs', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: Calendar, label: 'Events', path: '/events', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: MessageSquare, label: 'Messages', path: '/messages', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: Bell, label: 'Notifications', path: '/notifications', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: Heart, label: 'Donations', path: '/donations', roles: ['STUDENT', 'ALUMNI', 'ADMIN'] },
  { icon: BarChart3, label: 'Admin Panel', path: '/admin', roles: ['ADMIN'] },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = navItems.filter(item =>
    item.roles.includes(user?.role || 'STUDENT')
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem 1rem' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
        <div className="gradient-bg" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GraduationCap size={20} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Alumni Hub</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{user?.role}</div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {filteredNav.map(({ icon: Icon, label, path }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to="/profile" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', overflow: 'hidden',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            {user?.profilePhotoUrl
              ? <img src={user.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
                  {user?.fullName?.[0]?.toUpperCase()}
                </span>
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
        </Link>
        <button onClick={toggleTheme} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={handleLogout} className="sidebar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#f87171' }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, borderRight: '1px solid var(--border)',
        position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto',
        display: 'none'
      }} className="desktop-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, left: 0, height: '100vh', width: 240,
                background: 'var(--bg-secondary)', zIndex: 50, borderRight: '1px solid var(--border)'
              }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile/Tablet topbar */}
        <header style={{
          height: 56, borderBottom: '1px solid var(--border)', display: 'flex',
          alignItems: 'center', padding: '0 1rem', gap: '1rem',
          background: 'var(--bg-primary)', position: 'sticky', top: 0, zIndex: 30
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <Menu size={22} />
          </button>
          <div className="gradient-text" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Alumni Hub</div>
          <div style={{ flex: 1 }} />
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; }
          main { margin-left: 240px; }
        }
      `}</style>
    </div>
  );
}
