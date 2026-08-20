/**
 * AviLearn — Register Page
 * File: src/pages/RegisterPage.tsx
 * Description: New member registration with comprehensive client-side
 *              and server-side (mock) validation, password strength indicator.
 */

import React, { useState } from 'react';
import { Bird, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateRegisterForm, validatePassword } from '../lib/validation';

/* ── Internal styles ── */
const pageStyles = `
  .auth-split { display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 88px); }
  .auth-panel-art-reg { background: linear-gradient(160deg, #0f1a0a 0%, #1e2d18 50%, #2d3f26 100%); padding: 3rem; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
  .auth-panel-form { display: flex; align-items: flex-start; justify-content: center; padding: 2.5rem 3rem; background: var(--color-bg); overflow-y: auto; }
  .auth-form-card { width: 100%; max-width: 420px; }
  .strength-bar { height: 4px; border-radius: 9999px; transition: width 0.3s ease, background 0.3s ease; }
  .benefit-item { display: flex; align-items: flex-start; gap: 0.75rem; }
  @media (max-width: 767px) {
    .auth-split { grid-template-columns: 1fr; }
    .auth-panel-art-reg { display: none; }
    .auth-panel-form { padding: 2rem 1.5rem; }
  }
`;

const STRENGTH_COLORS = ['#DC2626', '#D97706', '#059669', '#059669'];
const STRENGTH_WIDTHS = ['25%', '50%', '75%', '100%'];

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = formData.password ? validatePassword(formData.password) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const next = { ...prev }; delete next[name]; return next; });
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation — all required fields, email format, password strength, match
    const validation = validateRegisterForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      // POST /api/auth/register — server-side validates unique email
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        onNavigate('dashboard');
      } else {
        // Server-side conflict error (e.g. duplicate email)
        setServerError(result.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Access to interactive self-assessment quizzes',
    'Personalized dashboard & performance tracking',
    'Life List journal — log every sighting',
    'AI-powered bird photo identification',
    'Anatomy lab & acoustic call library',
  ];

  return (
    <>
      <style>{pageStyles}</style>

      <div className="auth-split">
        {/* ── Art Panel ── */}
        <aside className="auth-panel-art-reg">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bird size={18} color="white" strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.15em', color: 'white', textTransform: 'uppercase' }}>AviLearn</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1rem' }}>
              Join the<br />
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)' }}>AviLearn Community</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '300px' }}>
              Free registration gives you access to the complete AviLearn platform.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {benefits.map(b => (
                <div key={b} className="benefit-item">
                  <CheckCircle2 size={16} color="#6B9F5E" strokeWidth={2} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <blockquote style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: '0.35rem' }}>
              "In every walk with Nature, one receives far more than he seeks."
            </p>
            <cite style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>
              — John Muir
            </cite>
          </blockquote>
        </aside>

        {/* ── Form Panel ── */}
        <main className="auth-panel-form">
          <div className="auth-form-card">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}>Create Account</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <button id="register-goto-login" onClick={() => onNavigate('login')} style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Sign in
                </button>
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            <form id="register-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Naturalist"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    aria-describedby={errors.name ? 'reg-name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && <p id="reg-name-error" className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="reg-email" className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem' }}
                    aria-describedby={errors.email ? 'reg-email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && <p id="reg-email-error" className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="reg-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    aria-describedby="reg-password-strength"
                    aria-invalid={!!errors.password}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {formData.password && passwordStrength && (
                  <div id="reg-password-strength" style={{ marginTop: '0.5rem' }}>
                    <div style={{ background: '#E5E2D9', borderRadius: '9999px', height: 4, overflow: 'hidden' }}>
                      <div
                        className="strength-bar"
                        style={{ width: STRENGTH_WIDTHS[passwordStrength.score], background: STRENGTH_COLORS[passwordStrength.score] }}
                      />
                    </div>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', marginTop: '0.3rem', color: STRENGTH_COLORS[passwordStrength.score], fontWeight: 600 }}>
                      {passwordStrength.label} — {passwordStrength.message}
                    </p>
                  </div>
                )}
                {errors.password && <p className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="reg-confirm-password" className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
                  <input
                    id="reg-confirm-password"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`form-input ${errors.confirmPassword ? 'error' : (formData.confirmPassword && formData.confirmPassword === formData.password ? '' : '')}`}
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Toggle confirm password">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error"><AlertCircle size={11} style={{ display: 'inline', marginRight: 4 }} />{errors.confirmPassword}</p>}
                {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-emerald)', fontWeight: 600, marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={12} /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms notice */}
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-subtle)', lineHeight: 1.55, marginBottom: '1rem' }}>
                By creating an account, you agree to AviLearn's Terms of Service and Privacy Policy. Your data is stored securely and never shared with third parties.
              </p>

              {/* Submit */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-full"
                style={{ padding: '0.875rem', fontSize: '0.8125rem' }}
              >
                {loading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Creating Account…
                  </span>
                ) : (
                  <>Create My Account <ArrowRight size={15} /></>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            <button id="register-guest-btn" onClick={() => onNavigate('home')} className="btn btn-ghost btn-full" style={{ marginTop: '1rem' }}>
              <Feather size={14} />
              Continue as Guest — Browse Only
            </button>
          </div>
        </main>
      </div>
    </>
  );
};
