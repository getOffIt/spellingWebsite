import readline from 'readline';
import { Word, VoiceConfig } from '../types/index.js';
import { AudioPlayer } from './AudioPlayer.js';
import { FileManager } from './FileManager.js';
import { ProgressManager } from './ProgressManager.js';
import { BatchGenerator } from './BatchGenerator.js';

export class ReviewWorkflow {
  private audioPlayer: AudioPlayer;
  private fileManager: FileManager;
  private progressManager: ProgressManager;
  private batchGenerator: BatchGenerator;
  private voices: VoiceConfig[];
  private rl: readline.Interface;

  constructor(
    audioPlayer: AudioPlayer,
    fileManager: FileManager,
    progressManager: ProgressManager,
    batchGenerator: BatchGenerator,
    voices: VoiceConfig[]
  ) {
    this.audioPlayer = audioPlayer;
    this.fileManager = fileManager;
    this.progressManager = progressManager;
    this.batchGenerator = batchGenerator;
    this.voices = voices;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async reviewWord(wordId: string, wordText: string): Promise<{
    approved: boolean;
    voiceUsed?: string;
    skipped?: boolean;
  }> {
    console.log(`\n🎧 Reviewing word: "${wordText}" (${wordId})`);
    
    // Start with Rachel (primary voice)
    let currentVoiceIndex = 0;
    let currentVoice = this.voices[currentVoiceIndex];
    
    // Check if Rachel audio exists
    const hasRachelAudio = await this.fileManager.audioFileExists(wordId, currentVoice.name);
    if (!hasRachelAudio) {
      console.log(`❌ No audio found for "${wordText}" with ${currentVoice.name} voice`);
      return { approved: false };
    }
    
    while (true) {
      // Play current voice
      await this.playCurrentVoice(wordId, currentVoice);
      
      // Get user decision
      const decision = await this.getUserDecision();
      
      switch (decision) {
        case 'y': // Accept
          await this.progressManager.markWordCompleted(
            wordId,
            currentVoice.name,
            await this.getAudioPath(wordId, currentVoice.name)
          );
          console.log(`✅ Approved "${wordText}" with ${currentVoice.name} voice`);
          return { approved: true, voiceUsed: currentVoice.name };
          
        case 'l': // Listen again
          console.log(`🔄 Replaying "${wordText}" with ${currentVoice.name} voice...`);
          continue; // Loop back to play again
          
        case 'n': // Try next voice
          currentVoiceIndex++;
          
          if (currentVoiceIndex >= this.voices.length) {
            // Offer to return to Rachel
            console.log('\n🔄 All voices tried. Return to Rachel? (y/n/s to skip)');
            const returnDecision = await this.getUserInput();
            
            if (returnDecision === 'y') {
              currentVoiceIndex = 0; // Back to Rachel
              currentVoice = this.voices[currentVoiceIndex];
              continue;
            } else if (returnDecision === 's') {
              console.log(`⏭️  Skipped "${wordText}"`);
              return { approved: false, skipped: true };
            } else {
              console.log(`❌ No suitable voice found for "${wordText}"`);
              return { approved: false };
            }
          }
          
          currentVoice = this.voices[currentVoiceIndex];
          
          // Check if we have this voice, generate if not
          const hasVoice = await this.fileManager.audioFileExists(wordId, currentVoice.name);
          if (!hasVoice) {
            console.log(`🎭 Generating ${currentVoice.name} voice for "${wordText}"...`);
            const result = await this.batchGenerator.generateAlternativeVoice(wordId, wordText, currentVoice);
            
            if (!result.success) {
              console.log(`❌ Failed to generate ${currentVoice.name} voice: ${result.error}`);
              continue; // Try next voice
            }
          }
          
          console.log(`🎭 Switching to ${currentVoice.name} voice...`);
          break;
          
        case 's': // Skip
          console.log(`⏭️  Skipped "${wordText}"`);
          return { approved: false, skipped: true };
          
        default:
          console.log('Please enter y (accept), n (next voice), l (listen again), or s (skip)');
          continue;
      }
    }
  }

  async reviewAllWords(words: Word[]): Promise<{
    approved: number;
    skipped: number;
    failed: number;
  }> {
    console.log(`\n🎧 Starting interactive review of ${words.length} words`);
    console.log('Controls: y (accept), n (next voice), l (listen again), s (skip)');
    
    let approved = 0;
    let skipped = 0;
    let failed = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      console.log(`\n📊 Progress: ${i + 1}/${words.length} (${Math.round(((i + 1) / words.length) * 100)}%)`);
      
      const result = await this.reviewWord(word.id, word.text);
      
      if (result.approved) {
        approved++;
      } else if (result.skipped) {
        skipped++;
      } else {
        failed++;
      }
    }
    
    return { approved, skipped, failed };
  }

  private async playCurrentVoice(wordId: string, voice: VoiceConfig): Promise<void> {
    try {
      console.log(`🔊 Playing "${wordId}" with ${voice.name} voice...`);
      const audioBuffer = await this.fileManager.loadAudioFile(wordId, voice.name);
      await this.audioPlayer.play(audioBuffer);
      console.log(`✅ Playback complete`);
    } catch (error) {
      console.log(`❌ Playback failed: ${error instanceof Error ? error.message : error}`);
    }
  }

  private async getUserDecision(): Promise<string> {
    return await this.getUserInput('Decision (y/n/l/s): ');
  }

  private async getUserInput(prompt = ''): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.toLowerCase().trim());
      });
    });
  }

  private async getAudioPath(wordId: string, voiceName: string): Promise<string> {
    return `./audio-cache/${voiceName}/${wordId}.mp3`;
  }

  close(): void {
    this.rl.close();
  }
}
