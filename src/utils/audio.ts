class SoundSystem {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.preloadSFX();
  }

  private preloadSFX() {
    if (typeof window === 'undefined') return;
    const sfxList = [
      { key: 'bat_crack', url: '/assets/audio/sfx_bat_crack.wav' },
      { key: 'cheer', url: '/assets/audio/sfx_cheer.wav' },
      { key: 'strike', url: '/assets/audio/sfx_strike.wav' },
      { key: 'swing', url: '/assets/audio/sfx_swing.wav' },
      { key: 'coin', url: '/assets/audio/sfx_coin.wav' },
      { key: 'pitch', url: '/assets/audio/sfx_pitch.wav' },
    ];

    sfxList.forEach(({ key, url }) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.audioElements.set(key, audio);
    });
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playAudio(key: string, volume: number = 0.8) {
    if (!this.enabled) return;
    this.initCtx();

    // Try HTMLAudioElement clone for instant latency-free polyphony
    try {
      const orig = this.audioElements.get(key);
      if (orig) {
        const clone = orig.cloneNode(true) as HTMLAudioElement;
        clone.volume = Math.max(0, Math.min(1, volume));
        clone.play().catch(() => {});
        return;
      }
    } catch {
      // Fallback
    }

    // Direct audio tag fallback
    try {
      const snd = new Audio(`/assets/audio/sfx_${key}.wav`);
      snd.volume = volume;
      snd.play().catch(() => {});
    } catch {
      // Handled
    }
  }

  playPitch() {
    this.playAudio('pitch', 0.85);
  }

  playBatCrack(quality: 'Normal' | 'Solid' | 'Homerun' = 'Normal') {
    const vol = quality === 'Homerun' ? 1.0 : quality === 'Solid' ? 0.9 : 0.75;
    this.playAudio('bat_crack', vol);
  }

  playSwingWhoosh() {
    this.playAudio('swing', 0.85);
  }

  playCheer() {
    this.playAudio('cheer', 0.9);
  }

  playStrike() {
    this.playAudio('strike', 0.85);
  }

  playCoin() {
    this.playAudio('coin', 0.8);
  }
}

export const sound = new SoundSystem();
