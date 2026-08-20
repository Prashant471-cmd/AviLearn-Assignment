/**
 * AviLearn — About Page
 * File: src/pages/AboutPage.tsx
 * Description: Public informational page about AviLearn's mission, team,
 *              and the science of ornithology. Accessible to all visitors.
 */

import React from 'react';
import { Bird, BookOpen, Globe, Heart, Microscope, Users, Award, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Internal <style> block ── */
const pageStyles = `
  .about-hero { background: linear-gradient(160deg, #F7F5F0 0%, #E5E2D9 100%); }
  .team-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .team-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(0,0,0,0.08); }
  .timeline-item { position: relative; padding-left: 2rem; }
  .timeline-item::before {
    content: ''; position: absolute; left: 0; top: 0.35rem;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--color-accent); border: 2px solid var(--color-bg);
    box-shadow: 0 0 0 2px var(--color-accent);
  }
  .timeline-item::after {
    content: ''; position: absolute; left: 4px; top: 1.5rem;
    width: 2px; bottom: -1rem; background: var(--color-border-strong);
  }
  .timeline-item:last-child::after { display: none; }
  .mission-card { background: linear-gradient(135deg, #3D4435 0%, #2E3429 100%); color: white; }
  .value-item { border-top: 2px solid transparent; transition: border-color 0.2s; }
  .value-item:hover { border-top-color: var(--color-accent); }
`;

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAuth();

  const teamMembers = [
    {
      name: 'Dr. Evelyn Vance',
      role: 'Lead Ornithologist & Platform Director',
      bio: 'PhD in Avian Ecology from Cornell University. 20+ years of field research across North and Central America.',
      initials: 'EV',
      color: '#3D4435',
    },
    {
      name: 'Prof. James Hartley',
      role: 'Avian Taxonomy Specialist',
      bio: 'Former Curator of Birds at the Smithsonian. Expert in Passeriformes systematics and migratory behavior.',
      initials: 'JH',
      color: '#5C6B4F',
    },
    {
      name: 'Dr. Amara Chen',
      role: 'Bioacoustics Researcher',
      bio: 'Specializes in bird vocalization analysis and acoustic ecology. Developed AviLearn\'s audio identification curriculum.',
      initials: 'AC',
      color: '#7A8C6A',
    },
    {
      name: 'Rosa Méndez, MSc',
      role: 'Conservation Science Editor',
      bio: 'Conservation biologist with expertise in neotropical migratory species and IUCN Red List assessment methodology.',
      initials: 'RM',
      color: '#4A5E3C',
    },
  ];

  const milestones = [
    { year: '2021', title: 'AviLearn Founded', desc: 'Started as an ornithology study resource for undergraduate students.' },
    { year: '2022', title: 'Species Database Launch', desc: 'Published first curated database of 50+ North American bird species.' },
    { year: '2023', title: 'Interactive Quiz System', desc: 'Launched scored quiz modules covering field identification and avian anatomy.' },
    { year: '2024', title: 'AI Scanner Integration', desc: 'Integrated AI-powered bird photo identification and acoustic analysis tools.' },
    { year: '2025', title: 'Community Platform', desc: 'Opened registration for members worldwide; life list tracking and field journals.' },
    { year: '2026', title: 'Full Learning Hub', desc: 'Launched complete ornithology curriculum with admin tools, CRUD management, and advanced analytics.' },
  ];

  const values = [
    { icon: Microscope, title: 'Scientific Rigor', desc: 'All species data and educational content is reviewed by credentialed ornithologists using peer-reviewed sources.' },
    { icon: BookOpen, title: 'Open Access Education', desc: 'Core bird directory and learning content is freely available to all visitors — no account required.' },
    { icon: Globe, title: 'Conservation Awareness', desc: 'Every species profile includes IUCN conservation status and the ecological factors driving population trends.' },
    { icon: Heart, title: 'Inclusive Community', desc: 'From first-time backyard birders to advanced field researchers — AviLearn welcomes learners at every level.' },
  ];

  const techStack = [
    { label: 'Frontend', value: 'React + TypeScript (Semantic HTML5, CSS3)' },
    { label: 'Styling', value: 'External CSS (styles/avilearn.css) + Tailwind utilities + inline styles' },
    { label: 'Backend', value: 'ASP.NET Core (simulated) — Node/Express API layer' },
    { label: 'Database', value: 'Relational DB (MySQL architecture, LocalStorage simulation)' },
    { label: 'Authentication', value: 'Token-based auth with role-based access control' },
    { label: 'AI Features', value: 'Google Gemini Vision API for photo bird identification' },
  ];

  return (
    <>
      <style>{pageStyles}</style>

      {/* ── ABOUT HERO ────────────────────────────────────────────── */}
      <section className="about-hero section-sm">
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-accent)', color: 'white', padding: '0.3rem 1rem', borderRadius: '9999px', fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>
            <Feather size={12} />
            About AviLearn
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.25rem' }}>
            Bridging Bird Watching
            <span style={{ display: 'block', color: 'var(--color-accent)', fontStyle: 'italic' }}>& Ornithological Science</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            AviLearn is an interactive digital learning hub built to make the science of ornithology — the study of birds — accessible, engaging, and scientifically accurate for curious minds at every level of expertise.
          </p>
        </div>
      </section>

      {/* ── MISSION CARD ─────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-bg)', paddingBlock: '3rem' }}>
        <div className="container">
          <div className="mission-card" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', position: 'relative', overflow: 'hidden' }}>
            {/* Decorative */}
            <div style={{ position: 'absolute', right: '-3rem', top: '-3rem', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ position: 'absolute', right: '5rem', bottom: '-5rem', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Our Mission</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                Making Ornithology Education Universally Accessible
              </h2>
              <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                We believe that understanding birds — their taxonomy, behavior, habitat requirements, and conservation status — is essential for building environmental literacy. AviLearn provides the educational infrastructure to make this knowledge available online, at no cost, to anyone curious enough to look up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR VALUES ───────────────────────────────────────────── */}
      <section className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-eyebrow">Our Principles</p>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {values.map(v => (
              <div key={v.title} className="card value-item" style={{ padding: '1.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <v.icon size={20} color="var(--color-accent)" strokeWidth={1.5} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-eyebrow">The Experts</p>
            <h2 className="section-title">Meet the AviLearn Team</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>Our content is developed and curated by credentialed ornithologists, field researchers, and conservation scientists.</p>
          </div>
          <div className="grid-4" style={{ gap: '1.5rem' }}>
            {teamMembers.map(m => (
              <div key={m.name} className="card team-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: m.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 900, margin: '0 auto 1rem' }}>
                  {m.initials}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{m.name}</h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>{m.role}</p>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <p className="section-eyebrow">Our Story</p>
              <h2 className="section-title">AviLearn Milestones</h2>
              <p className="section-subtitle">From a student study tool to a full ornithology learning platform — our journey in building accessible bird science education.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {milestones.map(m => (
                <div key={m.year} className="timeline-item">
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>{m.year}</div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.25rem' }}>{m.title}</h4>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.55 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK (Assignment transparency) ─────────────────── */}
      <section style={{ background: 'var(--color-surface-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', paddingBlock: '2.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="section-eyebrow">Technical Architecture</p>
            <h2 className="section-title">Technology Stack</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {techStack.map(t => (
              <div key={t.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1.25rem' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--color-text-subtle)', marginBottom: '0.35rem' }}>{t.label}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{t.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="section" style={{ textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '560px' }}>
            <Bird size={40} color="var(--color-accent)" strokeWidth={1} style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="section-title">Ready to Start Learning?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>Register for a free AviLearn account to unlock quizzes, life list tracking, and your personalized dashboard.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button id="about-register-cta" onClick={() => onNavigate('register')} className="btn btn-primary btn-lg">
                <Users size={16} /> Create Free Account
              </button>
              <button id="about-explore-cta" onClick={() => onNavigate('directory')} className="btn btn-ghost btn-lg">
                Browse Bird Directory
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
