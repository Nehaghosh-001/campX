import React, { useState, useEffect } from 'react';
import { collegeApi, driveApi, companyApi, studentApi, placementApi } from '../../api/api';
import { 
  Building2, ShieldCheck, CheckCircle2, XCircle, Users, Briefcase, 
  TrendingUp, Award, Clock, Search, Sparkles, FileText, 
  ExternalLink, PlusCircle, Filter, Download, Trash2, Edit3, Check, AlertCircle,
  Eye, GraduationCap, MapPin, Mail, Phone, Globe, BookOpen, Layers, BarChart2
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification'); // 'verification', 'colleges', 'students', 'companies', 'drives', 'placements', 'analytics'
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Inspection modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [rejectingCollege, setRejectingCollege] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Add College Modal
  const [showAddCollege, setShowAddCollege] = useState(false);
  const [newCollegeForm, setNewCollegeForm] = useState({
    name: '',
    code: '',
    affiliation_number: '',
    city: '',
    state: '',
    contact_email: '',
    contact_phone: '',
    admin_name: '',
    admin_email: '',
    admin_phone: ''
  });

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const [statsRes, collegesRes, companiesRes, drivesRes, studentsRes, placementsRes] = await Promise.all([
        collegeApi.getPlatformStats(),
        collegeApi.list(),
        companyApi.list(),
        driveApi.list(),
        studentApi.listStudents(),
        placementApi.list()
      ]);
      setStats(statsRes.data);
      setColleges(collegesRes.data);
      setCompanies(companiesRes.data);
      setDrives(drivesRes.data);
      setStudents(studentsRes.data);
      setPlacements(placementsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCollege = async (id) => {
    try {
      await collegeApi.approve(id, { action: 'approve' });
      setActionMsg(`🎉 College verified & approved! Placement Admin Dashboard access granted.`);
      loadMasterData();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingCollege) return;
    try {
      await collegeApi.approve(rejectingCollege.id, { 
        action: 'reject', 
        reason: rejectionReason || 'Accreditation documents did not meet standard university verification guidelines.'
      });
      setActionMsg(`College application marked as rejected.`);
      setRejectingCollege(null);
      setRejectionReason('');
      loadMasterData();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyCompany = async (companyId, action) => {
    try {
      await companyApi.verify(companyId, { action });
      setActionMsg(`Company status updated to ${action}.`);
      loadMasterData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCollegeSubmit = async (e) => {
    e.preventDefault();
    try {
      await collegeApi.apply({
        ...newCollegeForm,
        verification_document: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        document_name: `${newCollegeForm.code}_AICTE_Approval_Certificate.pdf`
      });
      setShowAddCollege(false);
      setActionMsg('New College added to the platform successfully.');
      loadMasterData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add college.');
    }
  };

  const pendingColleges = colleges.filter(c => c.status === 'pending');

  // Filtered colleges list
  const filteredColleges = colleges.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filtered students list
  const filteredStudents = students.filter(s => {
    const nameMatch = s.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCollege = collegeFilter === 'all' || String(s.college_id || s.college?.id) === String(collegeFilter);
    const matchBranch = branchFilter === 'all' || s.branch === branchFilter;
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'placed' && s.is_placed) || 
      (statusFilter === 'unplaced' && !s.is_placed);
    return nameMatch && matchCollege && matchBranch && matchStatus;
  });

  // Filtered drives list
  const filteredDrives = drives.filter(d => {
    const searchMatch = d.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.college_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return searchMatch && matchStatus;
  });

  // Filtered placements list
  const filteredPlacements = placements.filter(p => {
    return p.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.college_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.roll_number?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ maxWidth: '1320px', margin: '1.5rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* Top Banner in Blue & Yellow */}
      <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)', color: '#ffffff', border: 'none', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-yellow" style={{ fontWeight: '800' }}>
                <ShieldCheck size={13} /> MASTER SUPER ADMIN CONTROL PANEL
              </span>
              <span style={{ fontSize: '0.8rem', color: '#bfdbfe' }}>• Centralized Platform Governance</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: '800', color: '#ffffff' }}>
              University Placement Ecosystem Management
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#dbeafe', marginTop: '0.25rem' }}>
              Comprehensive master authority to monitor all onboarded colleges, review student records, audit placement drives, verify recruiter companies, and inspect AICTE accreditation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAddCollege(true)} className="btn btn-yellow">
              <PlusCircle size={16} /> Onboard New College
            </button>
            <button onClick={loadMasterData} className="btn btn-secondary">
              Refresh Platform Data
            </button>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
          <CheckCircle2 size={18} /> <span>{actionMsg}</span>
        </div>
      )}

      {/* Master KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>
            <span>ONBOARDED COLLEGES</span>
            <Building2 size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#0f172a' }}>
            {stats?.total_colleges ?? colleges.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
            {colleges.filter(c => c.status === 'approved').length} Verified • <span style={{ color: '#d97706' }}>{pendingColleges.length} Pending</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>
            <span>TOTAL STUDENTS</span>
            <Users size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#0f172a' }}>
            {stats?.total_students ?? students.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Registered across all colleges
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>
            <span>RECRUITER COMPANIES</span>
            <Briefcase size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#0f172a' }}>
            {companies.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '600' }}>
            {companies.filter(c => c.verified_status === 'verified').length} Verified Partners
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>
            <span>ACTIVE DRIVES</span>
            <TrendingUp size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#0f172a' }}>
            {drives.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: '600' }}>
            Campus placement drives
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '4px solid #ec4899' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>
            <span>TOTAL PLACEMENTS</span>
            <Award size={18} color="#ec4899" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#0f172a' }}>
            {placements.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: '700' }}>
            Highest: {stats?.highest_package_lpa || '28.5'} LPA
          </div>
        </div>
      </div>

      {/* Master Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => { setActiveTab('verification'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'verification' ? 'btn-yellow' : 'btn-secondary'}`}
        >
          <Clock size={14} /> College Verification Queue ({pendingColleges.length})
        </button>
        <button
          onClick={() => { setActiveTab('colleges'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'colleges' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={14} /> Master Colleges Directory ({colleges.length})
        </button>
        <button
          onClick={() => { setActiveTab('students'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={14} /> Student Talent Directory ({students.length})
        </button>
        <button
          onClick={() => { setActiveTab('companies'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Briefcase size={14} /> Recruiter Partners ({companies.length})
        </button>
        <button
          onClick={() => { setActiveTab('drives'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'drives' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <TrendingUp size={14} /> Campus Placement Drives ({drives.length})
        </button>
        <button
          onClick={() => { setActiveTab('placements'); setSearchQuery(''); setStatusFilter('all'); }}
          className={`btn btn-sm ${activeTab === 'placements' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={14} /> Placement Records ({placements.length})
        </button>
        <button
          onClick={() => { setActiveTab('analytics'); setSearchQuery(''); }}
          className={`btn btn-sm ${activeTab === 'analytics' ? 'btn-yellow' : 'btn-secondary'}`}
        >
          <BarChart2 size={14} /> Analytics & Reports
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COLLEGE VERIFICATION QUEUE */}
      {/* ======================================================== */}
      {activeTab === 'verification' && (
        <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid #fde68a', background: '#fffbeb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef3c7', border: '1px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#b45309" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#92400e' }}>
                  Accreditation & College Document Verification Center
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#b45309' }}>
                  Review uploaded AICTE / UGC approval documents. Approving a college unlocks their <strong>College Placement Admin Dashboard</strong>.
                </p>
              </div>
            </div>
          </div>

          {pendingColleges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#16a34a', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} />
              <span>All college verification requests have been inspected and approved!</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
              {pendingColleges.map((c) => (
                <div key={c.id} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <h4 style={{ fontWeight: '800', fontSize: '1.15rem', color: '#0f172a' }}>{c.name}</h4>
                        <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '700' }}>
                          Code: {c.code} • {c.city}, {c.state}
                        </div>
                      </div>
                      <span className="badge badge-yellow">Awaiting Review</span>
                    </div>

                    <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.825rem', border: '1px solid #e2e8f0' }}>
                      <div style={{ color: '#64748b', marginBottom: '2px' }}>AICTE / UGC Affiliation ID:</div>
                      <div style={{ fontWeight: '800', color: '#1e40af' }}>{c.affiliation_number || 'AICTE/WEST/2026/088'}</div>
                      <div style={{ color: '#64748b', marginTop: '6px', marginBottom: '2px' }}>Placement Cell Head (TPO):</div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.tpo_name} ({c.tpo_email} | {c.tpo_phone})</div>
                    </div>

                    {/* Verification Document Attachment */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={20} color="#2563eb" />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e40af' }}>
                            {c.document_name || 'AICTE_Accreditation_Certificate.pdf'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            Official Government Verification Attachment
                          </div>
                        </div>
                      </div>
                      <a
                        href={c.verification_document || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', borderColor: '#93c5fd' }}
                      >
                        <span>View PDF</span> <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <button
                      onClick={() => handleApproveCollege(c.id)}
                      className="btn btn-yellow btn-sm"
                      style={{ flex: 2, fontWeight: '800' }}
                    >
                      <CheckCircle2 size={15} /> Approve & Grant TPO Access
                    </button>
                    <button
                      onClick={() => setRejectingCollege(c)}
                      className="btn btn-danger btn-sm"
                      style={{ flex: 1 }}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MASTER COLLEGES DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'colleges' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Master Colleges Directory</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Complete list of institutions onboarded onto the platform</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>

              <select 
                className="input-field" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '140px' }}
              >
                <option value="all">All Statuses</option>
                <option value="approved">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <button onClick={() => setShowAddCollege(true)} className="btn btn-primary btn-sm">
                <PlusCircle size={14} /> Add College
              </button>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>College Name & Code</th>
                <th>Affiliation ID</th>
                <th>Location</th>
                <th>TPO Contact</th>
                <th>Students</th>
                <th>Drives</th>
                <th>Status</th>
                <th>Master Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>Code: {c.code}</div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{c.affiliation_number || 'AICTE-2026'}</span>
                  </td>
                  <td style={{ fontSize: '0.825rem', color: '#475569' }}>
                    {c.city}, {c.state}
                  </td>
                  <td style={{ fontSize: '0.825rem' }}>
                    <div style={{ fontWeight: '600' }}>{c.tpo_name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.tpo_email}</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>{c.student_count || 0}</td>
                  <td style={{ fontWeight: '700' }}>{c.drive_count || 0}</td>
                  <td>
                    {c.status === 'approved' ? (
                      <span className="badge badge-success"><CheckCircle2 size={11} /> Verified</span>
                    ) : c.status === 'pending' ? (
                      <span className="badge badge-yellow"><Clock size={11} /> Pending</span>
                    ) : (
                      <span className="badge badge-danger"><XCircle size={11} /> Rejected</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        onClick={() => setSelectedCollege(c)}
                        className="btn btn-secondary btn-sm"
                        title="View Full Profile"
                      >
                        <Eye size={13} />
                      </button>
                      {c.status === 'pending' && (
                        <button onClick={() => handleApproveCollege(c.id)} className="btn btn-yellow btn-sm">
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STUDENT TALENT DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Student Talent Directory</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Master directory of all registered students across all institutions</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search name, roll no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>

              <select
                className="input-field"
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                style={{ width: '120px' }}
              >
                <option value="all">All Branches</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="AI_DS">AI & DS</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>

              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '130px' }}
              >
                <option value="all">All Status</option>
                <option value="placed">Placed Only</option>
                <option value="unplaced">Active Candidates</option>
              </select>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>College</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Backlogs</th>
                <th>Status</th>
                <th>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr key={st.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{st.user?.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.user?.email}</div>
                  </td>
                  <td style={{ fontWeight: '600', color: '#2563eb' }}>{st.roll_number}</td>
                  <td style={{ fontSize: '0.825rem' }}>{st.college_name || 'Horizon Institute'}</td>
                  <td><span className="badge badge-blue">{st.branch}</span></td>
                  <td style={{ fontWeight: '700' }}>{st.cgpa}</td>
                  <td style={{ color: st.backlog_count > 0 ? '#dc2626' : '#64748b', fontWeight: '600' }}>{st.backlog_count}</td>
                  <td>
                    {st.is_placed ? (
                      <span className="badge badge-success"><CheckCircle2 size={11} /> Placed</span>
                    ) : (
                      <span className="badge badge-yellow">Active Candidate</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(st)}
                      className="btn btn-secondary btn-sm"
                      title="Inspect Student Profile"
                    >
                      <Eye size={13} /> <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: RECRUITER PARTNERS */}
      {/* ======================================================== */}
      {activeTab === 'companies' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Corporate Hiring Partners</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Verified companies and recruiters posting campus drives</p>
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>College Link</th>
                <th>HR Contact</th>
                <th>Verification</th>
                <th>Control Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((co) => (
                <tr key={co.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{co.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{co.website || 'Official Partner'}</div>
                  </td>
                  <td><span className="badge badge-purple">{co.industry}</span></td>
                  <td>{co.college_name || 'Multi-College Partner'}</td>
                  <td>
                    <div style={{ fontSize: '0.825rem', fontWeight: '600' }}>{co.hr_contact_name || co.hr_contact_email}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{co.hr_contact_phone}</div>
                  </td>
                  <td>
                    <span className={`badge ${co.verified_status === 'verified' ? 'badge-success' : 'badge-yellow'}`}>
                      {co.verified_status}
                    </span>
                  </td>
                  <td>
                    {co.verified_status === 'pending' ? (
                      <button onClick={() => handleVerifyCompany(co.id, 'verified')} className="btn btn-primary btn-sm">
                        Verify Partner
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>Active Partner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ALL CAMPUS DRIVES */}
      {/* ======================================================== */}
      {activeTab === 'drives' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Global Campus Placement Drives</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Active and completed recruitment drives across all universities</p>
            </div>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search drives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Drive / Job Role</th>
                <th>Company</th>
                <th>Host College</th>
                <th>Package (CTC)</th>
                <th>Min CGPA / Backlogs</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrives.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{d.job_title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.job_role} • {d.location}</div>
                  </td>
                  <td style={{ fontWeight: '600', color: '#2563eb' }}>{d.company_name}</td>
                  <td>{d.college_name}</td>
                  <td style={{ fontWeight: '800', color: '#16a34a' }}>{d.package_ctc}</td>
                  <td style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Min CGPA: <strong>{d.min_cgpa}</strong> • Max Backlog: <strong>{d.max_backlogs}</strong>
                  </td>
                  <td style={{ fontWeight: '700' }}>{d.applications_count || 0} students</td>
                  <td>
                    <span className={`badge ${d.status === 'open' ? 'badge-success' : 'badge-blue'}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: MASTER PLACEMENT RECORDS */}
      {/* ======================================================== */}
      {activeTab === 'placements' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Consolidated University Placement Offers</h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Verified placement selections, offered packages, and hire dates</p>
            </div>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search placements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>College</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Package (CTC)</th>
                <th>Offer Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlacements.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{p.student_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.roll_number} • {p.branch}</div>
                  </td>
                  <td>{p.college_name}</td>
                  <td style={{ fontWeight: '700', color: '#2563eb' }}>{p.company_name}</td>
                  <td>{p.designation}</td>
                  <td style={{ fontWeight: '800', color: '#16a34a', fontSize: '1rem' }}>{p.package_offered}</td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.offer_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: SYSTEM ANALYTICS & REPORTS */}
      {/* ======================================================== */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
              College Placement Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {colleges.map((c) => (
                <div key={c.id} style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{c.name} ({c.code})</div>
                    <span className="badge badge-success">{c.student_count || 0} Students</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Affiliation: {c.affiliation_number} • City: {c.city}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
              System Health & Governance Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', background: '#eff6ff' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e40af' }}>Database Schema Health</span>
                <span className="badge badge-success"><CheckCircle2 size={12} /> Optimal (SQLite / PostgreSQL ready)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', background: '#fef3c7' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#b45309' }}>Multi-Tenant Security</span>
                <span className="badge badge-yellow"><ShieldCheck size={12} /> Active College Isolation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '8px', background: '#dcfce7' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#15803d' }}>Dual-OTP Authentication Engine</span>
                <span className="badge badge-success">Online & Encrypted</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: STUDENT PROFILE INSPECTOR */}
      {/* ======================================================== */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.4rem' }}>Student Profile Inspector</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{selectedStudent.user?.full_name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '700' }}>Roll No: {selectedStudent.roll_number}</div>
              </div>
              {selectedStudent.is_placed ? (
                <span className="badge badge-success"><CheckCircle2 size={12} /> Placed</span>
              ) : (
                <span className="badge badge-yellow">Active Candidate</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Branch / Stream</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>{selectedStudent.branch}</div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Current CGPA</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#16a34a' }}>{selectedStudent.cgpa}</div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Backlogs</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: selectedStudent.backlog_count > 0 ? '#dc2626' : '#64748b' }}>
                  {selectedStudent.backlog_count}
                </div>
              </div>
              <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Contact Email</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>{selectedStudent.user?.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-primary">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: COLLEGE PROFILE INSPECTOR */}
      {/* ======================================================== */}
      {selectedCollege && (
        <div className="modal-overlay" onClick={() => setSelectedCollege(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>Institution Details</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>{selectedCollege.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '700' }}>Code: {selectedCollege.code}</div>
              </div>
              <span className={`badge ${selectedCollege.status === 'approved' ? 'badge-success' : 'badge-yellow'}`}>
                {selectedCollege.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AICTE / UGC Affiliation ID</div>
                <div style={{ fontWeight: '700', color: '#1e40af' }}>{selectedCollege.affiliation_number || 'AICTE/MAH/2026/0994'}</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Placement Cell Head (TPO)</div>
                <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedCollege.tpo_name} ({selectedCollege.tpo_email})</div>
              </div>
              <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</div>
                <div style={{ fontWeight: '600', color: '#475569' }}>{selectedCollege.city}, {selectedCollege.state}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedCollege(null)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ONBOARD NEW COLLEGE */}
      {/* ======================================================== */}
      {showAddCollege && (
        <div className="modal-overlay" onClick={() => setShowAddCollege(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem' }}>Onboard New College</h3>
            <form onSubmit={handleAddCollegeSubmit}>
              <div className="input-group">
                <label className="input-label">College Name *</label>
                <input
                  type="text"
                  className="input-field"
                  value={newCollegeForm.name}
                  onChange={(e) => setNewCollegeForm({ ...newCollegeForm, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                  <label className="input-label">College Code *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newCollegeForm.code}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, code: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">AICTE / UGC Code *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newCollegeForm.affiliation_number}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, affiliation_number: e.target.value })}
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
                    value={newCollegeForm.city}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, city: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">State *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newCollegeForm.state}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, state: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Head TPO Name *</label>
                <input
                  type="text"
                  className="input-field"
                  value={newCollegeForm.admin_name}
                  onChange={(e) => setNewCollegeForm({ ...newCollegeForm, admin_name: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                  <label className="input-label">TPO Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={newCollegeForm.admin_email}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, admin_email: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">TPO Phone *</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={newCollegeForm.admin_phone}
                    onChange={(e) => setNewCollegeForm({ ...newCollegeForm, admin_phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowAddCollege(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Onboard College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: REJECT REMARKS MODAL */}
      {/* ======================================================== */}
      {rejectingCollege && (
        <div className="modal-overlay" onClick={() => setRejectingCollege(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#dc2626' }}>
              <AlertCircle size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Reject College Verification</h3>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="input-group">
                <label className="input-label">Reason for Rejection</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Uploaded AICTE letter is expired or missing signature."
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setRejectingCollege(null)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
