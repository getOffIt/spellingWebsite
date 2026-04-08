export class VoiceService {
  private manifest: Record<string, string> | null = null;
  private audio: HTMLAudioElement;

  constructor() {
    // Reuse a single Audio element to avoid iOS Safari audio channel exhaustion.
    // Creating new Audio() per play leaks system resources and eventually suspends playback.
    this.audio = new Audio();
  }

  async loadManifest(): Promise<void> {
    if (this.manifest) return;

    try {
      const response = await fetch('/voices/voice-manifest.json');
      this.manifest = await response.json();
    } catch (error) {
      console.warn('Failed to load voice manifest:', error);
      this.manifest = {};
    }
  }

  async speak(text: string): Promise<void> {
    await this.loadManifest();

    const wordId = text.toLowerCase().trim();
    const mp3Url = this.manifest?.[wordId];

    if (mp3Url) {
      console.log(`🎵 Playing MP3: ${wordId} from ${mp3Url}`);
      return this.playMP3(mp3Url, text);
    } else {
      console.log(`🔊 Using TTS fallback for: ${wordId}`);
      return this.fallbackTTS(text);
    }
  }

  private async playMP3(url: string, text: string): Promise<void> {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = url;

    try {
      await this.audio.play();
      await new Promise<void>((resolve) => {
        const onEnd = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); resolve(); };
        const cleanup = () => {
          this.audio.removeEventListener('ended', onEnd);
          this.audio.removeEventListener('error', onError);
        };
        this.audio.addEventListener('ended', onEnd, { once: true });
        this.audio.addEventListener('error', onError, { once: true });
      });
    } catch {
      // iOS Safari suspends audio after inactivity / screen lock.
      // Unlock by loading+playing a tiny silent burst, then retry the real src.
      console.warn('Audio play blocked — attempting iOS unlock and retry');
      try {
        this.audio.src = '';
        this.audio.load();
        await this.audio.play().catch(() => {});
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = url;
        await this.audio.play();
        await new Promise<void>((resolve) => {
          this.audio.addEventListener('ended', () => resolve(), { once: true });
          this.audio.addEventListener('error', () => resolve(), { once: true });
        });
      } catch {
        // MP3 truly won't play — fall back to speechSynthesis
        console.warn('MP3 retry failed — falling back to TTS');
        return this.fallbackTTS(text);
      }
    }
  }

  private fallbackTTS(text: string): Promise<void> {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    window.speechSynthesis.cancel();
  }
}
