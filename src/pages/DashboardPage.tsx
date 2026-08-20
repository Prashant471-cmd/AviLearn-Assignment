/**
 * AviLearn — Member Dashboard
 * File: src/pages/DashboardPage.tsx
 * Description: Personalized dashboard for registered members.
 *              Shows stats, quiz history, life list count, and profile editor.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Award, TrendingUp, BookOpen, List, User, Save, AlertCircle, CheckCircle2, Edit3, Calendar, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiGetMyQuizResults, apiGetProfile, apiUpdateProfile } from '../lib/mockApi';
import { QuizResultRecord, StoredUser } from '../lib/validation';
import { validateEmail } from '../lib/validation';

/* ── Internal styles ── */
const pageStyles = `
  .dash-layout { display: grid; grid-template-columns: 260px 1fr; gap: 2rem; }
  .dash-sidebar { position: sticky; top: calc(var(--header-height) + 1rem); height: fit-content; }
  .dash-nav-item { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.625rem 1rem; font-family: var(--font-sans); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; border: none; background: transparent; color: var(--color-text-muted); text-align: left; }
  .dash-nav-item:hover { background: var(--color-accent-light); color: var(--color-accent); }
  .dash-nav-item.active { background: var(--color-accent); color: white; }
  .score-bar { display: flex; align-items: center; gap: 0.75rem; }
  .score-fill { height: 6px; border-radius: 9999px; background: var(--color-accent); transition: width 0.5s ease; }
  .score-bg { flex: 1; height: 6px; border-radius: 9999px; background: var(--color-accent-light); overflow: hidden; }
  .xp-ring { position: relative; width: 80px; height: 80px; }
  @media (max-width: 900px) {
    .dash-layout { grid-template-columns: 1fr; }
    .dash-sidebar { position: static; }
  }
`;

