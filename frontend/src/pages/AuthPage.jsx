import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi, collegeApi } from '../api/api';
import { 
  GraduationCap, Building2, ShieldCheck, KeyRound, 
  Mail, User, Lock, ArrowRight, Sparkles, CheckCircle2, 
  AlertCircle, HelpCircle, RefreshCw, Upload, FileText, Check,
  ChevronRight, Phone, BookOpen, Layers
} from 'lucide-react';

const AuthPage = () => {
  const { loginWithTokens, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [colleges, setColleges] = useState([]);
  
  // Primary 3-Option Selector: 'student', 'college', or 'admin'
  const [portalType, setPortalType] = useState(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'superadmin' || roleParam === 'admin') return 'admin';
    if (roleParam === 'tpo' || roleParam === 'college') return 'college';
    return 'student';
  });

  // Sub-tabs for Student: 'login', 'signup', 'forgot_password'
  const [studentTab, setStudentTab] = useState('login');

  // Sub-tabs for College: 'tpo_login', 'college_onboarding'
  const [collegeTab, setCollegeTab] = useState('tpo_login');
  
  // Login credentials state
  const [identifier, setIdentifier] = useState('2026-CSE-001');
  const [password, setPassword] = useState('student123');

  // Student Signup state
  const [signupForm, setSignupForm] = useState({
    college_id: '',
    full_name: '',
    roll_number: '',
    email: '',
    phone: '',
    branch: 'CSE',
    password: '',
    confirm_password: ''
  });

  // Forgot Password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState(1);

  // College Onboarding state
  const [collegeForm, setCollegeForm] = useState({
    name: 'Horizon Institute of Science & Technology',
    code: 'HIST-2026',
    affiliation_number: 'AICTE/MAH/2026/0994',
    address: 'Plot 42, Institutional Innovation Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    contact_email: 'tpo@horizontech.edu',
    contact_phone: '+91-9876500001',
    website: 'https://horizontech.edu',
    verification_document: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    document_name: 'HIST_AICTE_Accreditation_Certificate_2026.pdf',
    admin_name: 'Dr. Sanjay Kulkarni',
    admin_phone: '+91-9876500002',
    admin_email: 'sanjay.tpo@horizontech.edu'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchApprovedColleges();
  }, []);

  // Update default credentials when switching sub-tabs
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    if (portalType === 'student') {
      if (studentTab === 'login') {
        setIdentifier('2026-CSE-001');
        setPassword('student123');
      }
    } else if (portalType === 'college') {
      if (collegeTab === 'tpo_login') {
        setIdentifier('tpo.apex@gmail.com');
        setPassword('tpo123');
      }
    } else if (portalType === 'admin') {
      setIdentifier('admin@gmail.com');
      setPassword('admin@123');
    }
  }, [portalType, studentTab, collegeTab]);

  const fetchApprovedColleges = async () => {
    try {
      const res = await collegeApi.list({ status: 'approved' });
      setColleges(res.data);
      if (res.data.length > 0) {
        setSignupForm(prev => ({ ...prev, college_id: res.data[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.login({ identifier, password });
      loginWithTokens(res.data.tokens, res.data.user);

      const userRole = res.data.user.role;
      if (userRole === 'superadmin') navigate('/superadmin');
      else if (userRole === 'tpo') navigate('/tpo');
      else if (userRole === 'company') navigate('/company');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please check your credentials and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (signupForm.password !== signupForm.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.studentSignup({
        college_id: parseInt(signupForm.college_id),
        full_name: signupForm.full_name,
        roll_number: signupForm.roll_number,
        email: signupForm.email,
        phone: signupForm.phone,
        branch: signupForm.branch,
        password: signupForm.password
      });

      loginWithTokens(res.data.tokens, res.data.user);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check the entered details.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword({ identifier: forgotIdentifier });
      setResetToken(res.data.reset_token);
      setResetStep(2);
      setSuccessMsg(`Password reset instructions sent to ${res.data.email}! Verification Token: ${res.data.reset_token}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find account with that Email / Roll Number.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.resetPassword({
        token: resetToken,
        new_password: newPassword
      });

      loginWithTokens(res.data.tokens, res.data.user);
      navigate('/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The token may be expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCollege = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await collegeApi.apply(collegeForm);
      setSuccessMsg(res.data?.message || '🎉 College onboarding application and AICTE verification document submitted! Admin can now inspect and verify it.');
      setCollegeTab('tpo_login');
      fetchApprovedColleges();
    } catch (err) {
      let errMsg = 'Failed to submit college application.';
      if (err.response?.data?.error) {
        errMsg = err.response.data.error;
      } else if (err.response?.data && typeof err.response.data === 'object') {
        const errorEntries = Object.entries(err.response.data);
        if (errorEntries.length > 0) {
          errMsg = errorEntries.map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* HEADER WITH LOGO */}
      <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <img 
            src="/logo.png" 
            alt="CampusConnect Logo" 
            style={{ 
              width: '54px', 
              height: '54px', 
              objectFit: 'contain',
              borderRadius: '12px',
              filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.25))'
            }} 
          />
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
              <span style={{ color: '#0052cc' }}>Campus</span><span style={{ color: '#f59e0b' }}>Connect</span>
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
              Centralized Placement Management System
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Select your portal to log in or register.
        </p>
      </div>

      {/* THREE PRIMARY SELECTION OPTIONS */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          {/* OPTION 1: STUDENT */}
          <div 
            onClick={() => { setPortalType('student'); setError(''); }}
            className="glass-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: portalType === 'student' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              background: portalType === 'student' ? '#eff6ff' : '#ffffff',
              boxShadow: portalType === 'student' ? '0 10px 25px rgba(37, 99, 235, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {portalType === 'student' && (
              <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <Check size={12} /> Selected
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: portalType === 'student' ? '#2563eb' : '#eff6ff',
                color: portalType === 'student' ? '#ffffff' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  Student
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Candidate Hub & Registration
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
              Log in with University Roll Number & Password. Check eligibility and track rounds.
            </p>
          </div>

          {/* OPTION 2: COLLEGE */}
          <div 
            onClick={() => { setPortalType('college'); setError(''); }}
            className="glass-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: portalType === 'college' ? '2px solid #1d4ed8' : '1px solid #e2e8f0',
              background: portalType === 'college' ? '#f0f9ff' : '#ffffff',
              boxShadow: portalType === 'college' ? '0 10px 25px rgba(29, 78, 216, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {portalType === 'college' && (
              <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <Check size={12} /> Selected
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: portalType === 'college' ? '#1d4ed8' : '#dbeafe',
                color: portalType === 'college' ? '#ffffff' : '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  College
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Placement Cell & TPO Console
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
              College Placement Officers (TPO) manage campus drives, shortlists & student access.
            </p>
          </div>

          {/* OPTION 3: ADMIN */}
          <div 
            onClick={() => { setPortalType('admin'); setError(''); }}
            className="glass-card"
            style={{
              padding: '1.5rem',
              cursor: 'pointer',
              border: portalType === 'admin' ? '2px solid #d97706' : '1px solid #e2e8f0',
              background: portalType === 'admin' ? '#fffbeb' : '#ffffff',
              boxShadow: portalType === 'admin' ? '0 10px 25px rgba(217, 119, 6, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {portalType === 'admin' && (
              <span className="badge badge-yellow" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <Check size={12} /> Selected
              </span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: portalType === 'admin' ? '#d97706' : '#fef3c7',
                color: portalType === 'admin' ? '#ffffff' : '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
                  Admin
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Platform Governance & Audit
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
              Inspect and verify colleges, audit AICTE accreditation, review students and drives.
            </p>
          </div>

        </div>
      </div>

      {/* DYNAMIC CONTENT BASED ON SELECTED PORTAL */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* LEFT COLUMN: GUIDELINES & SUB-TABS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {portalType === 'student' && (
            /* STUDENT INFO CARD */
            <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #2563eb' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                Student Identification
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                University Roll No. & Password
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Students log in using their unique <strong>University Roll Number</strong> and created password. Instant reset tokens are emailed if you ever lose your password.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Personalized placement drive eligibility tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#2563eb' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Real-time round progression & offer letter download</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#2563eb" />
                  <span>Direct application to verified company drives</span>
                </div>
              </div>

              {/* Sub-actions for Students */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => { setStudentTab('login'); setError(''); }}
                  className={`btn btn-sm ${studentTab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <GraduationCap size={15} /> Student Login (Roll No & Password)
                </button>
                <button
                  onClick={() => { setStudentTab('signup'); setError(''); }}
                  className={`btn btn-sm ${studentTab === 'signup' ? 'btn-yellow' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <User size={15} /> Student Registration (Create Account)
                </button>
                <button
                  onClick={() => { setStudentTab('forgot_password'); setError(''); }}
                  className={`btn btn-sm ${studentTab === 'forgot_password' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <KeyRound size={15} /> Forgot / Reset Password
                </button>
              </div>
            </div>
          )}

          {portalType === 'college' && (
            /* COLLEGE INFO CARD */
            <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #1d4ed8' }}>
              <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                <Building2 size={12} /> College Placement Cell
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                Placement Officer Console (TPO)
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Authorized console for <strong>College TPO Placement Officers</strong>. Companies connect directly with the College Placement Cell, and the College authorizes student drive access.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => { setCollegeTab('tpo_login'); setError(''); }}
                  className={`btn btn-sm ${collegeTab === 'tpo_login' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Building2 size={15} /> College Placement Officer (TPO) Login
                </button>
                <button
                  onClick={() => { setCollegeTab('college_onboarding'); setError(''); }}
                  className={`btn btn-sm ${collegeTab === 'college_onboarding' ? 'btn-yellow' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  <FileText size={15} /> Apply for College Onboarding
                </button>
              </div>
            </div>
          )}

          {portalType === 'admin' && (
            /* ADMIN INFO CARD */
            <div className="glass-card" style={{ padding: '1.75rem', borderTop: '4px solid #d97706' }}>
              <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
                <ShieldCheck size={12} /> Central Governance
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                Admin Control Panel
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Platform governance to inspect colleges, audit official AICTE/UGC approval certificates, oversee registered students, and monitor placement drives.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Audit & approve college onboarding applications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#d97706' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Verify AICTE / UGC official certificates</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#d97706" />
                  <span>Monitor student records and platform placement drives</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Credentials Reminder */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#64748b' }}>
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>💡 Quick Test Credentials:</div>
            {portalType === 'student' ? (
              <div><strong>Roll Number:</strong> 2026-CSE-001 • <strong>Password:</strong> student123</div>
            ) : portalType === 'college' ? (
              <div><strong>TPO Email:</strong> tpo.apex@gmail.com • <strong>Password:</strong> tpo123</div>
            ) : (
              <div><strong>Admin Email:</strong> admin@gmail.com • <strong>Password:</strong> admin@123</div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: FORMS */}
        <div>
          
          {/* =================================================== */}
          {/* STUDENT FORMS */}
          {/* =================================================== */}
          {portalType === 'student' && studentTab === 'login' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <GraduationCap size={24} color="#2563eb" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Student Login
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Enter your unique University Roll Number and Password to access your placement dashboard.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} /> <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label className="input-label">University Roll Number *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 2026-CSE-001"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="input-label" style={{ margin: 0 }}>Password *</label>
                    <button
                      type="button"
                      onClick={() => { setStudentTab('forgot_password'); setError(''); }}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {loading ? 'Authenticating...' : 'Log In to Candidate Hub'}
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                New student?{' '}
                <button
                  onClick={() => { setStudentTab('signup'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}
                >
                  Create Student Account
                </button>
              </div>
            </div>
          )}

          {portalType === 'student' && studentTab === 'signup' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <User size={24} color="#f59e0b" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Student Registration
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Create your student placement profile under your approved university / college.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStudentSignupSubmit}>
                <div className="input-group">
                  <label className="input-label">Select Your Approved College *</label>
                  <select
                    className="input-field"
                    value={signupForm.college_id}
                    onChange={(e) => setSignupForm({ ...signupForm, college_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Approved Institution --</option>
                    {colleges.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code}) - {c.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Rahul Sharma"
                      value={signupForm.full_name}
                      onChange={(e) => setSignupForm({ ...signupForm, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">University Roll Number *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 2026-CSE-101"
                      value={signupForm.roll_number}
                      onChange={(e) => setSignupForm({ ...signupForm, roll_number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">Email Address *</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="student@example.edu"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Branch / Department *</label>
                    <select
                      className="input-field"
                      value={signupForm.branch}
                      onChange={(e) => setSignupForm({ ...signupForm, branch: e.target.value })}
                      required
                    >
                      <option value="CSE">Computer Science (CSE)</option>
                      <option value="ECE">Electronics & Comm. (ECE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="ME">Mechanical Engineering (ME)</option>
                      <option value="EE">Electrical Engineering (EE)</option>
                      <option value="CIVIL">Civil Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="+91-9876543210"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">Create Password *</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Min 6 characters"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Re-enter password"
                      value={signupForm.confirm_password}
                      onChange={(e) => setSignupForm({ ...signupForm, confirm_password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-yellow btn-lg"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {loading ? 'Registering Account...' : 'Complete Student Registration'}
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                Already registered?{' '}
                <button
                  onClick={() => { setStudentTab('login'); setError(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}
                >
                  Log in with Roll Number
                </button>
              </div>
            </div>
          )}

          {portalType === 'student' && studentTab === 'forgot_password' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <KeyRound size={24} color="#2563eb" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Forgot Password Reset
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                {resetStep === 1 
                  ? 'Enter your registered University Roll Number or Email to receive an instant verification reset token.' 
                  : 'Enter the verification reset token and your new password.'}
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} /> <span>{successMsg}</span>
                </div>
              )}

              {resetStep === 1 ? (
                <form onSubmit={handleForgotPasswordRequest}>
                  <div className="input-group">
                    <label className="input-label">University Roll Number or Registered Email *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 2026-CSE-001 or student@example.edu"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {loading ? 'Sending Instructions...' : 'Request Password Reset Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit}>
                  <div className="input-group">
                    <label className="input-label">Verification Reset Token *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter the received token"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">New Password *</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    {loading ? 'Updating Password...' : 'Confirm & Save New Password'}
                  </button>
                </form>
              )}

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setStudentTab('login'); setResetStep(1); setError(''); }}
                  className="btn btn-secondary btn-sm"
                >
                  Back to Student Login
                </button>
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* COLLEGE FORMS */}
          {/* =================================================== */}
          {portalType === 'college' && collegeTab === 'tpo_login' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #1d4ed8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Building2 size={24} color="#1d4ed8" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  College Placement Officer (TPO) Login
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Manage college recruitment partnerships, configure campus drives, shortlist candidates, and coordinate round selections.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} /> <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label className="input-label">Official Registered Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter official email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {loading ? 'Authenticating...' : 'Log In as College TPO'}
                </button>
              </form>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                Need your college registered on CampusConnect?{' '}
                <button
                  onClick={() => setCollegeTab('college_onboarding')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '800', cursor: 'pointer' }}
                >
                  Apply for College Onboarding
                </button>
              </div>
            </div>
          )}

          {portalType === 'college' && collegeTab === 'college_onboarding' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={22} color="#2563eb" />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                    College Placement Cell Onboarding
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const rnd = Math.floor(100 + Math.random() * 900);
                    setCollegeForm({
                      name: `Imperial Institute of Technology ${rnd}`,
                      code: `IIT-${rnd}`,
                      affiliation_number: `AICTE/REG/2026/${rnd}`,
                      address: 'Institutional Education Corridor, Sector 5',
                      city: 'Bengaluru',
                      state: 'Karnataka',
                      contact_email: `tpo.iit${rnd}@campusconnect.edu`,
                      contact_phone: '+91-9876543210',
                      website: `https://iit${rnd}.edu`,
                      verification_document: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                      document_name: `IIT_${rnd}_AICTE_Accreditation_Certificate_2026.pdf`,
                      admin_name: 'Dr. Anand Kumar',
                      admin_phone: '+91-9876543211',
                      admin_email: `anand.tpo${rnd}@campusconnect.edu`
                    });
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <Sparkles size={13} color="#f59e0b" /> Auto-fill Fresh Sample
                </button>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Submit institution details & AICTE / UGC approval certificate for Admin audit
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleApplyCollege}>
                <div className="input-group">
                  <label className="input-label">College Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={collegeForm.name}
                    onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">College Code *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={collegeForm.code}
                      onChange={(e) => setCollegeForm({ ...collegeForm, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">AICTE / UGC Affiliation ID *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={collegeForm.affiliation_number}
                      onChange={(e) => setCollegeForm({ ...collegeForm, affiliation_number: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">City *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={collegeForm.city}
                      onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">State *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={collegeForm.state}
                      onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Head TPO Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={collegeForm.admin_name}
                    onChange={(e) => setCollegeForm({ ...collegeForm, admin_name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="input-group">
                    <label className="input-label">TPO Official Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      value={collegeForm.admin_email}
                      onChange={(e) => setCollegeForm({ ...collegeForm, admin_email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">TPO Phone *</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={collegeForm.admin_phone}
                      onChange={(e) => setCollegeForm({ ...collegeForm, admin_phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Verification Document Upload Attachment */}
                <div style={{ padding: '1rem', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '0.85rem', color: '#1e40af', marginBottom: '0.4rem' }}>
                    <Upload size={16} />
                    <span>Upload Government Verification Document (AICTE / UGC PDF)</span>
                  </div>
                  <input
                    type="text"
                    className="input-field"
                    value={collegeForm.document_name}
                    onChange={(e) => setCollegeForm({ ...collegeForm, document_name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setCollegeTab('tpo_login')} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                    {loading ? 'Submitting...' : 'Submit for Admin Verification'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =================================================== */}
          {/* ADMIN FORMS */}
          {/* =================================================== */}
          {portalType === 'admin' && (
            <div className="glass-card" style={{ padding: '2rem', borderTop: '4px solid #d97706' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <ShieldCheck size={24} color="#d97706" />
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0f172a' }}>
                  Admin Login
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Central admin panel to oversee all colleges, verify AICTE accreditation, review students and platform records.
              </p>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={15} /> <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} /> <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label className="input-label">Official Registered Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Enter official email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Password *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-yellow btn-lg"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                >
                  {loading ? 'Authenticating...' : 'Log In as Admin'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
