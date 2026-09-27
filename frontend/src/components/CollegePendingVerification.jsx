import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, Clock, FileText, CheckCircle2, XCircle, 
  ExternalLink, ArrowRight, ShieldCheck, Sparkles, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollegePendingVerification = ({ college, onRefresh }) => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const isRejected = college?.status === 'rejected';

  const handleSwitchToSuperAdmin = async () => {
    try {
      await demoLogin('superadmin');
      navigate('/superadmin');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* Main Status Card */}
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: `1px solid ${isRejected ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`, background: isRejected ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(17, 24, 39, 0.9) 100%)' : 'linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(17, 24, 39, 0.9) 100%)' }}>
        
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isRejected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: `1px solid ${isRejected ? '#ef4444' : '#fbbf24'}` }}>
          {isRejected ? (
            <XCircle size={32} color="#ef4444" />
          ) : (
            <Clock size={32} color="#fbbf24" className="animate-spin" style={{ animationDuration: '6s' }} />
          )}
        </div>

        <span className={`badge ${isRejected ? 'badge-danger' : 'badge-warning'}`} style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
          {isRejected ? 'Accreditation Rejected' : 'Under Admin Review'}
        </span>

        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          {college?.name || 'Metropolitan College of Engineering'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          College Code: <strong>{college?.code || 'MCE-77'}</strong> • Affiliation ID: <strong style={{ color: '#818cf8' }}>{college?.affiliation_number || 'AICTE/WEST/2026/088'}</strong>
        </p>

        {isRejected ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem', color: '#f87171', fontSize: '0.875rem', textAlign: 'left' }}>
            <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Rejection Reason:</div>
            <div>{college?.rejection_reason || 'Verification documents were invalid or illegible. Please contact support or re-apply.'}</div>
          </div>
        ) : (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
            Your college onboarding application and verification documents have been securely transmitted to the <strong>Platform Admin</strong>. Once verified, your full <strong>Placement Cell Admin Dashboard (TPO)</strong> will be unlocked automatically.
          </p>
        )}

        {/* Verification Document Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '1rem 1.25rem', borderRadius: '12px', maxWidth: '580px', margin: '0 auto 2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <FileText size={20} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                {college?.document_name || 'AICTE_Accreditation_Certificate.pdf'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Official Government Verification Attachment
              </div>
            </div>
          </div>

          <a
            href={college?.verification_document || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            <span>View Doc</span> <ExternalLink size={12} />
          </a>
        </div>

        {/* Evaluation Helper */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={onRefresh} className="btn btn-secondary">
            <RefreshCw size={15} /> Check Approval Status
          </button>
          
          <button
            onClick={handleSwitchToSuperAdmin}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)' }}
          >
            <ShieldCheck size={16} /> Switch to Admin to Approve This College
          </button>
        </div>

      </div>

    </div>
  );
};

export default CollegePendingVerification;
