/**
 * AviLearn — Login Page
 * File: src/pages/LoginPage.tsx
 * Description: Secure user authentication page with client-side and
 *              server-side validation. Supports member and admin login.
 */

import React, { useState } from 'react';
import { Bird, Mail, Lock, Eye, EyeOff, AlertCircle, Feather, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateLoginForm } from '../lib/validation';

/* ── Internal page styles ── */
const pageStyles = `
  .auth-split { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 88px); }
  .auth-panel-art { background: linear-gradient(160deg, #1a2012 0%, #2d3f26 50%, #3D4435 100%); padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
  .auth-panel-art::before { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E"); }
  .auth-panel-form { display: flex; align-items: center; justify-content: center; padding: 3rem; background: var(--color-bg); }
  .auth-form-card { width: 100%; max-width: 400px; }
  .demo-creds { background: var(--color-surface-alt); border: 1px solid var(--color-border); padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 0.75rem; }
  .demo-creds code { font-family: monospace; background: var(--color-accent-light); padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.7rem; }
  @media (max-width: 767px) {
    .auth-split { grid-template-columns: 1fr; }
    .auth-panel-art { display: none; }
    .auth-panel-form { padding: 2rem 1.5rem; align-items: flex-start; }
  }
`;

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation (JS check for required fields + email format)
    const validation = validateLoginForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // Calls mock API — mirrors POST /api/auth/login in ASP.NET Core
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onNavigate('dashboard');
      } else {
        // Server-side validation error
        setServerError(result.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setFormData({ email, password });
    setErrors({});
    setServerError('');
  };

  return (
    <>
      <style>{pageStyles}</style>

      <div className="auth-split">
        {/* ── Art Panel ── */}
        <aside className="auth-panel-art">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bird size={18} color="white" strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.15em', color: 'white', textTransform: 'uppercase' }}>AviLearn</span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.75rem', fontWeight: 900, color: 'white', lineHeight: 1.05, marginBottom: '1.25rem' }}>
              Welcome<br />
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>Back, Birder.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '320px' }}>
              Sign in to access your personalized dashboard, quiz history, and life list journal.
            </p>
          </div>

          {/* Bottom quote */}
          <blockquote style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: '0.5rem' }}>
              "A bird does not sing because it has an answer. It sings because it has a song."
            </p>
            <cite style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>
              — Joan Walsh Anglund
            </cite>
          </blockquote>
        </aside>

        {/* ── Form Panel ── */}
        <main className="auth-panel-form">
          <div className="auth-form-card">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>Sign In</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Don't have an account?{' '}
                <button id="login-goto-register" onClick={() => onNavigate('register')} style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Register free
                </button>
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="demo-creds" style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Demo Accounts:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Member: <code>member@avilearn.com</code> / <code>Member123!</code></span>
                  <button onClick={() => fillDemo('member@avilearn.com', 'Member123!')} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}>Fill</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Admin: <code>admin@avilearn.com</code> / <code>Admin123!</code></span>
                  <button onClick={() => fillDemo('admin@avilearn.com', 'Admin123!')} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none' }}>Fill</button>
                </div>
              </div>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Login Form */}
            <form id="login-form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <p id="login-email-error" className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p id="login-password-error" className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
                style={{ marginTop: '1.5rem', padding: '0.875rem', fontSize: '0.8125rem' }}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Signing in…
                  </span>
                ) : (
                  <>Sign In to AviLearn <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <button
              id="login-goto-home"
              onClick={() => onNavigate('home')}
              className="btn btn-ghost btn-full"
              style={{ marginTop: '1rem' }}
            >
              <Feather size={14} />
              Continue as Guest
            </button>

            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-subtle)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.5 }}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};
