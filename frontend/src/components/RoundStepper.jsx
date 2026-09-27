import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

const RoundStepper = ({ rounds = [], currentStatus = 'applied' }) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div style={{ padding: '0.5rem', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
        No rounds configured yet
      </div>
    );
  }

  const getStatusIcon = (resStatus, roundStatus) => {
    if (resStatus === 'Pass') {
      return <CheckCircle size={16} color="#10b981" />;
    }
    if (resStatus === 'Fail') {
      return <XCircle size={16} color="#ef4444" />;
    }
    if (roundStatus === 'ongoing' || resStatus === 'Hold') {
      return <Clock size={16} color="#f59e0b" className="animate-spin" style={{ animationDuration: '3s' }} />;
    }
    return <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />;
  };

  const getStatusColor = (resStatus, roundStatus) => {
    if (resStatus === 'Pass') return '#10b981';
    if (resStatus === 'Fail') return '#ef4444';
    if (roundStatus === 'ongoing' || resStatus === 'Hold') return '#f59e0b';
    return 'rgba(255, 255, 255, 0.2)';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', overflowX: 'auto', padding: '0.5rem 0' }}>
      {rounds.map((r, idx) => {
        const isLast = idx === rounds.length - 1;
        const color = getStatusColor(r.result_status, r.status);

        return (
          <React.Fragment key={r.id || idx}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px', textAlign: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.4)',
                  border: `2px solid ${color}`,
                  marginBottom: '0.4rem',
                  boxShadow: r.result_status === 'Pass' ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                {getStatusIcon(r.result_status, r.status)}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', maxWidth: '120px' }}>
                {r.name || `Round ${r.order}`}
              </div>
              <div style={{ fontSize: '0.68rem', color: color, fontWeight: '600' }}>
                {r.result_status === 'Pass' ? 'Qualified' : r.result_status === 'Fail' ? 'Eliminated' : r.status === 'completed' ? 'Evaluated' : 'In Progress'}
              </div>
              {r.score && (
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  Score: {r.score}
                </div>
              )}
            </div>

            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: r.result_status === 'Pass' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  margin: '0 0.5rem',
                  minWidth: '30px',
                  alignSelf: 'center',
                  marginBottom: '1.5rem'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default RoundStepper;
