import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, GraduationCap, Briefcase, ShieldCheck, Bell, 
  LogOut, UserCheck, ChevronDown, CheckCircle2, Sparkles, LayoutDashboard
} from 'lucide-react';
import NotificationDrawer from './NotificationDrawer';

const Navbar = () => {
  const { user, role, logout, demoLogin, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleRoleSwitch = async (targetRole) => {
    try {
      setSwitching(true);
      await demoLogin(targetRole);
      setShowRoleMenu(false);
      if (targetRole === 'superadmin') navigate('/superadmin');
      else if (targetRole === 'tpo') navigate('/tpo');
      else if (targetRole === 'company') navigate('/company');
      else navigate('/student');
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  const getRoleBadge = (userRole) => {
    switch(userRole) {
      case 'superadmin':
        return <span className="badge badge-yellow"><ShieldCheck size={12} /> Admin Control</span>;
      case 'tpo':
        return <span className="badge badge-blue"><Building2 size={12} /> College TPO</span>;
      case 'company':
        return <span className="badge badge-yellow"><Briefcase size={12} /> Recruiter</span>;
      case 'student':
        return <span className="badge badge-success"><GraduationCap size={12} /> Student</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-sm" style={{ background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo with New CampusConnect Emblem */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="CampusConnect Logo" 
            style={{ 
              width: '44px', 
              height: '44px', 
              objectFit: 'contain',
              borderRadius: '10px',
              filter: 'drop-shadow(0 2px 8px rgba(37, 99, 235, 0.2))'
            }} 
          />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a' }}>
              <span style={{ color: '#0052cc' }}>Campus</span>
              <span style={{ color: '#f59e0b' }}>Connect</span>
              <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #fde68a', fontWeight: '800' }}>
                Multi-College
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Centralized Placement Management System
            </div>
          </div>
        </Link>

        {/* Navigation / Role links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              {role === 'superadmin' && (
                <Link to="/superadmin" className="btn btn-yellow btn-sm">
                  <ShieldCheck size={15} /> Admin Panel
                </Link>
              )}
              {role === 'tpo' && (
                <Link to="/tpo" className="btn btn-primary btn-sm">
                  <LayoutDashboard size={15} /> TPO Console
                </Link>
              )}
              {role === 'student' && (
                <Link to="/student" className="btn btn-secondary btn-sm" style={{ color: '#1d4ed8' }}>
                  <GraduationCap size={15} /> Student Hub
                </Link>
              )}

              {/* Persona Switcher */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: '#cbd5e1' }}
                  title="Switch Persona for Evaluation"
                >
                  <Sparkles size={14} color="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Switch Role</span>
                  <ChevronDown size={13} />
                </button>

                {showRoleMenu && (
                  <div
                    className="glass-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: '240px',
                      padding: '0.5rem',
                      zIndex: 100,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                      background: '#ffffff'
                    }}
                  >
                    <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: '800' }}>
                      ⚡ Instant Persona Switcher
                    </div>
                    <button
                      onClick={() => handleRoleSwitch('tpo')}
                      style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: 'transparent', border: 'none', color: '#0f172a', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#eff6ff'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <Building2 size={16} color="#2563eb" />
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e40af' }}>College TPO Admin</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Manage drives, shortlists & rounds</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('student')}
                      style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: 'transparent', border: 'none', color: '#0f172a', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#dcfce7'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <GraduationCap size={16} color="#15803d" />
                      <div>
                        <div style={{ fontWeight: '700', color: '#15803d' }}>Student Candidate</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Check eligibility & apply</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('superadmin')}
                      style={{ width: '100%', textAlign: 'left', padding: '0.55rem 0.6rem', background: 'transparent', border: 'none', color: '#0f172a', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#fef3c7'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <ShieldCheck size={16} color="#d97706" />
                      <div>
                        <div style={{ fontWeight: '700', color: '#b45309' }}>Admin Panel</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Central platform governance</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e293b',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  title="Notifications"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#ef4444',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #ffffff'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationDrawer onClose={() => setShowNotifications(false)} />
                )}
              </div>

              {/* User Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{user.full_name || user.email}</div>
                  <div>{getRoleBadge(role)}</div>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.4rem 0.6rem', color: '#ef4444' }}
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <Link to="/auth?role=student" className="btn btn-secondary btn-sm" style={{ color: '#2563eb', borderColor: '#bfdbfe' }}>
                <GraduationCap size={14} /> <span>Student</span>
              </Link>
              <Link to="/auth?role=tpo" className="btn btn-primary btn-sm">
                <Building2 size={14} /> <span>College</span>
              </Link>
              <Link to="/auth?role=superadmin" className="btn btn-yellow btn-sm">
                <ShieldCheck size={14} /> <span>Admin</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
