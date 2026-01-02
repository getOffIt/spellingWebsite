import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

export class AudioPlayer {
  private platform: 'macos' | 'linux' | 'windows';
  private autoPlay: boolean;
  private isCurrentlyPlaying = false;

  constructor(platform: 'macos' | 'linux' | 'windows' = 'macos', autoPlay = true) {
    this.platform = platform;
    this.autoPlay = autoPlay;
  }

  async play(audioBuffer: ArrayBuffer): Promise<void> {
    // Create temporary file
    const tempPath = join(process.cwd(), 'temp', `audio_${Date.now()}.mp3`);
    
    try {
      // Ensure temp directory exists
      await this.ensureTempDirectory();
      
      // Write audio buffer to temporary file
      await writeFile(tempPath, Buffer.from(audioBuffer));
      
      // Play the file
      await this.playFile(tempPath);
      
    } finally {
      // Cleanup temporary file
      try {
        await unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  async playFile(filePath: string): Promise<void> {
    if (!this.autoPlay) {
      console.log(`🔊 Audio ready: ${filePath}`);
      return;
    }

    this.isCurrentlyPlaying = true;
    
    try {
      const command = this.getPlayCommand(filePath);
      
      await execAsync(command);
      
    } catch (error) {
      console.error(`❌ Audio playback failed: ${error instanceof Error ? error.message : error}`);
      throw new Error(`Failed to play audio: ${error instanceof Error ? error.message : error}`);
    } finally {
      this.isCurrentlyPlaying = false;
    }
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }

  stop(): void {
    // For simplicity, we'll let the current playback finish
    // In a more advanced implementation, we could track and kill the process
    this.isCurrentlyPlaying = false;
  }

  setAutoPlay(enabled: boolean): void {
    this.autoPlay = enabled;
  }

  private getPlayCommand(filePath: string): string {
    switch (this.platform) {
      case 'macos':
        return `afplay "${filePath}"`;
      case 'linux':
        return `mpv --no-video "${filePath}" || aplay "${filePath}" || paplay "${filePath}"`;
      case 'windows':
        return `powershell -c "(New-Object Media.SoundPlayer '${filePath}').PlaySync()"`;
      default:
        throw new Error(`Unsupported platform: ${this.platform}`);
    }
  }

  private async ensureTempDirectory(): Promise<void> {
    try {
      const { mkdir } = await import('fs/promises');
      await mkdir(join(process.cwd(), 'temp'), { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }
  }
}
