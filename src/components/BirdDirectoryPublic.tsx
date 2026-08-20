/**
 * AviLearn — Public Bird Directory
 * File: src/components/BirdDirectoryPublic.tsx
 * Description: Publicly accessible bird species directory with search, filtering,
 *              image gallery, written articles, and audio samples. Available to all visitors.
 */

import React, { useState, useMemo } from 'react';
import { Search, Volume2, Filter, Bird, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BIRDS_DATABASE } from '../data/birdsDatabase';
import { BirdSpecies } from '../types';

/* ── Internal styles ── */
const pageStyles = `
  .dir-header { background: linear-gradient(135deg, #F7F5F0 0%, #E5E2D9 100%); border-bottom: 1px solid var(--color-border); padding: 2.5rem 0; }
  .species-card { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
  .species-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(0,0,0,0.1); }
  .species-card.expanded { transform: none; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .field-mark-pill { display: inline-flex; align-items: center; background: var(--color-surface-alt); border: 1px solid var(--color-border); padding: 0.25rem 0.625rem; font-family: var(--font-sans); font-size: 0.65rem; font-weight: 600; color: var(--color-text-muted); border-radius: 9999px; }
  .audio-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--color-accent); color: white; padding: 0.4rem 0.875rem; font-family: var(--font-sans); font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; border: none; border-radius: var(--radius-sm); transition: background 0.15s; }
  .audio-btn:hover { background: var(--color-accent-hover); }
  .audio-btn.playing { background: var(--color-emerald); animation: pulse-glow 1.5s ease-in-out infinite; }
  .filter-chip { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.3rem 0.75rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); font-family: var(--font-sans); font-size: 0.65rem; fontWeight: 600; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: all 0.15s; border-radius: 9999px; color: var(--color-text-muted); }
  .filter-chip.active { background: var(--color-accent); border-color: var(--color-accent); color: white; }
  .filter-chip:hover:not(.active) { background: var(--color-accent-light); border-color: var(--color-accent); color: var(--color-accent); }
`;

const statusColors: Record<string, string> = {
  LC: 'badge-green', NT: 'badge-blue', VU: 'badge-amber', EN: 'badge-red', CR: 'badge-red',
};

const rarityColors: Record<string, string> = {
  Common: 'badge-green', Uncommon: 'badge-amber', Rare: 'badge-red', Vagrant: 'badge-purple',
};

