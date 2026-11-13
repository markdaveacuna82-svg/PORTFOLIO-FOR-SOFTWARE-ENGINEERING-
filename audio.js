/**
 * Demon Slayer Portfolio - Sound Engine & Ambient Japanese Music Generator
 * Built using the Web Audio API for zero-dependency, ultra-fast, 100% offline-ready audio.
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.isPlayingBgm = false;
        this.bgmTimer = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.sfxGain = null;

        // Traditional Japanese Pentatonic Scale (Insen Scale based on D: D, Eb, G, A, C)
        this.kotoNotes = [
            146.83, 155.56, 196.00, 220.00, 261.63, // D3, Eb3, G3, A3, C4
            293.66, 311.13, 392.00, 440.00, 523.25, // D4, Eb4, G4, A4, C5
            587.33, 622.25, 783.99, 880.00          // D5, Eb5, G5, A5
        ];

        this.melodyPatterns = [
            [0, 2, 4, 3, 2, 0],
            [5, 7, 8, 7, 5, 4, 2],
            [2, 4, 5, 7, 9, 8, 7],
            [9, 8, 7, 5, 4, 2, 0, 2]
        ];

        this.patternIndex = 0;
        this.noteIndex = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return false;
            this.ctx = new AudioContext();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
            this.sfxGain.connect(this.masterGain);

            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
            this.bgmGain.connect(this.masterGain);
        }

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return true;
    }

    toggleBgm() {
        this.init();
        if (this.isPlayingBgm) {
            this.stopBgm();
            return false;
        } else {
            this.startBgm();
            return true;
        }
    }

    startBgm() {
        if (this.isPlayingBgm) return;
        this.isPlayingBgm = true;
        this.playNextKotoNote();
    }

    stopBgm() {
        this.isPlayingBgm = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    // Synthesizes a plucked Koto / Biwa note
    playKotoNote(freq, time, duration = 1.6) {
        if (!this.ctx || !this.isPlayingBgm) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc2.type = 'sine';

        osc.frequency.setValueAtTime(freq, time);
        // Slight microtonal warmth
        osc2.frequency.setValueAtTime(freq * 2.01, time);

        // Filter envelope for sharp pluck then mellow body
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, time);
        filter.frequency.exponentialRampToValueAtTime(320, time + duration);

        // Pluck volume envelope
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.28, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + duration);
        osc2.stop(time + duration);
    }

    // Synthesizes a deep Japanese Taiko drum pulse
    playTaikoBeat(time) {
        if (!this.ctx || !this.isPlayingBgm) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, time);
        osc.frequency.exponentialRampToValueAtTime(38, time + 0.35);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.55);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(time);
        osc.stop(time + 0.6);
    }

    playNextKotoNote() {
        if (!this.isPlayingBgm || !this.ctx) return;

        const now = this.ctx.currentTime;
        const currentPattern = this.melodyPatterns[this.patternIndex];
        const noteIndexInScale = currentPattern[this.noteIndex];
        const freq = this.kotoNotes[noteIndexInScale % this.kotoNotes.length];

        this.playKotoNote(freq, now, 1.8);

        // Every 4 notes, add subtle taiko drum pulse
        if (this.noteIndex % 4 === 0) {
            this.playTaikoBeat(now);
        }

        this.noteIndex++;
        if (this.noteIndex >= currentPattern.length) {
            this.noteIndex = 0;
            this.patternIndex = (this.patternIndex + 1) % this.melodyPatterns.length;
        }

        const delays = [420, 560, 700, 840];
        const nextDelay = delays[Math.floor(Math.random() * delays.length)];

        this.bgmTimer = setTimeout(() => {
            this.playNextKotoNote();
        }, nextDelay);
    }

    // Katana Nichirin Blade Slash SFX
    playKatanaSlash() {
        if (!this.init()) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.22;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(3600, now + 0.08);
        filter.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        filter.Q.setValueAtTime(3.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        // Katana metallic ring tone
        const tone = this.ctx.createOscillator();
        tone.type = 'triangle';
        tone.frequency.setValueAtTime(1480, now);
        tone.frequency.exponentialRampToValueAtTime(820, now + 0.18);

        const toneGain = this.ctx.createGain();
        toneGain.gain.setValueAtTime(0.08, now);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        tone.connect(toneGain);
        toneGain.connect(this.sfxGain);

        noise.start(now);
        tone.start(now);
        noise.stop(now + 0.23);
        tone.stop(now + 0.23);
    }

    // Water Breathing Drip / Harmonic Wave SFX
    playWaterChime() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.08); // Jump to E6 like a droplet
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    // Thunder Breathing Lightning Snap SFX
    playThunderSnap() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Subtle menu / button click
    playUiClick() {
        if (!this.init()) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.07);
    }
}

// Global sound singleton
window.soundEngine = new SoundEngine();
