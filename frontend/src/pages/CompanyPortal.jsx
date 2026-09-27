import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { driveApi, companyApi } from '../api/api';
import { 
  Briefcase, Building2, PlusCircle, Users, CheckCircle2, 
  Play, FileText, Sparkles, MapPin, DollarSign, Calendar
} from 'lucide-react';
import CreateDriveModal from '../components/CreateDriveModal';
import RoundManagerModal from '../components/RoundManagerModal';

const CompanyPortal = () => {
  const { user } = useAuth();
  const collegeId = user?.college?.id || 1;
  const company = user?.company_profile;

  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);

  useEffect(() => {
    fetchCompanyDrives();
  }, [company, collegeId]);

  const fetchCompanyDrives = async () => {
    setLoading(true);
    try {
      const res = await driveApi.list({ college_id: collegeId });
      setDrives(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRound = (drive, round) => {
    setSelectedDrive(drive);
    setSelectedRound(round);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '1.5rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* Header Profile Bar */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <Briefcase size={28} color="#fbbf24" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{company?.name || 'Google Cloud & Platforms'}</h1>
              <span className="badge badge-success"><CheckCircle2 size={12} /> Verified Recruiter</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Partner College: <strong>{user?.college?.name || 'Apex Institute of Technology'}</strong> • {company?.industry || 'Technology'}
            </div>
          </div>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary btn-lg">
          <PlusCircle size={18} /> Post Placement Drive
        </button>
      </div>

      {/* Drives Grid */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Active Campus Drives & Candidate Evaluations</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{drives.length} Drives Posted</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {drives.map((d) => (
          <div key={d.id} className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{d.job_title}</h3>
                  <span className="badge badge-blue">{d.job_role}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} color="#818cf8" /> {d.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} color="#fbbf24" /> Drive: {d.drive_date || 'Active'}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>{d.package_ctc}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Total Applicants: <strong>{d.applications_count}</strong>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              {d.job_description}
            </p>

            {/* Rounds Progression */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#818cf8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Assessment Stages:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {(d.rounds || []).map((r) => (
                  <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{r.name}</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Round #{r.order}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
                      Qualified Candidates: <strong>{r.passed_count} / {r.results_count}</strong>
                    </div>
                    <button
                      onClick={() => handleOpenRound(d, r)}
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', fontSize: '0.75rem' }}
                    >
                      <Play size={11} /> Score Applicants
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Drive Modal */}
      <CreateDriveModal
        collegeId={collegeId}
        companyId={company?.id}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchCompanyDrives}
      />

      {/* Round Scoring Modal */}
      <RoundManagerModal
        round={selectedRound}
        drive={selectedDrive}
        isOpen={!!selectedRound}
        onClose={() => setSelectedRound(null)}
        onUpdated={fetchCompanyDrives}
      />

    </div>
  );
};

export default CompanyPortal;