export const BirdDirectoryPublic: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const [filterOrder, setFilterOrder] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const allOrders = useMemo(() => [...new Set(BIRDS_DATABASE.map(b => b.order))], []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BIRDS_DATABASE.filter(b => {
      const matchSearch = !q
        || b.commonName.toLowerCase().includes(q)
        || b.scientificName.toLowerCase().includes(q)
        || b.order.toLowerCase().includes(q)
        || b.family.toLowerCase().includes(q)
        || b.description.toLowerCase().includes(q);
      const matchStatus = !filterStatus || b.conservationStatus === filterStatus;
      const matchRarity = !filterRarity || b.rarityLevel === filterRarity;
      const matchOrder = !filterOrder || b.order === filterOrder;
      return matchSearch && matchStatus && matchRarity && matchOrder;
    });
  }, [search, filterStatus, filterRarity, filterOrder]);

  const playCall = (bird: BirdSpecies) => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx || !bird.audioFrequencyHz) return;

    setPlayingId(bird.id);
    const ctx = new AudioCtx();
    const freq = bird.audioFrequencyHz;
    const pattern = bird.callPattern || 'chirp-repeat';

    const tone = (f: number, start: number, dur: number, gain = 0.28) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + start);
      if (pattern === 'whistle-slide') {
        osc.frequency.linearRampToValueAtTime(f * 1.35, ctx.currentTime + start + dur * 0.5);
        osc.frequency.linearRampToValueAtTime(f, ctx.currentTime + start + dur);
      }
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.04);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    };

    if (pattern === 'chirp-repeat') { for (let i = 0; i < 5; i++) tone(freq, i * 0.22, 0.14); }
    else if (pattern === 'trill') { for (let i = 0; i < 10; i++) tone(freq + (i % 2) * 180, i * 0.09, 0.07); }
    else if (pattern === 'hoot-rhythm') { [0, 0.7, 1.4, 2.0].forEach(s => tone(freq, s, 0.45)); }
    else if (pattern === 'rapid-peck') { for (let i = 0; i < 8; i++) tone(freq + i * 40, i * 0.12, 0.08); }
    else { tone(freq, 0, 0.4); tone(freq * 1.25, 0.45, 0.35); tone(freq, 0.85, 0.4); }

    setTimeout(() => setPlayingId(null), 1800);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus(null);
    setFilterRarity(null);
    setFilterOrder(null);
  };

  const hasFilters = search || filterStatus || filterRarity || filterOrder;

  return (
    <>
      <style>{pageStyles}</style>

      {/* ── Directory Header ── */}
      <div className="dir-header">
        <div className="container">
          <p className="section-eyebrow">Field Reference</p>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>Bird Species Directory</h1>
          <p className="section-subtitle" style={{ marginBottom: '1.75rem' }}>
            Browse {BIRDS_DATABASE.length} documented bird species with taxonomy, field marks, audio calls, and conservation data.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '520px', marginBottom: '1.25rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)', pointerEvents: 'none' }} />
            <input
              id="directory-search"
              type="search"
              placeholder="Search by name, family, order, or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.75rem', paddingRight: search ? '2.5rem' : '1rem', background: 'white', maxWidth: '100%' }}
              aria-label="Search bird species"
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={13} color="var(--color-text-subtle)" />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-subtle)', marginRight: '0.25rem' }}>Filter:</span>

            {(['LC','VU','EN'] as const).map(s => (
              <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(filterStatus === s ? null : s)}>
                {s}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
            {['Common','Uncommon','Rare'].map(r => (
              <button key={r} className={`filter-chip ${filterRarity === r ? 'active' : ''}`} onClick={() => setFilterRarity(filterRarity === r ? null : r)}>
                {r}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} className="filter-chip" style={{ marginLeft: '0.25rem' }}>
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container" style={{ paddingBlock: '2.5rem' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-subtle)', marginBottom: '1.25rem' }}>
          {filtered.length} species {hasFilters ? 'matched' : 'in database'}
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-subtle)' }}>
            <Bird size={40} color="var(--color-border-strong)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Species Found</h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem' }}>Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn btn-outline" style={{ marginTop: '1rem' }}>Clear All Filters</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(bird => {
              const isExpanded = expandedId === bird.id;
              return (
                <article
                  key={bird.id}
                  className={`card species-card ${isExpanded ? 'expanded' : ''}`}
                  style={{ overflow: 'hidden' }}
                  aria-expanded={isExpanded}
                >
                  {/* ── Card header (always visible) ── */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : bird.id)}
                    style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1.25rem', padding: '1.25rem', alignItems: 'center', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setExpandedId(isExpanded ? null : bird.id)}
                  >
                    {/* Thumbnail */}
                    <div style={{ width: 100, height: 70, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#1e2d18', flexShrink: 0 }}>
                      {bird.imageUrl ? (
                        <img src={bird.imageUrl} alt={bird.commonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bird size={24} color="rgba(255,255,255,0.2)" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700 }}>{bird.commonName}</h2>
                        <span className={`badge ${statusColors[bird.conservationStatus] || 'badge-default'}`}>{bird.conservationStatus}</span>
                        <span className={`badge ${rarityColors[bird.rarityLevel] || 'badge-default'}`}>{bird.rarityLevel}</span>
                      </div>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--color-text-subtle)', marginBottom: '0.35rem' }}>{bird.scientificName}</p>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}><strong>Order:</strong> {bird.order}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}><strong>Family:</strong> {bird.family}</span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}><strong>Migration:</strong> {bird.migrationStatus}</span>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div style={{ color: 'var(--color-text-subtle)' }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* ── Expanded content (article) ── */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--color-border)', padding: '1.5rem 1.25rem', background: 'var(--color-surface-alt)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: bird.imageUrl ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                        {/* Left: article text */}
                        <div>
                          {/* Description article */}
                          <section aria-label={`About ${bird.commonName}`}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>About This Species</h3>
                            <p style={{ fontFamily: 'var(--font-news)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.75, marginBottom: '1.25rem' }}>{bird.description}</p>
                          </section>

                          {/* Field marks */}
                          <section aria-label="Key Field Marks">
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>Key Field Marks</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                              {bird.keyFieldMarks.map(mark => (
                                <span key={mark} className="field-mark-pill">{mark}</span>
                              ))}
                            </div>
                          </section>

                          {/* Audio call */}
                          <section aria-label="Bird Call Audio">
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.5rem' }}>Vocalization & Call</h3>
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{bird.callDescription}</p>
                            {bird.audioFrequencyHz && (
                              <button
                                id={`dir-play-call-${bird.id}`}
                                className={`audio-btn ${playingId === bird.id ? 'playing' : ''}`}
                                onClick={() => playCall(bird)}
                                aria-label={`${playingId === bird.id ? 'Playing' : 'Play'} ${bird.commonName} call`}
                              >
                                <Volume2 size={13} />
                                {playingId === bird.id ? 'Playing Call…' : '▶ Play Bird Call'}
                              </button>
                            )}
                          </section>
                        </div>

                        {/* Right: image + data */}
                        <div>
                          {bird.imageUrl && (
                            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '1.25rem' }}>
                              <img src={bird.imageUrl} alt={bird.commonName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}

                          {/* Data grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {[
                              { label: 'Habitat', value: bird.habitat.slice(0, 2).join(', ') },
                              { label: 'Diet', value: bird.diet.slice(0, 2).join(', ') },
                              { label: 'Region', value: bird.region[0] || '—' },
                              { label: 'Nesting', value: bird.nesting?.slice(0, 60) + '…' },
                            ].map(d => (
                              <div key={d.label} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-subtle)', marginBottom: '0.25rem' }}>{d.label}</p>
                                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'var(--color-text-primary)' }}>{d.value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Fun fact */}
                          {bird.funFact && (
                            <div style={{ marginTop: '0.75rem', background: 'var(--color-amber-light)', border: '1px solid var(--color-amber)', borderRadius: 'var(--radius-md)', padding: '0.875rem' }}>
                              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-amber)', marginBottom: '0.35rem' }}>🦅 Fun Fact</p>
                              <p style={{ fontFamily: 'var(--font-news)', fontStyle: 'italic', fontSize: '0.8125rem', color: '#92400e', lineHeight: 1.6 }}>{bird.funFact}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
