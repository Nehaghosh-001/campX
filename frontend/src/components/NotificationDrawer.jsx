import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCheck, Briefcase, Calendar, Award, Info, X } from 'lucide-react';

const NotificationDrawer = ({ onClose }) => {
  const { notifications, markNotificationRead } = useAuth();

  const getIcon = (type) => {
    switch (type) {
      case 'drive_alert':
        return <Briefcase size={16} color="#60a5fa" />;
      case 'round_schedule':
        return <Calendar size={16} color="#fbbf24" />;
      case 'round_result':
        return <CheckCheck size={16} color="#34d399" />;
      case 'offer_alert':
        return <Award size={16} color="#c084fc" />;
      default:
        return <Info size={16} color="#9ca3af" />;
    }
  };

  const formatTime = (timeStr) => {
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        position: 'absolute',
        right: 0,
        top: '120%',
        width: '360px',
        maxHeight: '480px',
        overflowY: 'auto',
        padding: '1rem',
        zIndex: 100,
        boxShadow: '0 20px 30px rgba(0, 0, 0, 0.6)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.9rem' }}>
          <Bell size={16} color="#818cf8" />
          <span>Notifications</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({notifications.length})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => markNotificationRead(null)}
            style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
          >
            Mark all read
          </button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                background: n.is_read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(79, 70, 229, 0.12)',
                border: `1px solid ${n.is_read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(79, 70, 229, 0.3)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <div style={{ marginTop: '2px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '6px' }}>
                  {getIcon(n.notification_type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: n.is_read ? '600' : '700', color: 'var(--text-main)', marginBottom: '2px' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {formatTime(n.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
