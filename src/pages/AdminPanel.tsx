/**
 * AviLearn — Admin Panel
 * File: src/pages/AdminPanel.tsx
 * Description: Secure administrative back-end module for administrators.
 *              Full CRUD on bird species, quiz questions, and user accounts.
 *              Activity monitoring and performance overview.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bird, Users, Award, BarChart2, Plus, Edit2, Trash2,
  CheckCircle2, AlertCircle, X, RefreshCw, Shield, Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  apiGetUsers, apiDeleteUser, apiGetBirds, apiCreateBird,
  apiUpdateBird, apiDeleteBird, apiGetActivityOverview,
  apiGetQuizzes, apiDeleteQuiz, UserSummary,
} from '../lib/mockApi';
import { BirdSpecies, QuizSet } from '../types';
import { validateBirdForm } from '../lib/validation';

/* ── Internal styles ── */
const pageStyles = `
  .admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; min-height: calc(100vh - 180px); }
  .admin-sidebar { background: var(--color-surface); border: 1px solid var(--color-border); padding: 1.25rem; height: fit-content; position: sticky; top: calc(var(--header-height) + 1rem); border-radius: var(--radius-md); }
  .admin-nav-btn { display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.625rem 0.875rem; font-family: var(--font-sans); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-radius: var(--radius-md); cursor: pointer; transition: all 0.15s; border: none; background: transparent; color: var(--color-text-muted); text-align: left; }
  .admin-nav-btn:hover { background: var(--color-accent-light); color: var(--color-accent); }
  .admin-nav-btn.active { background: var(--color-accent); color: white; }
  .action-btns { display: flex; gap: 0.5rem; align-items: center; }
  @media (max-width: 900px) {
    .admin-layout { grid-template-columns: 1fr; }
    .admin-sidebar { position: static; }
  }
`;

type AdminTab = 'overview' | 'birds' | 'quizzes' | 'users';

interface BirdFormState {
  commonName: string;
  scientificName: string;
  order: string;
  family: string;
  genus: string;
  description: string;
  habitat: string;
  diet: string;
  region: string;
  conservationStatus: BirdSpecies['conservationStatus'];
  statusLabel: string;
  rarityLevel: BirdSpecies['rarityLevel'];
  migrationStatus: BirdSpecies['migrationStatus'];
  imageUrl: string;
  callDescription: string;
  funFact: string;
  nesting: string;
  keyFieldMarks: string;
}

const emptyBirdForm: BirdFormState = {
  commonName: '', scientificName: '', order: '', family: '', genus: '',
  description: '', habitat: '', diet: '', region: '', conservationStatus: 'LC',
  statusLabel: 'Least Concern', rarityLevel: 'Common', migrationStatus: 'Resident',
  imageUrl: '', callDescription: '', funFact: '', nesting: '', keyFieldMarks: '',
};

