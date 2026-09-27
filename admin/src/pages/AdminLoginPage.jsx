import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { authApi } from '../api/api';
import { ShieldCheck, Sparkles, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLoginPage = () => {
  const { loginWithTokens, adminDemoLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ identifier: identifier.trim(), password: password.trim() });
      if (res.data.user.role !== 'superadmin') {
        setError('Access denied: You need Super Admin privileges to enter this master panel.');
        return;
      }
      loginWithTokens(res.data.tokens, res.data.user);
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to Backend API (http://127.0.0.1:8000). Please make sure the backend server is running with run_backend.bat or python manage.py runserver.');
      } else {
        setError(err.response?.data?.error || 'Invalid administrator credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handle1ClickDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await adminDemoLogin();
      navigate('/');
    } catch (e) {
      setError('Failed to login via 1-click test account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img 
            src="/logo.png" 
            alt="CampusConnect Logo" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'contain',
              margin: '0 auto 1rem',
              display: 'block',
              filter: 'drop-shadow(0 6px 16px rgba(30, 64, 175, 0.25))'
            }} 
          />
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
            Master Admin Control Panel
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Central multi-college placement governance & audit
          </p>
        </div>

        {/* 1-Click Evaluation Pill */}
        <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.25rem', border: '1px solid #fde68a', background: '#fffbeb', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: '800', color: '#b45309', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> <span>1-Click Test Administrator Access</span>
          </div>
          <button onClick={handle1ClickDemo} disabled={loading} className="btn btn-yellow btn-sm" style={{ width: '100%' }}>
            {loading ? 'Authenticating...' : 'Enter Master Admin Panel (1-Click)'}
          </button>
        </div>

        {/* Login Form */}
        <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #1e40af' }}>
          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Admin Email Address *</label>
              <input
                type="email"
                className="input-field"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Admin Password *</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Authenticating...' : 'Sign In as Super Admin'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
            Protected University Placement System • CampusConnect 2026
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
