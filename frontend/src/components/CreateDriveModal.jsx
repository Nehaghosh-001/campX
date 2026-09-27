import React, { useState, useEffect } from 'react';
import { driveApi, companyApi, collegeApi } from '../api/api';
import { X, Sparkles, PlusCircle, Check, AlertCircle } from 'lucide-react';

const CreateDriveModal = ({ collegeId, companyId, isOpen, onClose, onCreated }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company_id: companyId || '',
    college_id: collegeId || '',
    job_title: '',
    job_role: 'Software Development Engineer',
    package_ctc: '12.0 LPA',
    package_numeric: 12.0,
    location: 'Bengaluru / Hybrid',
    drive_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    job_description: 'We are looking for strong problem solvers with high coding proficiency and deep knowledge of data structures, algorithms, and backend systems.',
    min_cgpa: 7.5,
    max_backlogs: 0,
    branches: ['CSE', 'IT', 'AI_DS'],
    skills_input: 'Python, React, SQL, Algorithms'
  });

  useEffect(() => {
    if (isOpen) {
      fetchCompanies();
    }
  }, [isOpen, collegeId]);

  const fetchCompanies = async () => {
    try {
      const res = await companyApi.list({ college_id: collegeId });
      setCompanies(res.data);
      if (res.data.length > 0 && !formData.company_id) {
        setFormData(prev => ({ ...prev, company_id: res.data[0].id }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const branchOptions = [
    { code: 'CSE', label: 'Computer Science' },
    { code: 'IT', label: 'Information Tech' },
    { code: 'AI_DS', label: 'AI & Data Science' },
    { code: 'ECE', label: 'Electronics & Comm' },
    { code: 'EE', label: 'Electrical' },
    { code: 'MECH', label: 'Mechanical' },
    { code: 'CIVIL', label: 'Civil' },
    { code: 'ALL', label: 'All Branches' }
  ];

  const toggleBranch = (code) => {
    if (code === 'ALL') {
      if (formData.branches.includes('ALL')) {
        setFormData(prev => ({ ...prev, branches: ['CSE', 'IT'] }));
      } else {
        setFormData(prev => ({ ...prev, branches: ['ALL'] }));
      }
      return;
    }

    setFormData(prev => {
      let updated = prev.branches.filter(b => b !== 'ALL');
      if (updated.includes(code)) {
        updated = updated.filter(b => b !== code);
      } else {
        updated = [...updated, code];
      }
      return { ...prev, branches: updated.length === 0 ? ['CSE'] : updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const skillsArray = formData.skills_input
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        company_id: formData.company_id,
        college_id: formData.college_id || collegeId,
        job_title: formData.job_title,
        job_role: formData.job_role,
        job_description: formData.job_description,
        package_ctc: formData.package_ctc,
        package_numeric: parseFloat(formData.package_numeric) || 8.0,
        location: formData.location,
        drive_date: formData.drive_date,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        eligibility_criteria: {
          min_cgpa: parseFloat(formData.min_cgpa) || 0.0,
          max_backlogs: parseInt(formData.max_backlogs) || 0,
          branches: formData.branches,
          required_skills: skillsArray
        },
        status: 'open'
      };

      await driveApi.create(payload);
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create placement drive. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PlusCircle size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Create Placement Drive</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Configure hiring details & rule-based eligibility criteria</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            
            {/* Company Select */}
            <div className="input-group">
              <label className="input-label">Recruiter / Company *</label>
              <select
                className="input-field"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                required
              >
                <option value="">Select Verified Company</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.industry})</option>
                ))}
              </select>
            </div>

            {/* Job Title */}
            <div className="input-group">
              <label className="input-label">Drive / Job Title *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. SDE-1 Graduate Engineer"
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                required
              />
            </div>

            {/* Job Role */}
            <div className="input-group">
              <label className="input-label">Role Category</label>
              <input
                type="text"
                className="input-field"
                value={formData.job_role}
                onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
              />
            </div>

            {/* Package CTC */}
            <div className="input-group">
              <label className="input-label">Package (CTC Display) *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 14.5 LPA"
                value={formData.package_ctc}
                onChange={(e) => setFormData({ ...formData, package_ctc: e.target.value })}
                required
              />
            </div>

            {/* Numeric CTC */}
            <div className="input-group">
              <label className="input-label">Numeric CTC (in LPA for analytics)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={formData.package_numeric}
                onChange={(e) => setFormData({ ...formData, package_numeric: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="input-group">
              <label className="input-label">Work Location</label>
              <input
                type="text"
                className="input-field"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Drive Date */}
            <div className="input-group">
              <label className="input-label">Drive Date</label>
              <input
                type="date"
                className="input-field"
                value={formData.drive_date}
                onChange={(e) => setFormData({ ...formData, drive_date: e.target.value })}
              />
            </div>

            {/* Deadline */}
            <div className="input-group">
              <label className="input-label">Registration Deadline</label>
              <input
                type="datetime-local"
                className="input-field"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Eligibility Engine Rules Card */}
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.85rem', color: '#818cf8', marginBottom: '0.75rem' }}>
              <Sparkles size={16} />
              <span>Eligibility Filtering Engine Rules</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Minimum CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="input-field"
                  value={formData.min_cgpa}
                  onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                />
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label className="input-label">Max Allowed Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input-field"
                  value={formData.max_backlogs}
                  onChange={(e) => setFormData({ ...formData, max_backlogs: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="input-label" style={{ marginBottom: '0.4rem', display: 'block' }}>Eligible Engineering Branches</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {branchOptions.map(b => {
                  const selected = formData.branches.includes(b.code);
                  return (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => toggleBranch(b.code)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        border: selected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                        background: selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                        color: selected ? '#c7d2fe' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {selected && <Check size={12} />}
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label className="input-label">Key Required Skills (comma-separated)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Python, React, Java, Docker, SQL"
                value={formData.skills_input}
                onChange={(e) => setFormData({ ...formData, skills_input: e.target.value })}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label className="input-label">Job Description & Interview Structure</label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating Drive...' : 'Launch Placement Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDriveModal;
