import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  placementApi, driveApi, companyApi, studentApi 
} from '../../api/api';
import { 
  Building2, Users, Briefcase, PlusCircle, CheckCircle2, 
  XCircle, Filter, Award, Download, TrendingUp, Sparkles, 
  Calendar, ArrowRight, Play, Eye, FileSpreadsheet, Check
} from 'lucide-react';
import CreateDriveModal from '../../components/CreateDriveModal';
import RoundManagerModal from '../../components/RoundManagerModal';
import CollegePendingVerification from '../../components/CollegePendingVerification';

const TPODashboard = () => {
  const { user } = useAuth();
  const collegeId = user?.college?.id || 1;

  const [activeTab, setActiveTab] = useState('drives'); // 'drives', 'companies', 'students', 'placements'
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [placementRecords, setPlacementRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateDrive, setShowCreateDrive] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedDriveForRound, setSelectedDriveForRound] = useState(null);
  
  // Eligible students drawer / modal
  const [eligibleStudentsData, setEligibleStudentsData] = useState(null);
  const [evaluatingDriveId, setEvaluatingDriveId] = useState(null);

  // Filters
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    loadAllData();
  }, [collegeId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, drivesRes, companiesRes, studentsRes, placementsRes] = await Promise.all([
        placementApi.getTpoStats({ college_id: collegeId }),
        driveApi.list({ college_id: collegeId }),
        companyApi.list({ college_id: collegeId }),
        studentApi.listStudents({ college_id: collegeId }),
        placementApi.list({ college_id: collegeId })
      ]);

      setStats(statsRes.data);
      setDrives(drivesRes.data);
      setCompanies(companiesRes.data);
      setStudents(studentsRes.data);
      setPlacementRecords(placementsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (companyId, action) => {
    try {
      await companyApi.verify(companyId, { action });
      setStatusMsg(`Company status updated to ${action}.`);
      loadAllData();
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewEligibleStudents = async (driveId) => {
    setEvaluatingDriveId(driveId);
    try {
      const res = await driveApi.getEligibleStudents(driveId);
      setEligibleStudentsData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenRoundManager = (drive, round) => {
    setSelectedDriveForRound(drive);
    setSelectedRound(round);
  };

  const handlePublishFinalSelection = async (driveId) => {
    if (!window.confirm("Publish final selections for this drive? This will extend official offers to qualified students.")) return;
    try {
      const res = await driveApi.publishFinalList(driveId, {});
      setStatusMsg(`🎉 ${res.data.message}`);
      loadAllData();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const exportToCSV = () => {
    if (placementRecords.length === 0) {
      alert("No placement records to export.");
      return;
    }
    const headers = ["Student Name", "Roll Number", "Branch", "Company", "Job Title", "Package CTC", "Offer Date", "Status"];
    const rows = placementRecords.map(r => [
      `"${r.student_name}"`,
      `"${r.roll_number}"`,
      `"${r.branch}"`,
      `"${r.company_name}"`,
      `"${r.drive_title}"`,
      `"${r.package_offered}"`,
      `"${r.offer_date}"`,
      `"${r.final_status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Placement_Report_${user?.college?.code || 'AITS'}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (user?.college && user.college.status !== 'approved') {
    return <CollegePendingVerification college={user.college} onRefresh={loadAllData} />;
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '1.5rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-blue"><Building2 size={13} /> {user?.college?.name || 'Apex Institute of Technology'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>• Placement Governance</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', marginTop: '0.25rem' }}>
            Training & Placement Cell (TPO)
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowCreateDrive(true)} className="btn btn-primary">
            <PlusCircle size={16} /> Post New Campus Drive
          </button>
          <button onClick={exportToCSV} className="btn btn-secondary">
            <Download size={16} /> Export Placement Records
          </button>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} /> <span>{statusMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
            <span>PLACEMENT RATE</span>
            <TrendingUp size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#34d399' }}>
            {stats?.placement_percentage ?? 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {stats?.placed_students ?? 0} of {stats?.total_students ?? 0} students placed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
            <span>ACTIVE DRIVES</span>
            <Briefcase size={16} color="#818cf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#fff' }}>
            {stats?.active_drives ?? 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8' }}>
            {stats?.completed_drives ?? 0} completed recruitment cycles
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
            <span>AVERAGE CTC</span>
            <Award size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#fbbf24' }}>
            {stats?.avg_package_lpa ?? 0} LPA
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Highest Package: <strong style={{ color: '#fff' }}>{stats?.highest_package_lpa ?? 0} LPA</strong>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
            <span>HIRING PARTNERS</span>
            <Building2 size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.35rem 0', color: '#fff' }}>
            {companies.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            {companies.filter(c => c.verified_status === 'pending').length} pending verification
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('drives')}
          className={`btn btn-sm ${activeTab === 'drives' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Briefcase size={14} /> Placement Drives & Rounds ({drives.length})
        </button>
        <button
          onClick={() => setActiveTab('companies')}
          className={`btn btn-sm ${activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Building2 size={14} /> Verified Companies ({companies.length})
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`btn btn-sm ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Users size={14} /> Student Talent Roster ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('placements')}
          className={`btn btn-sm ${activeTab === 'placements' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={14} /> Placements & Offers ({placementRecords.length})
        </button>
      </div>

      {/* Tab 1: Drives Management */}
      {activeTab === 'drives' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {drives.map((d) => (
            <div key={d.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <img
                    src={d.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
                    alt={d.company_name}
                    style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{d.job_title}</h3>
                      <span className={`badge ${d.status === 'open' ? 'badge-success' : d.status === 'completed' ? 'badge-purple' : 'badge-blue'}`}>
                        {d.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: '600' }}>
                      {d.company_name} • {d.location}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399' }}>{d.package_ctc}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Applicants: <strong>{d.applications_count}</strong> | Placed: <strong style={{ color: '#c084fc' }}>{d.selected_count}</strong>
                  </div>
                </div>
              </div>

              {/* Eligibility Criteria Chips */}
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Eligibility:</span>
                  <span className="badge badge-blue">Min CGPA: {d.eligibility_criteria?.min_cgpa ?? 0}</span>
                  <span className="badge badge-purple">Max Backlogs: {d.eligibility_criteria?.max_backlogs ?? 0}</span>
                  <span className="badge badge-success">Branches: {(d.eligibility_criteria?.branches || []).join(', ')}</span>
                </div>

                <button
                  onClick={() => handleViewEligibleStudents(d.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', borderColor: 'rgba(99, 102, 241, 0.4)' }}
                >
                  <Filter size={13} color="#818cf8" />
                  <span>Run Eligibility Engine View</span>
                </button>
              </div>

              {/* Round Pipeline Stepper */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Recruitment Assessment Pipeline:
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {(d.rounds || []).map((r) => (
                    <div
                      key={r.id}
                      style={{
                        flex: '1',
                        minWidth: '180px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>Round #{r.order}</span>
                          <span style={{ fontSize: '0.7rem', color: r.status === 'completed' ? '#34d399' : '#fbbf24' }}>
                            {r.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.825rem', fontWeight: '700' }}>{r.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Passed: {r.passed_count} / {r.results_count}
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenRoundManager(d, r)}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.75rem' }}
                      >
                        <Play size={11} /> Evaluate & Score
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Drive Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.85rem' }}>
                <button
                  onClick={() => handlePublishFinalSelection(d.id)}
                  className="btn btn-accent btn-sm"
                >
                  <Check size={14} /> Publish Final Selection Offers
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Companies */}
      {activeTab === 'companies' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>
            Corporate Recruitment Partners
          </h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>HR Contact</th>
                <th>Drives Conducted</th>
                <th>Verification Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{c.website || 'No website'}</div>
                  </td>
                  <td>{c.industry}</td>
                  <td>
                    <div style={{ fontSize: '0.825rem' }}>{c.hr_contact_name || c.hr_contact_email}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{c.hr_contact_phone}</div>
                  </td>
                  <td style={{ fontWeight: '700' }}>{c.drives_count || 0}</td>
                  <td>
                    <span className={`badge ${c.verified_status === 'verified' ? 'badge-success' : c.verified_status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {c.verified_status}
                    </span>
                  </td>
                  <td>
                    {c.verified_status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => handleVerifyCompany(c.id, 'verified')} className="btn btn-accent btn-sm">
                          Verify
                        </button>
                        <button onClick={() => handleVerifyCompany(c.id, 'rejected')} className="btn btn-danger btn-sm">
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Verified Partner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Students Talent Roster */}
      {activeTab === 'students' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>College Student Profiles</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['ALL', 'CSE', 'IT', 'AI_DS', 'ECE', 'MECH'].map(branch => (
                <button
                  key={branch}
                  onClick={() => setBranchFilter(branch)}
                  className={`btn btn-sm ${branchFilter === branch ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>Active Backlogs</th>
                <th>Key Skills</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => branchFilter === 'ALL' || s.branch === branchFilter)
                .map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{s.user?.full_name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{s.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: '600', color: '#818cf8' }}>{s.roll_number}</td>
                    <td><span className="badge badge-blue">{s.branch}</span></td>
                    <td style={{ fontWeight: '700', color: s.cgpa >= 8.0 ? '#34d399' : '#fff' }}>{s.cgpa}</td>
                    <td style={{ color: s.backlog_count > 0 ? '#f87171' : 'var(--text-muted)' }}>{s.backlog_count}</td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '240px' }}>
                        {(s.skills || []).slice(0, 3).map((sk, idx) => (
                          <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {s.is_placed ? (
                        <span className="badge badge-success"><CheckCircle2 size={11} /> Placed</span>
                      ) : (
                        <span className="badge badge-warning">Active Candidate</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Placements & Offers Records */}
      {activeTab === 'placements' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Official Placement Records</h3>
            <button onClick={exportToCSV} className="btn btn-primary btn-sm">
              <Download size={14} /> Export CSV Report
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Branch & Roll</th>
                <th>Company</th>
                <th>Designation</th>
                <th>Package (CTC)</th>
                <th>Offer Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {placementRecords.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: '700' }}>{r.student_name}</div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{r.student_email}</div>
                  </td>
                  <td>
                    <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{r.branch}</span>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '2px' }}>{r.roll_number}</div>
                  </td>
                  <td style={{ fontWeight: '700', color: '#fff' }}>{r.company_name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{r.designation}</td>
                  <td style={{ fontWeight: '800', color: '#34d399', fontSize: '0.95rem' }}>{r.package_offered}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{r.offer_date}</td>
                  <td><span className="badge badge-success">{r.final_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Eligible Students Auto-Filter Inspection Modal */}
      {eligibleStudentsData && (
        <div className="modal-overlay" onClick={() => setEligibleStudentsData(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#818cf8" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Automated Eligibility Engine Results</h3>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Drive: {eligibleStudentsData.drive_title} ({eligibleStudentsData.company_name})
                </div>
              </div>
              <button onClick={() => setEligibleStudentsData(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <XCircle size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Evaluated: <strong>{eligibleStudentsData.total_students_evaluated}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#34d399' }}>
                Eligible to Apply: <strong>{eligibleStudentsData.eligible_count}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#f87171' }}>
                Filtered Out: <strong>{eligibleStudentsData.total_students_evaluated - eligibleStudentsData.eligible_count}</strong>
              </div>
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Branch</th>
                    <th>CGPA</th>
                    <th>Backlogs</th>
                    <th>Engine Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudentsData.students.map((st, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{st.full_name}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>{st.roll_number}</div>
                      </td>
                      <td><span className="badge badge-blue">{st.branch}</span></td>
                      <td style={{ fontWeight: '700' }}>{st.cgpa}</td>
                      <td>{st.backlog_count}</td>
                      <td>
                        {st.is_eligible ? (
                          <span className="badge badge-success"><CheckCircle2 size={11} /> Eligible</span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="badge badge-danger">Filtered</span>
                            <span style={{ fontSize: '0.68rem', color: '#f87171' }}>{st.reasons?.[0]}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Drive Modal */}
      <CreateDriveModal
        collegeId={collegeId}
        isOpen={showCreateDrive}
        onClose={() => setShowCreateDrive(false)}
        onCreated={loadAllData}
      />

      {/* Round Manager Modal */}
      <RoundManagerModal
        round={selectedRound}
        drive={selectedDriveForRound}
        isOpen={!!selectedRound}
        onClose={() => setSelectedRound(null)}
        onUpdated={loadAllData}
      />

    </div>
  );
};

export default TPODashboard;
