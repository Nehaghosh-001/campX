import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

const EligibilityBadge = ({ isEligible, reasons = [], showDetails = false }) => {
  if (isEligible) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span className="badge badge-success">
          <CheckCircle2 size={12} /> Eligible to Apply
        </span>
        {showDetails && (
          <span style={{ fontSize: '0.7rem', color: '#34d399' }}>
            Criteria matched (CGPA, Branch & Backlogs)
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span className="badge badge-danger" title={reasons.join(' | ')}>
        <XCircle size={12} /> Not Eligible
      </span>
      {reasons && reasons.length > 0 && (
        <div style={{ fontSize: '0.72rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={11} />
          <span>{reasons[0]}</span>
        </div>
      )}
    </div>
  );
};

export default EligibilityBadge;
