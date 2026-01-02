export class VoiceService {
  private manifest: Record<string, string> | null = null;
  private audio: HTMLAudioElement | null = null;

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
      return this.playMP3(mp3Url);
    } else {
      console.log(`🔊 Using TTS fallback for: ${wordId}`);
      return this.fallbackTTS(text);
    }
  }

  private async playMP3(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.audio) {
        this.audio.pause();
      }
      
      this.audio = new Audio(url);
      this.audio.onended = () => resolve();
      this.audio.onerror = () => reject(new Error('MP3 playback failed'));
      this.audio.play().catch(reject);
    });
  }

  private fallbackTTS(text: string): Promise<void> {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
    }
    window.speechSynthesis.cancel();
  }
}