export const AdminPanel: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [birds, setBirds] = useState<BirdSpecies[]>([]);
  const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
  const [activity, setActivity] = useState<{
    totalUsers: number; totalQuizAttempts: number; averageScore: number;
    topPerformers: { name: string; avgScore: number; quizCount: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Bird modal
  const [birdModal, setBirdModal] = useState<{ open: boolean; mode: 'create' | 'edit'; bird?: BirdSpecies }>({ open: false, mode: 'create' });
  const [birdForm, setBirdForm] = useState<BirdFormState>(emptyBirdForm);
  const [birdErrors, setBirdErrors] = useState<Record<string, string>>({});
  const [savingBird, setSavingBird] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, birdsRes, quizzesRes, activityRes] = await Promise.all([
        apiGetUsers(),
        apiGetBirds(1, 50),
        apiGetQuizzes(),
        apiGetActivityOverview(),
      ]);
      if (usersRes.success && usersRes.data) setUsers(usersRes.data);
      if (birdsRes.success && birdsRes.data) setBirds(birdsRes.data.birds);
      if (quizzesRes.success && quizzesRes.data) setQuizzes(quizzesRes.data);
      if (activityRes.success && activityRes.data) setActivity(activityRes.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!isAdmin) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <Shield size={48} color="var(--color-red)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text-muted)' }}>This area requires administrator privileges.</p>
      </div>
    );
  }

  // ── Bird CRUD handlers ──────────────────────────────────────────────────

  const openCreateBird = () => {
    setBirdForm(emptyBirdForm);
    setBirdErrors({});
    setBirdModal({ open: true, mode: 'create' });
  };

  const openEditBird = (bird: BirdSpecies) => {
    setBirdForm({
      commonName: bird.commonName, scientificName: bird.scientificName,
      order: bird.order, family: bird.family, genus: bird.genus || '',
      description: bird.description, habitat: bird.habitat.join(', '),
      diet: bird.diet.join(', '), region: bird.region.join(', '),
      conservationStatus: bird.conservationStatus, statusLabel: bird.statusLabel,
      rarityLevel: bird.rarityLevel, migrationStatus: bird.migrationStatus,
      imageUrl: bird.imageUrl || '', callDescription: bird.callDescription || '',
      funFact: bird.funFact || '', nesting: bird.nesting || '',
      keyFieldMarks: bird.keyFieldMarks.join('\n'),
    });
    setBirdErrors({});
    setBirdModal({ open: true, mode: 'edit', bird });
  };

  const handleBirdFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBirdForm(prev => ({ ...prev, [name]: value }));
    if (birdErrors[name]) setBirdErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSaveBird = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBirdForm({
      commonName: birdForm.commonName, scientificName: birdForm.scientificName,
      order: birdForm.order, family: birdForm.family, description: birdForm.description,
    });
    if (!validation.valid) { setBirdErrors(validation.errors); return; }

    setSavingBird(true);
    try {
      const payload: Omit<BirdSpecies, 'id'> = {
        commonName: birdForm.commonName, scientificName: birdForm.scientificName,
        order: birdForm.order, family: birdForm.family, genus: birdForm.genus,
        description: birdForm.description,
        habitat: birdForm.habitat.split(',').map(s => s.trim()).filter(Boolean),
        diet: birdForm.diet.split(',').map(s => s.trim()).filter(Boolean),
        region: birdForm.region.split(',').map(s => s.trim()).filter(Boolean),
        conservationStatus: birdForm.conservationStatus, statusLabel: birdForm.statusLabel,
        rarityLevel: birdForm.rarityLevel, migrationStatus: birdForm.migrationStatus,
        imageUrl: birdForm.imageUrl, callDescription: birdForm.callDescription,
        funFact: birdForm.funFact, nesting: birdForm.nesting,
        keyFieldMarks: birdForm.keyFieldMarks.split('\n').map(s => s.trim()).filter(Boolean),
        wingspanCm: 0, lengthCm: 0, weightG: 0, flyway: 'Unknown', similarSpeciesIds: [],
      };

      if (birdModal.mode === 'edit' && birdModal.bird) {
        const res = await apiUpdateBird(birdModal.bird.id, payload);
        if (res.success) { showToast('Bird species updated successfully.'); }
        else { showToast(res.error || 'Update failed.', 'error'); return; }
      } else {
        const res = await apiCreateBird(payload);
        if (res.success) { showToast('New bird species created!'); }
        else { showToast(res.error || 'Creation failed.', 'error'); return; }
      }
      setBirdModal({ open: false, mode: 'create' });
      loadData();
    } finally {
      setSavingBird(false);
    }
  };

  const handleDeleteBird = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from the species database? This cannot be undone.`)) return;
    const res = await apiDeleteBird(id);
    if (res.success) { showToast(`"${name}" deleted.`); loadData(); }
    else showToast(res.error || 'Delete failed.', 'error');
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Delete user account "${name}"? This cannot be undone.`)) return;
    const res = await apiDeleteUser(id);
    if (res.success) { showToast(`User "${name}" deleted.`); loadData(); }
    else showToast(res.error || 'Delete failed.', 'error');
  };

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (!window.confirm(`Delete quiz "${title}"?`)) return;
    const res = await apiDeleteQuiz(id);
    if (res.success) { showToast(`Quiz "${title}" deleted.`); loadData(); }
    else showToast(res.error || 'Delete failed.', 'error');
  };

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Activity Overview', icon: BarChart2 },
    { id: 'birds', label: 'Bird Species', icon: Bird, count: birds.length },
    { id: 'quizzes', label: 'Quiz Sets', icon: Award, count: quizzes.length },
    { id: 'users', label: 'User Accounts', icon: Users, count: users.length },
  ];

  return (
    <>
      <style>{pageStyles}</style>

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ background: toast.type === 'error' ? 'var(--color-red)' : 'var(--color-accent)' }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="container" style={{ paddingBlock: '2.5rem' }}>
        {/* Admin header */}
        <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', borderRadius: 'var(--radius-lg)', padding: '1.75rem 2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Shield size={18} color="rgba(255,255,255,0.6)" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.4)' }}>Secure Admin Module</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
              AviLearn Administration
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>
              Logged in as {currentUser?.name} · Administrator
            </p>
          </div>
          <button id="admin-refresh-btn" onClick={loadData} className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        <div className="admin-layout">
          {/* ── Sidebar ── */}
          <aside className="admin-sidebar">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-subtle)', padding: '0 0.875rem', marginBottom: '0.75rem' }}>Admin Sections</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navItems.map(n => (
                <button
                  key={n.id}
                  id={`admin-nav-${n.id}`}
                  className={`admin-nav-btn ${activeTab === n.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(n.id)}
                >
                  <n.icon size={14} />
                  <span style={{ flex: 1 }}>{n.label}</span>
                  {n.count !== undefined && (
                    <span style={{ background: activeTab === n.id ? 'rgba(255,255,255,0.2)' : 'var(--color-accent-light)', color: activeTab === n.id ? 'white' : 'var(--color-accent)', borderRadius: '9999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', fontWeight: 700 }}>
                      {n.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div>
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Activity Overview</h2>
                {activity && (
                  <>
                    <div className="grid-3" style={{ gap: '1rem', marginBottom: '2rem' }}>
                      {[
                        { label: 'Total Users', value: activity.totalUsers, icon: Users, color: '#3D4435' },
                        { label: 'Quiz Attempts', value: activity.totalQuizAttempts, icon: Award, color: '#059669' },
                        { label: 'Platform Avg Score', value: `${activity.averageScore}%`, icon: BarChart2, color: '#D97706' },
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

                    <div className="card" style={{ padding: '1.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Performers</h3>
                      {activity.topPerformers.length === 0 ? (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>No quiz data yet.</p>
                      ) : (
                        <table className="data-table">
                          <thead><tr><th>Member</th><th>Avg Score</th><th>Quizzes</th></tr></thead>
                          <tbody>
                            {activity.topPerformers.map((p, i) => (
                              <tr key={i}>
                                <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8125rem' }}>
                                  <span style={{ marginRight: '0.5rem', color: 'var(--color-text-subtle)' }}>#{i + 1}</span>{p.name}
                                </td>
                                <td><span className={`badge ${p.avgScore >= 80 ? 'badge-green' : p.avgScore >= 60 ? 'badge-amber' : 'badge-red'}`}>{p.avgScore}%</span></td>
                                <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>{p.quizCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* BIRDS CRUD */}
            {activeTab === 'birds' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800 }}>Bird Species ({birds.length})</h2>
                  <button id="admin-add-bird-btn" onClick={openCreateBird} className="btn btn-primary">
                    <Plus size={14} /> Add New Species
                  </button>
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Common Name</th>
                        <th>Scientific Name</th>
                        <th>Order / Family</th>
                        <th>Status</th>
                        <th>Rarity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {birds.map(b => (
                        <tr key={b.id}>
                          <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.8125rem' }}>{b.commonName}</td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>{b.scientificName}</td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{b.order}<br /><span style={{ fontSize: '0.65rem' }}>{b.family}</span></td>
                          <td><span className={`badge ${b.conservationStatus === 'LC' ? 'badge-green' : b.conservationStatus === 'VU' ? 'badge-amber' : 'badge-red'}`}>{b.conservationStatus}</span></td>
                          <td><span className="badge badge-default">{b.rarityLevel}</span></td>
                          <td>
                            <div className="action-btns">
                              <button
                                id={`admin-edit-bird-${b.id}`}
                                onClick={() => openEditBird(b)}
                                className="btn btn-ghost btn-sm"
                                title="Edit species"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                id={`admin-delete-bird-${b.id}`}
                                onClick={() => handleDeleteBird(b.id, b.commonName)}
                                className="btn btn-danger btn-sm"
                                title="Delete species"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* QUIZZES CRUD */}
            {activeTab === 'quizzes' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800 }}>Quiz Sets ({quizzes.length})</h2>
                </div>
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Quiz Title</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                        <th>Questions</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes.map(q => (
                        <tr key={q.id}>
                          <td>
                            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.2rem' }}>{q.title}</div>
                            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{q.description.slice(0, 60)}…</div>
                          </td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{q.category}</td>
                          <td><span className={`badge ${q.difficulty === 'Expert' ? 'badge-red' : q.difficulty === 'Intermediate' ? 'badge-amber' : 'badge-green'}`}>{q.difficulty}</span></td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', fontWeight: 600 }}>{q.questions.length}</td>
                          <td>
                            <div className="action-btns">
                              <button id={`admin-view-quiz-${q.id}`} className="btn btn-ghost btn-sm" title="View questions">
                                <Eye size={12} />
                              </button>
                              <button
                                id={`admin-delete-quiz-${q.id}`}
                                onClick={() => handleDeleteQuiz(q.id, q.title)}
                                className="btn btn-danger btn-sm"
                                title="Delete quiz"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>User Accounts ({users.length})</h2>
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>XP</th>
                        <th>Quizzes</th>
                        <th>Avg Score</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.8125rem' }}>{u.name}</td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>
                              {u.role === 'admin' ? 'Admin' : 'Member'}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{u.joinDate}</td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.8125rem' }}>{u.xp}</td>
                          <td style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>{u.quizCount}</td>
                          <td>
                            {u.quizCount > 0 ? (
                              <span className={`badge ${u.avgScore >= 80 ? 'badge-green' : u.avgScore >= 60 ? 'badge-amber' : 'badge-red'}`}>{u.avgScore}%</span>
                            ) : (
                              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>—</span>
                            )}
                          </td>
                          <td>
                            {u.role !== 'admin' && (
                              <button
                                id={`admin-delete-user-${u.id}`}
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="btn btn-danger btn-sm"
                                title="Delete user"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bird Modal ── */}
      {birdModal.open && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="bird-modal-title">
          <div className="modal">
            <div className="modal-header">
              <h3 id="bird-modal-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700 }}>
                {birdModal.mode === 'edit' ? `Edit: ${birdModal.bird?.commonName}` : 'Add New Bird Species'}
              </h3>
              <button onClick={() => setBirdModal({ open: false, mode: 'create' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={18} />
              </button>
            </div>
            <form id="bird-crud-form" onSubmit={handleSaveBird}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { name: 'commonName', label: 'Common Name', placeholder: 'Northern Cardinal' },
                  { name: 'scientificName', label: 'Scientific Name (Binomial)', placeholder: 'Cardinalis cardinalis' },
                  { name: 'order', label: 'Taxonomic Order', placeholder: 'Passeriformes' },
                  { name: 'family', label: 'Family', placeholder: 'Cardinalidae' },
                  { name: 'genus', label: 'Genus', placeholder: 'Cardinalis' },
                  { name: 'imageUrl', label: 'Image URL (optional)', placeholder: 'https://...' },
                ].map(f => (
                  <div key={f.name} className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor={`bird-field-${f.name}`} className="form-label">{f.label}</label>
                    <input
                      id={`bird-field-${f.name}`}
                      name={f.name}
                      value={(birdForm as any)[f.name]}
                      onChange={handleBirdFormChange}
                      placeholder={f.placeholder}
                      className={`form-input ${birdErrors[f.name] ? 'error' : ''}`}
                    />
                    {birdErrors[f.name] && <p className="form-error">{birdErrors[f.name]}</p>}
                  </div>
                ))}

                {/* Select fields */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="bird-conservation" className="form-label">Conservation Status</label>
                  <select id="bird-conservation" name="conservationStatus" value={birdForm.conservationStatus} onChange={handleBirdFormChange} className="form-input">
                    {(['LC','NT','VU','EN','CR','EW','EX'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="bird-rarity" className="form-label">Rarity Level</label>
                  <select id="bird-rarity" name="rarityLevel" value={birdForm.rarityLevel} onChange={handleBirdFormChange} className="form-input">
                    {['Common','Uncommon','Rare','Vagrant'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="bird-migration" className="form-label">Migration Status</label>
                  <select id="bird-migration" name="migrationStatus" value={birdForm.migrationStatus} onChange={handleBirdFormChange} className="form-input">
                    {['Resident','Neotropical Migrant','Short-Distance Migrant','Nomadic','Irruptive'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Full-width textareas */}
                {[
                  { name: 'description', label: 'Description', placeholder: 'Detailed species description…' },
                  { name: 'habitat', label: 'Habitat (comma-separated)', placeholder: 'Woodlands, Gardens, Shrublands' },
                  { name: 'diet', label: 'Diet (comma-separated)', placeholder: 'Seeds, Berries, Insects' },
                  { name: 'keyFieldMarks', label: 'Key Field Marks (one per line)', placeholder: 'Bright red body\nDistinct head crest' },
                  { name: 'callDescription', label: 'Call Description', placeholder: 'Clear whistling "cheer, cheer, cheer"…' },
                  { name: 'funFact', label: 'Fun Fact', placeholder: 'An interesting biological fact…' },
                ].map(f => (
                  <div key={f.name} className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                    <label htmlFor={`bird-field-${f.name}`} className="form-label">{f.label}</label>
                    <textarea
                      id={`bird-field-${f.name}`}
                      name={f.name}
                      value={(birdForm as any)[f.name]}
                      onChange={handleBirdFormChange}
                      placeholder={f.placeholder}
                      rows={2}
                      className={`form-input ${birdErrors[f.name] ? 'error' : ''}`}
                      style={{ resize: 'vertical' }}
                    />
                    {birdErrors[f.name] && <p className="form-error">{birdErrors[f.name]}</p>}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setBirdModal({ open: false, mode: 'create' })} className="btn btn-ghost">Cancel</button>
                <button id="bird-modal-save-btn" type="submit" disabled={savingBird} className="btn btn-primary">
                  {savingBird ? 'Saving…' : birdModal.mode === 'edit' ? 'Update Species' : 'Create Species'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
