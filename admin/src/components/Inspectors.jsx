import React from 'react';
import { Building2, CheckCircle2, XCircle, FileText, ExternalLink, MapPin, Mail, Phone, X } from 'lucide-react';

export const CollegeInspectorModal = ({ college, onClose, onApprove, onReject }) => {
  if (!college) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>Institution Profile</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{college.name}</h3>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: '700' }}>Code: {college.code}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AICTE / UGC Affiliation ID</div>
            <div style={{ fontWeight: '800', color: '#1e40af' }}>{college.affiliation_number || 'AICTE/MAH/2026/0994'}</div>
          </div>
          <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Status</div>
            <div style={{ marginTop: '2px' }}>
              <span className={`badge ${college.status === 'approved' ? 'badge-success' : college.status === 'pending' ? 'badge-yellow' : 'badge-danger'}`}>
                {college.status}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Placement Cell (TPO) Head Information
          </div>
          <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div><strong>Name:</strong> {college.tpo_name}</div>
            <div><strong>Email:</strong> {college.tpo_email}</div>
            <div><strong>Phone:</strong> {college.tpo_phone || '+91-9876500002'}</div>
            <div><strong>Location:</strong> {college.city}, {college.state}</div>
          </div>
        </div>

        {/* Verification Document Attachment */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileText size={20} color="#1e40af" />
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '800', color: '#1e40af' }}>
                {college.document_name || 'AICTE_Accreditation_Certificate.pdf'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Official Verification Attachment
              </div>
            </div>
          </div>
          <a
            href={college.verification_document || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', borderColor: '#93c5fd' }}
          >
            <span>View Attachment</span> <ExternalLink size={12} />
          </a>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {college.status === 'pending' && (
            <>
              <button onClick={() => { onReject(college); onClose(); }} className="btn btn-danger">
                <XCircle size={15} /> Reject
              </button>
              <button onClick={() => { onApprove(college.id); onClose(); }} className="btn btn-yellow">
                <CheckCircle2 size={15} /> Approve & Grant Access
              </button>
            </>
          )}
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const StudentInspectorModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>Student Profile Record</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{student.user?.full_name}</h3>
            <div style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: '700' }}>Roll No: {student.roll_number}</div>
          </div>
          <span className={`badge ${student.is_placed ? 'badge-success' : 'badge-yellow'}`}>
            {student.is_placed ? 'Placed' : 'Active Candidate'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Branch</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{student.branch}</div>
          </div>
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CGPA</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#16a34a' }}>{student.cgpa}</div>
          </div>
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Backlogs</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: student.backlog_count > 0 ? '#dc2626' : '#64748b' }}>
              {student.backlog_count}
            </div>
          </div>
          <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Email Address</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{student.user?.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="btn btn-primary">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
