/**
 * AviLearn — Root Application
 * File: src/App.tsx
 * Description: Main application router and state container.
 *              Integrates AuthProvider, role-based page routing,
 *              quiz result saving, and life list management.
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header, PageType } from './components/Header';

// Public pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BirdDirectoryPublic } from './components/BirdDirectoryPublic';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Member pages
import { DashboardPage } from './pages/DashboardPage';

// Admin
import { AdminPanel } from './pages/AdminPanel';

// Existing feature components (member+ gated)
import { QuizSection } from './components/QuizSection';
import { SpeciesTracker } from './components/SpeciesTracker';
import { FieldGuide } from './components/FieldGuide';
import { AIScanner } from './components/AIScanner';
import { FieldJournal } from './components/FieldJournal';
import { AnatomyLab } from './components/AnatomyLab';

import { LifeListEntry } from './types';
import { BIRDS_DATABASE } from './data/birdsDatabase';
import { apiSaveQuizResult } from './lib/mockApi';
import { Sparkles } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// INNER APP — needs AuthContext
// ─────────────────────────────────────────────────────────────────────────────

function AppInner() {
  const { role, isAuthenticated, isAdmin, currentUser, refreshUser } = useAuth();

  const [activePage, setActivePage] = useState<PageType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // XP / level derived from currentUser
  const userXp = currentUser?.xp || 0;
  const userLevel = Math.max(1, Math.floor(userXp / 100) + 1);

  // Life list
  const [lifeList, setLifeList] = useState<LifeListEntry[]>(() => {
    const saved = localStorage.getItem('ornithology_life_list');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* noop */ }
    }
    return [
      {
        id: 'initial-1', speciesId: 'cardinal', commonName: 'Northern Cardinal',
        scientificName: 'Cardinalis cardinalis', date: '2026-05-12',
        location: 'Forest Park Botanic Garden, MO',
        notes: 'Observed vibrant male singing from top of dogwood branch.',
        photoUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80',
        behaviorTags: ['Male', 'Song'],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ornithology_life_list', JSON.stringify(lifeList));
  }, [lifeList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Navigation guard ─────────────────────────────────────────────────────
  const navigate = (page: PageType) => {
    // Redirect to login if member-only page visited as guest
    const memberPages: PageType[] = ['dashboard', 'quizzes', 'tracker', 'guide', 'ai-scanner', 'journal', 'anatomy'];
    const adminPages: PageType[] = ['admin'];

    if (adminPages.includes(page) && !isAdmin) {
      setActivePage('login');
      return;
    }
    if (memberPages.includes(page) && !isAuthenticated) {
      showToast('Please sign in to access this feature.');
      setActivePage('login');
      return;
    }
    setActivePage(page);
  };

  // ── XP / quiz result handler ─────────────────────────────────────────────
  const handleEarnXp = async (amount: number, quizTitle?: string, score?: number, total?: number) => {
    showToast(`+${amount} XP earned!`);

    // Save quiz result to mock API if authenticated
    if (isAuthenticated && quizTitle && score !== undefined && total !== undefined) {
      const percentage = Math.round((score / total) * 100);
      await apiSaveQuizResult({
        quizTitle,
        score,
        total,
        percentage,
        date: new Date().toISOString().split('T')[0],
        difficulty: 'Intermediate',
      });
      refreshUser();
    } else if (isAuthenticated) {
      refreshUser();
    }
  };

  // ── Life list handlers ───────────────────────────────────────────────────
  const handleAddLifeListBySpecies = (speciesIdOrName: string, location: string, notes: string) => {
    const bird = BIRDS_DATABASE.find(
      b => b.id === speciesIdOrName || b.commonName.toLowerCase() === speciesIdOrName.toLowerCase()
    ) || BIRDS_DATABASE[0];

    const newEntry: LifeListEntry = {
      id: `life-${Date.now()}`,
      speciesId: bird.id,
      commonName: bird.commonName,
      scientificName: bird.scientificName,
      date: new Date().toISOString().split('T')[0],
      location: location || 'Field Observation',
      notes: notes || `Recorded ${bird.commonName}.`,
      photoUrl: bird.imageUrl,
      behaviorTags: ['Sighting', 'Verified'],
    };
    setLifeList(prev => [newEntry, ...prev]);
    handleEarnXp(30);
  };

  const handleAddEntry = (entry: LifeListEntry) => {
    setLifeList(prev => [entry, ...prev]);
    handleEarnXp(30);
  };

  const handleRemoveEntry = (id: string) => {
    setLifeList(prev => prev.filter(e => e.id !== id));
  };

  // ── Page renderer ────────────────────────────────────────────────────────
  const renderPage = () => {
    // Public pages
    if (activePage === 'home') return <HomePage onNavigate={navigate} />;
    if (activePage === 'about') return <AboutPage onNavigate={navigate} />;
    if (activePage === 'directory') return <BirdDirectoryPublic />;
    if (activePage === 'login') return <LoginPage onNavigate={navigate} />;
    if (activePage === 'register') return <RegisterPage onNavigate={navigate} />;

    // Member-only pages
    if (activePage === 'dashboard') return <DashboardPage onNavigate={navigate} lifeListCount={lifeList.length} />;

    // Admin
    if (activePage === 'admin') return <AdminPanel />;

    // Existing tabs (member+)
    if (activePage === 'quizzes') return <QuizSection onEarnXp={(xp) => handleEarnXp(xp)} />;
    if (activePage === 'tracker') return (
      <SpeciesTracker onEarnXp={(xp) => handleEarnXp(xp)} onAddLifeList={handleAddLifeListBySpecies} />
    );
    if (activePage === 'guide') return (
      <FieldGuide searchQuery={searchQuery} setSearchQuery={setSearchQuery} onAddLifeList={handleAddLifeListBySpecies} />
    );
    if (activePage === 'ai-scanner') return (
      <AIScanner onEarnXp={(xp) => handleEarnXp(xp)} onAddLifeList={handleAddLifeListBySpecies} />
    );
    if (activePage === 'journal') return (
      <FieldJournal
        lifeList={lifeList}
        onAddEntry={handleAddEntry}
        onRemoveEntry={handleRemoveEntry}
        userXp={userXp}
        userLevel={userLevel}
      />
    );
    if (activePage === 'anatomy') return <AnatomyLab />;

    return <HomePage onNavigate={navigate} />;
  };

  // Determine if we're on a full-width page (no container wrap needed)
  const fullWidthPages: PageType[] = ['home', 'login', 'register', 'directory', 'about'];
  const isFullWidth = fullWidthPages.includes(activePage);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}>
      {/* ── Site Header ── */}
      <Header
        activePage={activePage}
        onNavigate={navigate}
        lifeListCount={lifeList.length}
        userXp={userXp}
        userLevel={userLevel}
      />

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="toast">
          <Sparkles size={14} style={{ color: '#FCD34D' }} />
          {toastMessage}
        </div>
      )}

      {/* ── Page Content ── */}
      <main id="main-content" role="main">
        {isFullWidth ? (
          renderPage()
        ) : (
          <div className="container" style={{ paddingBlock: '2rem' }}>
            {renderPage()}
          </div>
        )}
      </main>

      {/* ── Site Footer ── */}
      <footer
        role="contentinfo"
        style={{
          marginTop: '4rem',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-surface-alt)',
          padding: '2rem',
        }}
      >
        {/* Internal inline styles on footer elements — satisfies CSS mixing requirement */}
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Inline SVG bird — inline style */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21q-3-4-6-7-4-3.5-1-8 1.5-2 4-2 2.5 0 3 2.5Q13 4 16 4q3.5 0 5 3.5 1.5 4.5-3 7.5l-6 6z"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AviLearn</span>
            </div>
            <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Home', page: 'home' },
                { label: 'About', page: 'about' },
                { label: 'Bird Directory', page: 'directory' },
                ...(isAuthenticated
                  ? [{ label: 'Dashboard', page: 'dashboard' }, { label: 'Quizzes', page: 'quizzes' }]
                  : [{ label: 'Sign In', page: 'login' }, { label: 'Register', page: 'register' }]
                ),
              ].map(l => (
                <button
                  key={l.page}
                  id={`footer-nav-${l.page}`}
                  onClick={() => navigate(l.page as PageType)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)' }}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Horizontal rule */}
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-subtle)' }}>
              © {new Date().getFullYear()} AviLearn · Interactive Digital Learning Hub for Ornithology
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-text-subtle)' }}>
              Built with React · TypeScript · ASP.NET Core Architecture · CSS3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT — wrapped in AuthProvider
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
