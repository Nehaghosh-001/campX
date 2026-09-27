import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collegeApi } from '../api/api';
import { 
  GraduationCap, Building2, Briefcase, ShieldCheck, Check, X,
  ArrowRight, Sparkles, Filter, Users, TrendingUp, Award, Layers, Zap, Upload, FileText, CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_colleges: 3,
    total_students: 6,
    total_drives: 4,
    total_placements: 2,
    highest_package_lpa: 28.5
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await collegeApi.getPlatformStats();
      setStats(prev => ({ ...prev, ...res.data }));
    } catch (e) {
      // fallback
    }
  };

  const handleQuickRole = async (targetRole) => {
    try {
      await demoLogin(targetRole);
      if (targetRole === 'superadmin') navigate('/superadmin');
      else if (targetRole === 'tpo') navigate('/tpo');
      else if (targetRole === 'company') navigate('/company');
      else navigate('/student');
    } catch (e) {
      console.error(e);
    }
  };

  const comparisonData = [
    { feature: 'Target Audience', linkedin: 'General open public job market', platform: 'Exclusively for onboarded colleges & verified students' },
    { feature: 'Placement Process Control', linkedin: 'Students search and apply solo', platform: 'College Placement Cell (TPO) oversees complete drive' },
    { feature: 'Company Onboarding', linkedin: 'Anyone can post jobs publicly', platform: 'College TPO verifies & approves company recruiters' },
    { feature: 'Eligibility Engine', linkedin: 'No internal filtering workflows', platform: 'Automated filtering by CGPA, Backlogs, Branch & Skills' },
    { feature: 'Interview Round Tracking', linkedin: 'No multi-round tracking', platform: 'Aptitude → Technical → HR live round-by-round tracking' },
    { feature: 'Official Verification', linkedin: 'Generic external notifications', platform: 'Official college notifications & verified offer letters' },
    { feature: 'Authentication Model', linkedin: 'Legacy passwords / OAuth', platform: 'University Roll Number & Encrypted Credentials' },
    { feature: 'Historical College Records', linkedin: 'Scattered across LinkedIn profiles', platform: 'Centralized college & student placement audit logs' },
  ];

  return (
    <div style={{ paddingBottom: '5rem' }}>
      
      {/* Hero Section in White, Blue & Yellow */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3.5rem 1.5rem 2.5rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <img 
            src="/logo.png" 
            alt="CampusConnect Logo" 
            style={{ 
              width: '90px', 
              height: '90px', 
              objectFit: 'contain',
              margin: '0 auto 1rem',
              display: 'block',
              filter: 'drop-shadow(0 8px 24px rgba(37, 99, 235, 0.25))'
            }} 
          />
          <div className="badge badge-yellow" style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem', fontWeight: '800' }}>
            <Sparkles size={15} color="#d97706" /> Centralized Multi-College Placement Portal
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: '800', lineHeight: '1.15', letterSpacing: '-0.03em', marginBottom: '1.25rem', color: '#0f172a' }}>
          Next-Generation Multi-College <br />
          <span className="gradient-text">Placement Management System</span>
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '780px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Unified recruitment platform connecting <strong>Students</strong>, <strong>Recruiters</strong>, and <strong>College Placement Cells (TPO)</strong> under a centralized <strong>Admin Panel</strong> to check all records, drives, and accreditation.
        </p>

        {/* THREE PRIMARY PORTAL OPTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', maxWidth: '1050px', margin: '0 auto 3rem' }}>
          
          {/* OPTION 1: STUDENT */}
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid #2563eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={22} color="#2563eb" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>Student</h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Candidate Hub & Registration</div>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Log in with your University Roll Number & Password. Check drive eligibility, track interview rounds, and download offers.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/auth?role=student" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <span>Student Login</span> <ArrowRight size={14} />
              </Link>
              <button onClick={() => handleQuickRole('student')} className="btn btn-secondary btn-sm" style={{ color: '#16a34a' }}>
                Demo
              </button>
            </div>
          </div>

          {/* OPTION 2: COLLEGE */}
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid #1d4ed8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} color="#1d4ed8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>College</h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Placement Cell & TPO Console</div>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Manage corporate hiring partners, configure placement drives with eligibility criteria, evaluate rounds, and authorize students.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/auth?role=tpo" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <span>College Login</span> <ArrowRight size={14} />
              </Link>
              <button onClick={() => handleQuickRole('tpo')} className="btn btn-secondary btn-sm" style={{ color: '#1e40af' }}>
                Demo
              </button>
            </div>
          </div>

          {/* OPTION 3: ADMIN */}
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'left', borderTop: '4px solid #d97706', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} color="#d97706" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>Admin</h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Platform Governance & Audit</div>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                Inspect onboarded colleges, verify AICTE / UGC approval accreditation certificates, oversee student directories and system data.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/auth?role=superadmin" className="btn btn-yellow btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                <span>Admin Login</span> <ArrowRight size={14} />
              </Link>
              <button onClick={() => handleQuickRole('superadmin')} className="btn btn-secondary btn-sm" style={{ color: '#d97706' }}>
                Demo
              </button>
            </div>
          </div>

        </div>

        {/* Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1000px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #2563eb' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#1d4ed8' }}>{stats.total_colleges || 3}+</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Onboarded Colleges</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#d97706' }}>{stats.total_drives || 4}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Active Campus Drives</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #10b981' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#15803d' }}>{stats.total_placements || 2}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Students Placed</div>
          </div>
          <div className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#6d28d9' }}>28.5 LPA</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Highest Package</div>
          </div>
        </div>
      </section>

      {/* Verification Architecture Workflow Box */}
      <section style={{ maxWidth: '1100px', margin: '3.5rem auto', padding: '0 1.5rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem', background: '#eff6ff', border: '2px solid #bfdbfe' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.4rem', fontWeight: '800' }}>
              Governance Architecture
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e3a8a' }}>
              College Placement Cell Verification Lifecycle
            </h2>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Admin checks and verifies accreditation documents before issuing the College Placement Admin Dashboard
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: '800' }}>1</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Create College Account</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Enter name, code, AICTE affiliation ID & Head TPO info</p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: '800' }}>2</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Upload Verification Doc</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Attach official AICTE / UGC approval certificate PDF</p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: '800' }}>3</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.25rem' }}>Admin Checks Everything</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Admin reviews all accreditation files & credentials</p>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '12px', border: '2px solid #86efac', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontWeight: '800' }}>✓</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#15803d', marginBottom: '0.25rem' }}>Placement Dashboard</h4>
              <p style={{ fontSize: '0.78rem', color: '#16a34a' }}>Approved college gains full Placement Cell Admin access!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Portals Exploration */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>Institutional Placement Ecosystem</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Tailored Portals for Every Placement Authority</h2>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '650px', margin: '0.5rem auto 0' }}>
            Hiring companies connect directly with the College Placement Cell (TPO), and the College verifies & authorizes campus drives for students.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* TPO */}
          <div className="glass-card glass-card-interactive" style={{ padding: '2rem', borderTop: '4px solid #2563eb', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid #bfdbfe' }}>
                <Building2 size={24} color="#1d4ed8" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>College Placement Cell (TPO)</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Connect with corporate hiring partners, configure placement drives with eligibility criteria, run auto-filtering, evaluate Aptitude → Tech → HR rounds, and grant access to eligible students.
              </p>
            </div>
            <button onClick={() => handleQuickRole('tpo')} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <span>Enter TPO Console</span> <ArrowRight size={14} />
            </button>
          </div>

          {/* Student */}
          <div className="glass-card glass-card-interactive" style={{ padding: '2rem', borderTop: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                <GraduationCap size={24} color="#15803d" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>Student Candidate Hub</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Secure login using University Roll Number & Password. Check eligibility for college-authorized company drives, apply in 1-click, track live round progression, and download verified offer letters.
              </p>
            </div>
            <button onClick={() => handleQuickRole('student')} className="btn btn-secondary btn-sm" style={{ width: '100%', color: '#16a34a' }}>
              <span>Enter Student Hub</span> <ArrowRight size={14} />
            </button>
          </div>

          {/* Super Admin */}
          <div className="glass-card glass-card-interactive" style={{ padding: '2rem', borderTop: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid #fde68a' }}>
                <ShieldCheck size={24} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>Admin Panel</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Governance control center to inspect colleges, audit official AICTE/UGC approval certificates, oversee registered student directories, monitor campus drives, and review platform analytics.
              </p>
            </div>
            <button onClick={() => handleQuickRole('superadmin')} className="btn btn-yellow btn-sm" style={{ width: '100%' }}>
              <span>Enter Admin Panel</span> <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-yellow" style={{ marginBottom: '0.5rem', fontWeight: '800' }}>Competitive Advantage</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Why Generic Platforms Fail for College Placements</h2>
        </div>

        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Dimension</th>
                  <th style={{ width: '36%', color: '#dc2626' }}>Generic Platforms (LinkedIn)</th>
                  <th style={{ width: '36%', color: '#16a34a' }}>CampusConnect Placement System</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: '#0f172a' }}>{row.feature}</td>
                    <td style={{ color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <X size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                        <span>{row.linkedin}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: '700' }}>
                        <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
                        <span>{row.platform}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ maxWidth: '1200px', margin: '4rem auto 0', padding: '2rem 1.5rem', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <img src="/logo.png" alt="CampusConnect Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>
            <span style={{ color: '#0052cc' }}>Campus</span><span style={{ color: '#f59e0b' }}>Connect</span>
          </span>
        </div>
        <p style={{ fontSize: '0.825rem', color: '#64748b' }}>
          Centralized Multi-College Placement Management System • Empowering Institutions, Students & Recruiters
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;
