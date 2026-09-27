import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import { SuperAdminDashboard, TPODashboard } from './pages/admin';
import CompanyPortal from './pages/CompanyPortal';
import StudentPortal from './pages/StudentPortal';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading CampusOrbit...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in as another role, redirect to their home portal
    if (user.role === 'superadmin') return <Navigate to="/superadmin" replace />;
    if (user.role === 'tpo') return <Navigate to="/tpo" replace />;
    if (user.role === 'company') return <Navigate to="/company" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tpo"
            element={
              <ProtectedRoute allowedRoles={['tpo', 'superadmin']}>
                <TPODashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={['company', 'tpo', 'superadmin']}>
                <CompanyPortal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student', 'tpo', 'superadmin']}>
                <StudentPortal />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', background: 'rgba(11, 15, 25, 0.95)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontWeight: '700', color: 'var(--text-muted)' }}>
            CampusOrbit • Centralized Multi-College Placement Management Platform
          </div>
          <div>
            Built with Django REST Framework, SimpleJWT & React
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
