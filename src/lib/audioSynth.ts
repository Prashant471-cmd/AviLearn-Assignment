// Web Audio API bird sound synthesizer for interactive sound quizzes & field guide audio preview

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playBirdCallSound(
  baseFreqHz: number = 1200,
  pattern: 'trill' | 'chirp-repeat' | 'hoot-rhythm' | 'whistle-slide' | 'rapid-peck' = 'whistle-slide'
) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.3, now);
    masterGain.connect(ctx.destination);

    if (pattern === 'whistle-slide') {
      // Clean sliding whistle like Cardinal or Osprey
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.4;
        const duration = 0.28;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreqHz * 0.8, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreqHz * 1.35, startTime + duration * 0.7);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } else if (pattern === 'chirp-repeat') {
      // Rapid bright chirps like Goldfinch or Peregrine falcon
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.15;
        const duration = 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreqHz * 1.2, startTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreqHz * 0.7, startTime + duration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } else if (pattern === 'hoot-rhythm') {
      // Deep resonant owl/heron hooting pattern
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const duration = 1.2;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreqHz, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreqHz * 0.85, now + duration);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } else if (pattern === 'rapid-peck') {
      // Mechanical rattling like Belted Kingfisher or Pileated Woodpecker
      for (let i = 0; i < 12; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.05;
        const duration = 0.03;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(baseFreqHz, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }
    } else {
      // Trill (Hummingbird/Warbler)
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      const duration = 0.8;

      lfo.frequency.value = 18; // 18Hz vibrato trill
      lfoGain.gain.value = 150;
      lfo.connect(osc.frequency);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreqHz, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      lfo.start(now);
      osc.start(now);

      lfo.stop(now + duration);
      osc.stop(now + duration);
    }
  } catch (err) {
    console.warn("Audio Context playback error:", err);
  }
}
