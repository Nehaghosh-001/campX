import React, { useState, useEffect } from 'react';
import { driveApi } from '../api/api';
import { X, CheckCircle2, XCircle, Clock, Save, FileText, Send, Users } from 'lucide-react';

const RoundManagerModal = ({ round, drive, isOpen, onClose, onUpdated }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultsMap, setResultsMap] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen && round) {
      fetchRoundStudents();
    }
  }, [isOpen, round]);

  const fetchRoundStudents = async () => {
    setLoading(true);
    try {
      const res = await driveApi.getRoundStudents(round.id);
      setStudents(res.data);
      const initialMap = {};
      res.data.forEach(s => {
        initialMap[s.student] = {
          student_id: s.student,
          status: s.status || 'Hold',
          score: s.score || '',
          remarks: s.remarks || ''
        };
      });
      setResultsMap(initialMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setResultsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: newStatus
      }
    }));
  };

  const handleScoreChange = (studentId, score) => {
    setResultsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setResultsMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleBatchMarkAll = (status) => {
    setResultsMap(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k].status = status;
      });
      return updated;
    });
  };

  const handleSaveResults = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        results: Object.values(resultsMap)
      };
      await driveApi.updateRoundResults(round.id, payload);
      setMessage('✅ Round results saved! Qualified students promoted to next stage.');
      if (onUpdated) onUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (e) {
      setMessage('❌ Failed to save results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !round) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-purple">Round #{round.order}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{round.name}</h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {drive?.job_title} @ {drive?.company_name} ({students.length} Candidates)
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Batch Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={15} />
            <span>Batch Actions:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleBatchMarkAll('Pass')}
              className="btn btn-secondary btn-sm"
              style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              <CheckCircle2 size={13} /> Mark All Pass
            </button>
            <button
              type="button"
              onClick={() => handleBatchMarkAll('Fail')}
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <XCircle size={13} /> Mark All Fail
            </button>
            <button
              type="button"
              onClick={() => handleBatchMarkAll('Hold')}
              className="btn btn-secondary btn-sm"
              style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <Clock size={13} /> Mark All Hold
            </button>
          </div>
        </div>

        {message && (
          <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid rgba(79, 70, 229, 0.3)', color: '#c7d2fe', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {message}
          </div>
        )}

        {/* Students Evaluation Table */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>Loading candidates...</div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              No applicants enrolled in this round yet.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Branch & CGPA</th>
                  <th>Score / Marks</th>
                  <th>Feedback Remarks</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const curr = resultsMap[s.student] || { status: 'Hold', score: '', remarks: '' };

                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem' }}>{s.student_name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{s.roll_number || s.student_email}</div>
                      </td>
                      <td>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{s.branch || 'CSE'}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>CGPA: {s.cgpa}</div>
                      </td>
                      <td style={{ minWidth: '100px' }}>
                        <input
                          type="text"
                          placeholder="e.g. 85/100"
                          value={curr.score}
                          onChange={(e) => handleScoreChange(s.student, e.target.value)}
                          className="input-field"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </td>
                      <td style={{ minWidth: '160px' }}>
                        <input
                          type="text"
                          placeholder="Interview feedback..."
                          value={curr.remarks}
                          onChange={(e) => handleRemarksChange(s.student, e.target.value)}
                          className="input-field"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student, 'Pass')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              border: curr.status === 'Pass' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                              background: curr.status === 'Pass' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.03)',
                              color: curr.status === 'Pass' ? '#34d399' : 'var(--text-dim)',
                              cursor: 'pointer'
                            }}
                          >
                            Pass
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student, 'Hold')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              border: curr.status === 'Hold' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                              background: curr.status === 'Hold' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.03)',
                              color: curr.status === 'Hold' ? '#fbbf24' : 'var(--text-dim)',
                              cursor: 'pointer'
                            }}
                          >
                            Hold
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student, 'Fail')}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              border: curr.status === 'Fail' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                              background: curr.status === 'Fail' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.03)',
                              color: curr.status === 'Fail' ? '#f87171' : 'var(--text-dim)',
                              cursor: 'pointer'
                            }}
                          >
                            Fail
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveResults}
            disabled={saving}
            className="btn btn-primary"
          >
            <Save size={15} />
            {saving ? 'Promoting Candidates...' : 'Save & Advance Selected'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundManagerModal;
