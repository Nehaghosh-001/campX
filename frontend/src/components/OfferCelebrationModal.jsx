import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle2, Download, Building, DollarSign, Calendar, Sparkles } from 'lucide-react';

const OfferCelebrationModal = ({ record, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', padding: '2rem', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(180deg, #161a2e 0%, #0d121f 100%)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}>
              <Award size={24} color="#fff" />
            </div>
            <div>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> Official Placement Offer
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginTop: '2px' }}>
                Letter of Intent & Selection
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Certificate Card */}
        <div style={{ marginTop: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This is to certify that</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: '0.25rem 0' }}>
              {record.student_name || 'Selected Candidate'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#818cf8' }}>
              Roll: {record.roll_number || 'STU-2026'} | Branch: {record.branch || 'CSE'}
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Has successfully cleared all recruitment rounds and has been offered the position of
            <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '1.05rem', marginTop: '0.2rem' }}>
              {record.designation || 'Software Development Engineer'}
            </div>
            at <strong style={{ color: '#fff' }}>{record.company_name}</strong>.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Annual CTC Package</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <DollarSign size={18} />
                <span>{record.package_offered}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Offer Date</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={15} color="#9ca3af" />
                <span>{record.offer_date || new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
            <CheckCircle2 size={14} /> Status: {record.final_status || 'Offered'}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => alert('Offer letter downloaded as PDF!')}
              className="btn btn-primary btn-sm"
            >
              <Download size={14} /> Download PDF
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCelebrationModal;