type DashTab = 'overview' | 'history' | 'profile';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  lifeListCount?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, lifeListCount = 0 }) => {
  const { currentUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>([]);
  const [profile, setProfile] = useState<StoredUser | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);

  // Profile edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadData = useCallback(async () => {
    setLoadingResults(true);
    try {
      const [resultsRes, profileRes] = await Promise.all([
        apiGetMyQuizResults(),
        apiGetProfile(),
      ]);
      if (resultsRes.success && resultsRes.data) setQuizResults(resultsRes.data);
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        setEditName(profileRes.data.name);
        setEditEmail(profileRes.data.email);
      }
    } finally {
      setLoadingResults(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const avgScore = quizResults.length
    ? Math.round(quizResults.reduce((a, r) => a + r.percentage, 0) / quizResults.length)
    : 0;

  const xp = currentUser?.xp || 0;
  const level = Math.max(1, Math.floor(xp / 100) + 1);
  const xpProgress = Math.min(100, Math.round((xp / (level * 100)) * 100));

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!editName.trim()) errors.name = 'Name is required.';
    if (editName.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!editEmail.trim()) errors.email = 'Email is required.';
    if (editEmail && !validateEmail(editEmail)) errors.email = 'Enter a valid email address.';

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    setProfileSuccess('');
    try {
      const res = await apiUpdateProfile({ name: editName, email: editEmail });
      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        refreshUser();
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        setProfileErrors({ server: res.error || 'Update failed.' });
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const gradeColor = (pct: number) =>
    pct >= 80 ? 'var(--color-emerald)' : pct >= 60 ? 'var(--color-amber)' : 'var(--color-red)';

  const gradeBadge = (pct: number) =>
    pct >= 80 ? 'badge-green' : pct >= 60 ? 'badge-amber' : 'badge-red';

  const navItems: { id: DashTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'history', label: 'Quiz History', icon: Award },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <>
      <style>{pageStyles}</style>
      <div className="container" style={{ paddingBlock: '2.5rem' }}>
        {/* Welcome banner */}
        <div style={{ background: 'linear-gradient(135deg, #3D4435 0%, #2d3f26 100%)', borderRadius: 'var(--radius-lg)', padding: '2rem 2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.5rem' }}>Member Dashboard</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '0.5rem' }}>
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Birder'}
            </h1>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem' }}>
              Level {level} Ornithologist · {xp} XP earned
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'white' }}>{quizResults.length}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Quizzes Taken</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'white' }}>{avgScore}%</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Avg Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 900, color: 'white' }}>{lifeListCount}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>Life List</div>
            </div>
          </div>
        </div>

        <div className="dash-layout">
          {/* ── Sidebar ── */}
          <aside className="dash-sidebar">
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              {/* XP Progress */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 900 }}>
                  {level}
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, marginBottom: '0.25rem' }}>Level {level} Birder</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>{xp} / {level * 100} XP</div>
                <div className="progress-bar progress-xp">
                  <div className="progress-fill" style={{ width: `${xpProgress}%` }} />
                </div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navItems.map(n => (
                  <button
                    key={n.id}
                    id={`dash-nav-${n.id}`}
                    className={`dash-nav-item ${activeTab === n.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(n.id)}
                  >
                    <n.icon size={15} />
                    {n.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-subtle)', marginBottom: '0.75rem' }}>Quick Access</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button id="dash-goto-quizzes" onClick={() => onNavigate('quizzes')} className="btn btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
                  <Award size={14} /> Take a Quiz
                </button>
                <button id="dash-goto-guide" onClick={() => onNavigate('guide')} className="btn btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
                  <BookOpen size={14} /> Field Guide
                </button>
                <button id="dash-goto-journal" onClick={() => onNavigate('journal')} className="btn btn-ghost" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
                  <List size={14} /> Life List Journal
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <div>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Performance Overview</h2>

                {/* Stat cards */}
                <div className="grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
                  {[
                    { label: 'Quizzes Completed', value: quizResults.length, icon: Award, color: '#3D4435' },
                    { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: '#059669' },
                    { label: 'Total XP Earned', value: xp, icon: BarChart2, color: '#D97706' },
                  ].map(s => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-icon" style={{ background: `${s.color}18` }}>
                        <s.icon size={22} color={s.color} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent quiz results */}
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700 }}>Recent Quiz Performance</h3>
                    <button onClick={() => setActiveTab('history')} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      View all →
                    </button>
                  </div>
                  {loadingResults ? (
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Loading results…</p>
                  ) : quizResults.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-subtle)' }}>
                      <Award size={32} color="var(--color-border-strong)" style={{ margin: '0 auto 0.75rem' }} />
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>No quiz results yet.</p>
                      <button id="dash-start-quiz-btn" onClick={() => onNavigate('quizzes')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Take Your First Quiz</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {quizResults.slice(0, 4).map(r => (
                        <div key={r.id} className="score-bar">
                          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: `${gradeColor(r.percentage)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', fontWeight: 900, color: gradeColor(r.percentage) }}>{r.percentage}%</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.quizTitle}</div>
                            <div className="score-bg">
                              <div className="score-fill" style={{ width: `${r.percentage}%`, background: gradeColor(r.percentage) }} />
                            </div>
                          </div>
                          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>{r.score}/{r.total}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Quiz History</h2>
                {loadingResults ? (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Loading…</p>
                ) : quizResults.length === 0 ? (
                  <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Award size={40} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Quiz Results Yet</h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Complete a quiz to start tracking your performance history.</p>
                    <button id="history-start-quiz-btn" onClick={() => onNavigate('quizzes')} className="btn btn-primary">Start a Quiz</button>
                  </div>
                ) : (
                  <div className="card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Quiz</th>
                          <th>Date</th>
                          <th>Difficulty</th>
                          <th>Score</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizResults.map(r => (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>{r.quizTitle}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                <Calendar size={12} /> {r.date}
                              </div>
                            </td>
                            <td><span className={`badge ${r.difficulty === 'Expert' ? 'badge-red' : r.difficulty === 'Intermediate' ? 'badge-amber' : 'badge-green'}`}>{r.difficulty}</span></td>
                            <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600 }}>{r.score}/{r.total}</td>
                            <td><span className={`badge ${gradeBadge(r.percentage)}`}>{r.percentage}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Profile</h2>
                <div className="card" style={{ padding: '2rem', maxWidth: '520px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 900 }}>
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.2rem' }}>{currentUser?.name}</h3>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Member since {profile?.joinDate || currentUser?.joinDate}</p>
                      <span className="badge badge-default" style={{ marginTop: '0.5rem' }}>Level {level} Birder</span>
                    </div>
                  </div>

                  {profileSuccess && (
                    <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                      <CheckCircle2 size={16} /> <span>{profileSuccess}</span>
                    </div>
                  )}
                  {profileErrors.server && (
                    <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                      <AlertCircle size={16} /> <span>{profileErrors.server}</span>
                    </div>
                  )}

                  <form id="profile-update-form" onSubmit={handleProfileSave}>
                    <div className="form-group">
                      <label htmlFor="profile-name" className="form-label">Full Name</label>
                      <input
                        id="profile-name"
                        type="text"
                        value={editName}
                        onChange={e => { setEditName(e.target.value); setProfileErrors(p => ({ ...p, name: '' })); }}
                        className={`form-input ${profileErrors.name ? 'error' : ''}`}
                        aria-invalid={!!profileErrors.name}
                      />
                      {profileErrors.name && <p className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{profileErrors.name}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="profile-email" className="form-label">Email Address</label>
                      <input
                        id="profile-email"
                        type="email"
                        value={editEmail}
                        onChange={e => { setEditEmail(e.target.value); setProfileErrors(p => ({ ...p, email: '' })); }}
                        className={`form-input ${profileErrors.email ? 'error' : ''}`}
                        aria-invalid={!!profileErrors.email}
                      />
                      {profileErrors.email && <p className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{profileErrors.email}</p>}
                      <p className="form-hint">Changing email requires re-authentication on next login.</p>
                    </div>

                    {/* Read-only fields */}
                    <div className="form-group">
                      <label className="form-label">Account Role</label>
                      <div className="form-input" style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}>
                        {currentUser?.role === 'admin' ? 'Administrator' : 'Member'}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Member Since</label>
                      <div className="form-input" style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}>
                        {profile?.joinDate || currentUser?.joinDate}
                      </div>
                    </div>

                    <button
                      id="profile-save-btn"
                      type="submit"
                      disabled={savingProfile}
                      className="btn btn-primary"
                      style={{ marginTop: '0.5rem' }}
                    >
                      {savingProfile ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                          Saving…
                        </span>
                      ) : (
                        <><Save size={14} /> Save Changes</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
