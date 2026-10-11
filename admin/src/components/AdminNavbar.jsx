import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { 
  ShieldCheck, Building2, Users, Briefcase, TrendingUp, Award, 
  Clock, LogOut, Sparkles, ExternalLink, BarChart2
} from 'lucide-react';

const AdminNavbar = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Overview', icon: ShieldCheck },
    { to: '/verification', label: 'College Verification', icon: Clock },
    { to: '/colleges', label: 'Colleges', icon: Building2 },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/companies', label: 'Recruiters', icon: Briefcase },
    { to: '/drives', label: 'Campus Drives', icon: TrendingUp },
    { to: '/placements', label: 'Placement Records', icon: Award },
  ];

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/logo.png" 
            alt="CampX Admin Logo" 
            style={{ 
              width: '44px', 
              height: '44px', 
              objectFit: 'contain',
              borderRadius: '10px',
              filter: 'drop-shadow(0 2px 8px rgba(30, 64, 175, 0.2))'
            }} 
          />
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: '#0052cc' }}>Camp</span>
              <span style={{ color: '#f59e0b' }}>X</span>
              <span className="badge badge-yellow" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>MASTER ADMIN</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Central Platform Governance & Verification
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        {adminUser && (
          <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    color: isActive ? '#1e40af' : '#64748b',
                    background: isActive ? '#eff6ff' : 'transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* User / Actions */}
        {adminUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>{adminUser.full_name || 'Super Admin'}</div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '600' }}>● Master Access</div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: '#dc2626' }} title="Logout">
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-primary btn-sm">Admin Sign In</Link>
          </div>
        )}

      </div>
    </header>
  );
};

export default AdminNavbar;
