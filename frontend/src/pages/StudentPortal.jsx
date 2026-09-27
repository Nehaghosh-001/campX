import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi, driveApi } from '../api/api';
import { 
  GraduationCap, Briefcase, Award, CheckCircle2, Clock, 
  MapPin, DollarSign, Calendar, Sparkles, ExternalLink, 
  FileText, Send, AlertCircle, Edit3, Save, X
} from 'lucide-react';
import EligibilityBadge from '../components/EligibilityBadge';
import RoundStepper from '../components/RoundStepper';
import OfferCelebrationModal from '../components/OfferCelebrationModal';

const StudentPortal = () => {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('drives'); // 'drives', 'tracker', 'history', 'profile'
  const [profile, setProfile] = useState(null);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [placementHistory, setPlacementHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  
  // Profile edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    roll_number: '',
    branch: 'CSE',
    cgpa: 8.5,
    backlog_count: 0,
    skills: [],
    skillsInput: '',
    resume_url: '',
    github_url: '',
    linkedin_url: '',
    bio: ''
  });

  // Offer modal
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    loadAllStudentData();
  }, []);

  const loadAllStudentData = async () => {
    setLoading(true);
    try {
      const [profRes, drivesRes, appsRes, histRes] = await Promise.all([
        studentApi.getProfile(),
        studentApi.getEligibleDrives(),
        studentApi.getApplicationsTracker(),
        studentApi.getPlacementHistory()
      ]);

      setProfile(profRes.data);
      setProfileForm({
        roll_number: profRes.data.roll_number || '',
        branch: profRes.data.branch || 'CSE',
        cgpa: profRes.data.cgpa || 8.0,
        backlog_count: profRes.data.backlog_count || 0,
        skills: profRes.data.skills || [],
        skillsInput: (profRes.data.skills || []).join(', '),
        resume_url: profRes.data.resume_url || '',
        github_url: profRes.data.github_url || '',
        linkedin_url: profRes.data.linkedin_url || '',
        bio: profRes.data.bio || ''
      });

      setDrives(drivesRes.data);
      setApplications(appsRes.data);
      setPlacementHistory(histRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      const res = await driveApi.apply(driveId);
      setActionMsg('🎉 Application submitted successfully! You are now enrolled in the drive.');
      loadAllStudentData();
      setTimeout(() => setActionMsg(''), 4000);
    } catch (err) {
      setActionMsg('❌ ' + (err.response?.data?.error || 'Failed to apply.'));
      setTimeout(() => setActionMsg(''), 4000);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = profileForm.skillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        roll_number: profileForm.roll_number,
        branch: profileForm.branch,
        cgpa: parseFloat(profileForm.cgpa) || 0.0,
        backlog_count: parseInt(profileForm.backlog_count) || 0,
        skills: skillsArray,
        resume_url: profileForm.resume_url,
        github_url: profileForm.github_url,
        linkedin_url: profileForm.linkedin_url,
        bio: profileForm.bio
      };

      const res = await studentApi.updateProfile(payload);
      setProfile(res.data);
      setIsEditingProfile(false);
      setActionMsg('✅ Profile updated! Eligibility status refreshed across all drives.');
      loadAllStudentData();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '1.5rem auto', padding: '0 1.5rem 4rem' }}>
      
      {/* Student Profile Ribbon */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.75rem', background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)' }}>
              <GraduationCap size={28} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{user?.full_name || 'Alex Chen'}</h1>
                {profile?.is_placed ? (
                  <span className="badge badge-success"><Sparkles size={11} /> Placed / Offer Received</span>
                ) : (
                  <span className="badge badge-blue">Active Placement Candidate</span>
                )}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {user?.college?.name || 'Apex Institute of Technology'} • Roll: <strong>{profile?.roll_number || '2026-CSE-042'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current CGPA</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>{profile?.cgpa || '8.85'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Backlogs</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: profile?.backlog_count > 0 ? '#f87171' : '#fff' }}>
                {profile?.backlog_count ?? 0}
              </div>
            </div>
            <button onClick={() => setActiveTab('profile')} className="btn btn-secondary btn-sm">
              <Edit3 size={13} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.15)', border: '1px solid rgba(79, 70, 229, 0.3)', color: '#c7d2fe', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('drives')}
          className={`btn btn-sm ${activeTab === 'drives' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Briefcase size={14} /> Eligible Drives Radar ({drives.length})
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`btn btn-sm ${activeTab === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Clock size={14} /> Live Round Tracker ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Award size={14} /> Placement Offers ({placementHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Edit3 size={14} /> Full Profile & Resume
        </button>
      </div>

      {/* Tab 1: Eligible Drives Radar */}
      {activeTab === 'drives' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {drives.map((d) => (
            <div key={d.id} className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={d.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
                      alt={d.company_name}
                      style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{d.job_title}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: '600' }}>{d.company_name}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#34d399' }}>{d.package_ctc}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {d.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> Deadline: {d.deadline ? new Date(d.deadline).toLocaleDateString() : 'Rolling'}</span>
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {d.job_description}
                </p>

                {/* Eligibility Engine Card */}
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <EligibilityBadge isEligible={d.is_eligible} reasons={d.eligibility_reasons} showDetails={true} />
                </div>
              </div>

              <div>
                {d.has_applied ? (
                  <button disabled className="btn btn-secondary btn-sm" style={{ width: '100%', cursor: 'default', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    <CheckCircle2 size={14} /> Applied ({d.current_round || d.application_status})
                  </button>
                ) : d.is_eligible ? (
                  <button onClick={() => handleApply(d.id)} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    <Send size={14} /> 1-Click Apply for Drive
                  </button>
                ) : (
                  <button disabled className="btn btn-secondary btn-sm" style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}>
                    Criteria Not Met (See Above)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Live Round Tracker */}
      {activeTab === 'tracker' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              You have not applied to any drives yet. Check out the <strong>Eligible Drives Radar</strong> tab!
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.application_id} className="glass-card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={app.company_logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100'}
                      alt={app.company_name}
                      style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{app.job_title}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: '600' }}>
                        {app.company_name} • {app.package_ctc}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${app.status === 'selected' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-blue'}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                      Status: {app.status.toUpperCase()}
                    </span>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Round Stepper Component */}
                <div style={{ marginBottom: '1rem' }}>
                  <RoundStepper rounds={app.rounds} currentStatus={app.status} />
                </div>

                {/* Next steps alert */}
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Current Stage: <strong style={{ color: '#fff' }}>{app.current_round_name || 'Round 1'}</strong>
                  </div>
                  {app.status === 'selected' && (
                    <button onClick={() => setActiveTab('history')} className="btn btn-accent btn-sm">
                      <Sparkles size={13} /> View Official Offer Letter
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Placement Offers */}
      {activeTab === 'history' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {placementHistory.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)', gridColumn: '1/-1' }}>
              No final offers published yet. Clear all interview rounds to receive your verified placement certificate!
            </div>
          ) : (
            placementHistory.map((rec) => (
              <div key={rec.id} className="glass-card" style={{ padding: '1.75rem', border: '1px solid rgba(139, 92, 246, 0.4)', background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.08) 0%, rgba(17, 24, 39, 0.75) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>
                      <Sparkles size={11} /> Official Offer
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{rec.company_name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{rec.designation}</div>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399' }}>
                    {rec.package_offered}
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Offer Extended on: {rec.offer_date}
                </div>

                <button
                  onClick={() => setSelectedOffer(rec)}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Award size={15} /> View Offer Certificate & Confetti
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Student Profile Editor */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Academic & Placement Profile
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            This data powers the real-time rule engine to filter eligible placement drives.
          </p>

          <form onSubmit={handleSaveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">University Roll Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={profileForm.roll_number}
                  onChange={(e) => setProfileForm({ ...profileForm, roll_number: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Engineering Branch</label>
                <select
                  className="input-field"
                  value={profileForm.branch}
                  onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                >
                  <option value="CSE">Computer Science & Engineering (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="AI_DS">AI & Data Science (AI_DS)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="EE">Electrical Engineering (EE)</option>
                  <option value="MECH">Mechanical Engineering (MECH)</option>
                  <option value="CIVIL">Civil Engineering (CIVIL)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Cumulative CGPA (out of 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="input-field"
                  value={profileForm.cgpa}
                  onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Active Backlogs Count</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input-field"
                  value={profileForm.backlog_count}
                  onChange={(e) => setProfileForm({ ...profileForm, backlog_count: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Technical Skills (comma-separated)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Python, React, Django, PostgreSQL, Docker, AWS"
                value={profileForm.skillsInput}
                onChange={(e) => setProfileForm({ ...profileForm, skillsInput: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Resume PDF URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://drive.google.com/your-resume.pdf"
                value={profileForm.resume_url}
                onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label className="input-label">GitHub Profile</label>
                <input
                  type="url"
                  className="input-field"
                  value={profileForm.github_url}
                  onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">LinkedIn Profile</label>
                <input
                  type="url"
                  className="input-field"
                  value={profileForm.linkedin_url}
                  onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Professional Bio / Elevator Pitch</label>
              <textarea
                className="input-field"
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Save size={16} /> Save Profile & Re-evaluate Eligibility
            </button>
          </form>
        </div>
      )}

      {/* Offer Celebration Modal */}
      <OfferCelebrationModal
        record={selectedOffer}
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
      />

    </div>
  );
};

export default StudentPortal;
