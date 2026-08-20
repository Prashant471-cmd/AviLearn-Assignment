/**
 * AviLearn — Site Header & Navigation
 * File: src/components/Header.tsx
 * Description: Role-aware sticky navigation bar. Shows different links
 *              based on user role (guest | member | admin).
 *              Responsive hamburger menu for mobile.
 */

import React, { useState, useEffect } from 'react';
import { Bird, Menu, X, LogIn, LogOut, UserPlus, LayoutDashboard, Shield, BookOpen, Home, Info, Award, MapPin, Notebook, Compass, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PageType =
  | 'home' | 'about' | 'directory' | 'login' | 'register' | 'dashboard' | 'admin'
  | 'quizzes' | 'tracker' | 'guide' | 'ai-scanner' | 'journal' | 'anatomy';

// Legacy TabType export for compatibility
export type TabType = PageType;

interface HeaderProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  lifeListCount?: number;
  userXp?: number;
  userLevel?: number;
}

/* ── Internal header styles ── */
const headerStyles = `
  .hamburger-btn { display: none; }
  @media (max-width: 900px) {
    .desktop-nav { display: none; }
    .hamburger-btn { display: flex; }
    .mobile-nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 150; }
  }
  .nav-divider { width: 1px; height: 16px; background: var(--color-border-strong); margin: 0 0.25rem; }
`;

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  lifeListCount = 0,
  userXp = 0,
  userLevel = 1,
}) => {
  const { currentUser, role, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [activePage]);

  const xpProgress = Math.min(100, Math.round((userXp / (userLevel * 100)) * 100));

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMobileOpen(false);
  };

  // ── Navigation config by role ─────────────────────────────────────────────

  const publicNav = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'about' as PageType, label: 'About', icon: Info },
    { id: 'directory' as PageType, label: 'Bird Directory', icon: Bird },
  ];

  const memberNav = [
    { id: 'home' as PageType, label: 'Home', icon: Home },
    { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory' as PageType, label: 'Bird Directory', icon: Bird },
    { id: 'quizzes' as PageType, label: 'Quizzes', icon: Award },
    { id: 'guide' as PageType, label: 'Field Guide', icon: BookOpen },
    { id: 'tracker' as PageType, label: 'Live Tracker', icon: MapPin },
    { id: 'journal' as PageType, label: 'Life List', icon: Notebook },
    { id: 'ai-scanner' as PageType, label: 'AI Scanner', icon: Sparkles },
    { id: 'anatomy' as PageType, label: 'Anatomy Lab', icon: Compass },
  ];

  const adminNav = [
    ...memberNav,
    { id: 'admin' as PageType, label: 'Admin Panel', icon: Shield },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'member' ? memberNav : publicNav;

  const NavLink: React.FC<{ page: PageType; label: string; icon: React.ElementType; mobile?: boolean }> = ({
    page, label, icon: Icon, mobile = false,
  }) => {
    const isActive = activePage === page;
    return mobile ? (
      <button
        id={`mobile-nav-${page}`}
        onClick={() => handleNavigate(page)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%',
          padding: '0.875rem 1rem', background: isActive ? 'var(--color-accent-light)' : 'transparent',
          border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: isActive ? 700 : 500,
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)', textAlign: 'left',
        }}
      >
        <Icon size={17} />
        {label}
        {page === 'admin' && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', background: 'var(--color-red)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 700 }}>Admin</span>}
      </button>
    ) : (
      <button
        id={`nav-${page}`}
        onClick={() => handleNavigate(page)}
        className={`nav-link ${isActive ? 'active' : ''}`}
        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon size={13} strokeWidth={isActive ? 2.5 : 1.5} />
        {label}
        {page === 'admin' && <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', background: 'var(--color-red)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 700 }}>ADMIN</span>}
      </button>
    );
  };

  return (
    <>
      <style>{headerStyles}</style>

      <header
        className={`site-header ${scrolled ? 'scrolled' : ''}`}
        style={{ '--header-height': '88px' } as React.CSSProperties}
        role="banner"
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '1.5rem', justifyContent: 'space-between' }}>
            {/* ── Brand ── */}
            <button
              id="nav-brand"
              onClick={() => handleNavigate('home')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
              aria-label="AviLearn Home"
            >
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', flexShrink: 0 }}>
                <Bird size={18} color="white" strokeWidth={2} />
              </div>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                  AviLearn
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-subtle)', marginTop: '0.15rem' }}>
                  Digital Learning Hub
                </div>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <nav id="main-nav" className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', overflow: 'hidden', flex: 1 }} aria-label="Main navigation">
              {navItems.slice(0, 7).map(n => (
                <NavLink key={n.id} page={n.id} label={n.label} icon={n.icon} />
              ))}
              {navItems.length > 7 && (
                <>
                  <div className="nav-divider" />
                  {navItems.slice(7).map(n => (
                    <NavLink key={n.id} page={n.id} label={n.label} icon={n.icon} />
                  ))}
                </>
              )}
            </nav>

            {/* ── Auth area ── */}
            <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              {isAuthenticated ? (
                <>
                  {/* XP badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', padding: '0.4rem 0.875rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Lvl {userLevel}
                      </div>
                      <div style={{ width: 56, height: 3, background: 'var(--color-accent-light)', borderRadius: '9999px', overflow: 'hidden', marginTop: '0.2rem' }}>
                        <div style={{ height: '100%', width: `${xpProgress}%`, background: 'var(--color-accent)', borderRadius: '9999px', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', color: 'var(--color-text-subtle)', fontVariantNumeric: 'tabular-nums' }}>{userXp} XP</span>
                  </div>

                  {/* User avatar / dashboard link */}
                  <button
                    id="nav-user-avatar"
                    onClick={() => handleNavigate('dashboard')}
                    style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '0.875rem', fontWeight: 900, border: 'none', cursor: 'pointer', transition: 'transform 0.15s' }}
                    title={`${currentUser?.name} — Dashboard`}
                    aria-label="Open dashboard"
                  >
                    {currentUser?.name?.charAt(0).toUpperCase() || <User size={14} />}
                  </button>

                  {/* Logout */}
                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm"
                    title="Sign out"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button id="nav-login-btn" onClick={() => handleNavigate('login')} className="btn btn-ghost btn-sm">
                    <LogIn size={13} /> Sign In
                  </button>
                  <button id="nav-register-btn" onClick={() => handleNavigate('register')} className="btn btn-primary btn-sm">
                    <UserPlus size={13} /> Register
                  </button>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              id="nav-hamburger"
              className="hamburger-btn"
              onClick={() => setMobileOpen(o => !o)}
              style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-primary)', flexShrink: 0 }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Drawer ── */}
      {mobileOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            style={{
              position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(320px, 85vw)',
              background: 'var(--color-bg)', zIndex: 200, padding: '1.25rem',
              boxShadow: 'var(--shadow-lg)', overflowY: 'auto', borderLeft: '1px solid var(--color-border)',
              animation: 'slideInRight 0.25s ease',
            }}
          >
            {/* Mobile header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bird size={18} color="var(--color-accent)" />
                <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1rem', letterSpacing: '0.1em' }}>AviLearn</span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}>
                <X size={18} />
              </button>
            </div>

            {/* User greeting */}
            {isAuthenticated && (
              <div style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.875rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Signed in as</p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 700 }}>{currentUser?.name}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-text-subtle)', marginTop: '0.1rem' }}>Level {userLevel} · {userXp} XP</p>
              </div>
            )}

            {/* Nav items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1.5rem' }}>
              {navItems.map(n => (
                <NavLink key={n.id} page={n.id} label={n.label} icon={n.icon} mobile />
              ))}
            </div>

            {/* Auth buttons */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isAuthenticated ? (
                <button id="mobile-logout-btn" onClick={handleLogout} className="btn btn-ghost btn-full">
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <>
                  <button id="mobile-login-btn" onClick={() => handleNavigate('login')} className="btn btn-primary btn-full">
                    <LogIn size={14} /> Sign In
                  </button>
                  <button id="mobile-register-btn" onClick={() => handleNavigate('register')} className="btn btn-ghost btn-full">
                    <UserPlus size={14} /> Create Account
                  </button>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
};
