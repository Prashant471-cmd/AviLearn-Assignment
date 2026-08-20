/**
 * AviLearn — Home Page
 * File: src/pages/HomePage.tsx
 * Description: Public-facing landing page for unregistered visitors.
 *              Features hero section, featured birds, informational content,
 *              image gallery, and calls-to-action for registration.
 */

import React, { useState } from 'react';
import { Bird, BookOpen, Award, Users, ChevronRight, Volume2, Star, Feather, Globe, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BIRDS_DATABASE } from '../data/birdsDatabase';

/* ── Internal styles (satisfies CSS mixing requirement) ── */
const internalStyles = `
  .hero-birds-float { animation: float 6s ease-in-out infinite; }
  .hero-birds-float:nth-child(2) { animation-delay: -2s; }
  .hero-birds-float:nth-child(3) { animation-delay: -4s; }
  .feature-icon-ring {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #3D4435 0%, #6B7A5E 100%);
    box-shadow: 0 4px 12px rgba(61,68,53,0.3);
    flex-shrink: 0;
  }
  .bird-gallery-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .bird-gallery-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
  .stat-number { font-variant-numeric: tabular-nums; }
  .article-card { border-left: 3px solid #3D4435; }
  .audio-wave span {
    display: inline-block; width: 3px; background: currentColor;
    border-radius: 2px; animation: wave 1.2s ease-in-out infinite;
  }
  .audio-wave span:nth-child(2) { animation-delay: 0.2s; }
  .audio-wave span:nth-child(3) { animation-delay: 0.4s; }
  .audio-wave span:nth-child(4) { animation-delay: 0.6s; }
  .audio-wave span:nth-child(5) { animation-delay: 0.8s; }
`;

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const featuredBirds = BIRDS_DATABASE.slice(0, 6);

  // Web Audio API — synthetic bird call playback
  const playBirdCall = (birdId: string, freqHz: number, pattern: string) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    setPlayingId(birdId);
    const ctx = new AudioCtx();

    const playTone = (freq: number, start: number, dur: number, gain = 0.3) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      if (pattern === 'whistle-slide') {
        osc.frequency.linearRampToValueAtTime(freq * 1.3, ctx.currentTime + start + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(freq, ctx.currentTime + start + dur);
      }
      gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };

    if (pattern === 'chirp-repeat') {
      for (let i = 0; i < 4; i++) playTone(freqHz, i * 0.25, 0.15);
    } else if (pattern === 'trill') {
      for (let i = 0; i < 8; i++) playTone(freqHz + (i % 2) * 150, i * 0.1, 0.08);
    } else {
      playTone(freqHz, 0, 0.4);
      playTone(freqHz * 1.25, 0.45, 0.35);
      playTone(freqHz, 0.85, 0.4);
    }

    setTimeout(() => setPlayingId(null), 1400);
  };

  const features = [
    { icon: Bird, title: 'Bird Directory', desc: '12+ documented species with field marks, habitat ranges, and taxonomy.', page: 'directory' },
    { icon: BookOpen, title: 'Learning Articles', desc: 'Expert-written guides on migration, anatomy, and conservation.', page: 'about' },
    { icon: Award, title: 'Interactive Quizzes', desc: 'Test your identification skills with scored self-assessment quizzes.', page: 'quizzes' },
    { icon: Volume2, title: 'Audio Call Library', desc: 'Listen to synthesized bird calls and learn acoustic identification.', page: 'directory' },
    { icon: Globe, title: 'Flyway Maps', desc: 'Explore North American migration flyways and seasonal patterns.', page: 'tracker' },
    { icon: Shield, title: 'Conservation Data', desc: 'IUCN status and conservation facts for every species in our database.', page: 'directory' },
  ];

  const articles = [
    {
      tag: 'Migration', title: 'The Great Flyway Networks of North America',
      excerpt: 'Every autumn, billions of birds traverse four major flyways — Atlantic, Mississippi, Central, and Pacific — in one of nature\'s most spectacular long-distance migrations.',
      readTime: '5 min read',
    },
    {
      tag: 'Anatomy', title: 'The Physics of Avian Flight: How Wings Generate Lift',
      excerpt: 'Bird wings are not just flapping paddles — they are dynamic airfoils that generate lift through Bernoulli\'s principle, with each feather contributing to aerodynamic precision.',
      readTime: '7 min read',
    },
    {
      tag: 'Conservation', title: 'North American Bird Populations Down 3 Billion Since 1970',
      excerpt: 'A landmark Cornell Lab study found that North America has lost nearly 30% of its bird population in 50 years. Understanding the causes is the first step to reversing the trend.',
      readTime: '4 min read',
    },
  ];

  return (
    <>
      {/* Internal <style> block — satisfies CSS mixing requirement */}
      <style>{internalStyles}</style>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="hero" style={{ minHeight: '88vh', background: 'linear-gradient(135deg, #0f1a0a 0%, #1e2d18 40%, #2d3f26 70%, #3D4435 100%)' }}>
        {/* Decorative floating silhouettes */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="hero-birds-float"
              style={{
                position: 'absolute',
                fontSize: `${1.5 + i * 0.4}rem`,
                opacity: 0.06 + i * 0.02,
                top: `${10 + i * 12}%`,
                left: `${5 + i * 15}%`,
                animationDelay: `${i * -1}s`,
              }}
            >
              🐦
            </div>
          ))}
        </div>

        <div className="container" style={{ paddingBlock: '5rem' }}>
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bird size={16} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.45)' }}>
                Interactive Digital Learning Hub for Ornithology
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 0.95, color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Discover the
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>World of Birds</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
              AviLearn bridges amateur bird watching and rigorous ornithological study. Explore species taxonomy, acoustic identification, anatomy, and conservation science — all in one platform.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <button
                  id="home-goto-dashboard"
                  onClick={() => onNavigate('dashboard')}
                  className="btn btn-primary btn-lg"
                  style={{ background: 'white', color: '#1a2012', borderColor: 'white' }}
                >
                  <Star size={16} />
                  My Dashboard
                </button>
              ) : (
                <>
                  <button
                    id="home-register-cta"
                    onClick={() => onNavigate('register')}
                    className="btn btn-primary btn-lg"
                    style={{ background: 'white', color: '#1a2012', borderColor: 'white' }}
                  >
                    <Feather size={16} />
                    Join AviLearn — Free
                  </button>
                  <button
                    id="home-login-cta"
                    onClick={() => onNavigate('login')}
                    className="btn btn-outline btn-lg"
                    style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
                  >
                    Sign In
                  </button>
                </>
              )}
              <button
                id="home-explore-cta"
                onClick={() => onNavigate('directory')}
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)' }}
              >
                <BookOpen size={16} />
                Browse Bird Directory
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="container" style={{ display: 'flex', gap: '3rem', paddingBlock: '1rem', overflowX: 'auto' }}>
            {[
              { value: '12+', label: 'Species Documented' },
              { value: '3', label: 'Quiz Modules' },
              { value: '100%', label: 'Free Access' },
              { value: 'AI', label: 'Powered ID Scanner' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', flexShrink: 0 }}>
                <div className="stat-number" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-eyebrow">Platform Features</p>
            <h2 className="section-title" style={{ margin: '0.5rem auto', maxWidth: '520px' }}>Everything You Need to Learn Ornithology</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>From visual field ID to acoustic analysis — AviLearn makes bird science accessible for enthusiasts and students alike.</p>
          </div>

          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {features.map(f => (
              <div
                key={f.title}
                className="card bird-gallery-card"
                style={{ padding: '1.75rem', cursor: 'pointer' }}
                onClick={() => onNavigate(f.page)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && onNavigate(f.page)}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="feature-icon-ring">
                    <f.icon size={22} color="white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent)' }}>
                  <span>Explore</span><ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIRD GALLERY + AUDIO ──────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-eyebrow">Species Gallery</p>
              <h2 className="section-title" style={{ margin: 0 }}>Explore Featured Species</h2>
              <p className="section-subtitle" style={{ marginTop: '0.5rem' }}>Click the audio icon to hear synthesized bird calls.</p>
            </div>
            <button id="home-view-all-birds" onClick={() => onNavigate('directory')} className="btn btn-outline">
              View All Species <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid-3" style={{ gap: '1.25rem' }}>
            {featuredBirds.map(bird => (
              <div key={bird.id} className="card bird-gallery-card" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden', background: '#1e2d18' }}>
                  {bird.imageUrl ? (
                    <img
                      src={bird.imageUrl}
                      alt={bird.commonName}
                      className="card-image"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bird size={48} color="rgba(255,255,255,0.15)" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                  {/* Conservation badge */}
                  <span
                    className={`badge ${bird.conservationStatus === 'LC' ? 'badge-green' : bird.conservationStatus === 'VU' ? 'badge-amber' : 'badge-red'}`}
                    style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}
                  >
                    {bird.statusLabel}
                  </span>
                  {/* Audio button */}
                  {bird.audioFrequencyHz && (
                    <button
                      id={`play-call-${bird.id}`}
                      onClick={() => playBirdCall(bird.id, bird.audioFrequencyHz!, bird.callPattern || 'chirp-repeat')}
                      style={{
                        position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                        background: playingId === bird.id ? 'var(--color-accent)' : 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%', width: 36, height: 36,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      aria-label={`Play ${bird.commonName} call`}
                    >
                      {playingId === bird.id ? (
                        <div className="audio-wave" style={{ display: 'flex', gap: 2, alignItems: 'center', height: 16 }}>
                          {[10, 16, 12, 18, 10].map((h, i) => (
                            <span key={i} style={{ height: h }} />
                          ))}
                        </div>
                      ) : (
                        <Volume2 size={14} color="white" strokeWidth={1.5} />
                      )}
                    </button>
                  )}
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{bird.commonName}</h3>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--color-text-subtle)', marginBottom: '0.5rem' }}>{bird.scientificName}</p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {bird.description.slice(0, 100)}…
                  </p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-default">{bird.order}</span>
                    <span className={`badge ${bird.rarityLevel === 'Common' ? 'badge-green' : bird.rarityLevel === 'Rare' ? 'badge-red' : 'badge-amber'}`}>{bird.rarityLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFORMATIONAL ARTICLES ────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-eyebrow">Learning Resources</p>
            <h2 className="section-title">Ornithology Articles & Guides</h2>
          </div>
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {articles.map(a => (
              <article key={a.title} className="card article-card" style={{ padding: '1.5rem' }}>
                <span className="badge badge-default" style={{ marginBottom: '1rem' }}>{a.tag}</span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem' }}>{a.title}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{a.excerpt}</p>
                <div style={{ marginTop: '1rem', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {a.readTime}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION CTA ──────────────────────────────────────── */}
      {!isAuthenticated && (
        <section style={{ background: 'var(--gradient-hero)', padding: '5rem 0' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>
              Join the Community
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: '1rem', lineHeight: 1.1 }}>
              Start Your Ornithology Journey
            </h2>
            <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.65 }}>
              Register for free to unlock interactive quizzes, track your life list, and access your personalized dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id="home-bottom-register-cta"
                onClick={() => onNavigate('register')}
                className="btn btn-primary btn-lg"
                style={{ background: 'white', color: '#1a2012', borderColor: 'white' }}
              >
                <Users size={16} />
                Create Free Account
              </button>
              <button
                id="home-bottom-login-cta"
                onClick={() => onNavigate('login')}
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white' }}
              >
                Sign In to AviLearn
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
