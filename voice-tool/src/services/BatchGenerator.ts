import { Word, VoiceConfig } from '../types/index.js';
import { ElevenLabsClient } from './ElevenLabsClient.js';
import { FileManager } from './FileManager.js';
import { ProgressManager } from './ProgressManager.js';

export class BatchGenerator {
  private client: ElevenLabsClient;
  private fileManager: FileManager;
  private progressManager: ProgressManager;
  private voiceSettings: any;
  private interrupted = false;

  constructor(
    client: ElevenLabsClient,
    fileManager: FileManager,
    progressManager: ProgressManager,
    voiceSettings: any
  ) {
    this.client = client;
    this.fileManager = fileManager;
    this.progressManager = progressManager;
    this.voiceSettings = voiceSettings;
    
    // Handle graceful interruption
    process.on('SIGINT', this.handleInterruption.bind(this));
  }

  private async handleInterruption(): Promise<void> {
    if (this.interrupted) return; // Already handling
    this.interrupted = true;
    
    console.log('\n⏸️  Batch generation interrupted. Saving progress...');
    // The ProgressManager automatically saves on updates, so just exit gracefully
    console.log('✅ Progress saved. You can resume later.');
    process.exit(0);
  }

  private async rateLimitDelay(): Promise<void> {
    // Add 500ms delay between API calls to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async generateBatch(words: Word[], primaryVoice: VoiceConfig, resume = true): Promise<{
    generated: number;
    failed: number;
    total: number;
    failedWords: string[];
  }> {
    console.log(`🎵 Starting batch generation with ${primaryVoice.name} voice...`);
    
    // Auto-resume: filter to only words that need generation
    let wordsToProcess = words;
    if (resume) {
      wordsToProcess = await this.getResumableWords(words);
      const alreadyCompleted = words.length - wordsToProcess.length;
      if (alreadyCompleted > 0) {
        console.log(`🔄 Resuming batch: ${alreadyCompleted} already completed, ${wordsToProcess.length} remaining`);
      }
    }
    
    // Initialize progress tracking
    await this.progressManager.initializeWords(words);
    
    let generated = 0;
    let failed = 0;
    const failedWords: string[] = [];
    const startTime = new Date();
    
    for (let i = 0; i < wordsToProcess.length; i++) {
      // Check for interruption
      if (this.interrupted) {
        console.log('⏸️  Generation interrupted by user');
        break;
      }
      
      const word = wordsToProcess[i];
      
      try {
        // Check if already generated (double-check for resume)
        const hasAudio = await this.fileManager.audioFileExists(word.id, primaryVoice.name);
        if (hasAudio) {
          console.log(`⏭️  Skipping "${word.text}" (already exists)`);
          generated++;
          continue;
        }
        
        console.log(`🎵 Generating "${word.text}" (${i + 1}/${wordsToProcess.length})`);
        
        const audioBuffer = await this.client.generateAudio(
          word.text,
          primaryVoice.id,
          this.voiceSettings
        );
        
        const audioPath = await this.fileManager.saveAudioFile(
          word.id,
          primaryVoice.name,
          audioBuffer
        );
        
        await this.progressManager.updateWordProgress(word.id, {
          generatedVoices: [primaryVoice.name],
          localAudioPath: audioPath
        });
        
        generated++;
        
        // Show progress with ETA every 10 words
        if ((i + 1) % 10 === 0) {
          this.showProgress(i + 1, wordsToProcess.length, startTime);
        }
        
        // Rate limiting: delay between API calls
        if (i < wordsToProcess.length - 1) { // Don't delay after last word
          await this.rateLimitDelay();
        }
        
      } catch (error) {
        console.log(`❌ Failed to generate "${word.text}": ${error instanceof Error ? error.message : error}`);
        await this.progressManager.markWordFailed(word.id, error instanceof Error ? error.message : String(error));
        failed++;
        failedWords.push(word.text);
      }
    }
    
    // Progress is automatically saved on each update
    console.log('✅ Batch generation complete');
    
    return { generated, failed, total: words.length, failedWords };
  }

  private showProgress(current: number, total: number, startTime: Date): void {
    const elapsed = (Date.now() - startTime.getTime()) / 1000;
    const rate = current / elapsed;
    const remaining = total - current;
    const eta = remaining / rate;
    
    console.log(`📊 Progress: ${current}/${total} (${Math.round((current/total)*100)}%) ETA: ${Math.round(eta)}s`);
  }

  async generateAlternativeVoice(
    wordId: string, 
    wordText: string, 
    voice: VoiceConfig
  ): Promise<{ success: boolean; audioPath?: string; error?: string }> {
    try {
      console.log(`🎭 Generating alternative voice for "${wordText}" with ${voice.name}...`);
      
      const audioBuffer = await this.client.generateAudio(
        wordText,
        voice.id,
        this.voiceSettings
      );
      
      const audioPath = await this.fileManager.saveAudioFile(
        wordId,
        voice.name,
        audioBuffer
      );
      
      // Update progress to include this voice
      const currentProgress = this.progressManager.getWordProgress(wordId);
      const generatedVoices = currentProgress?.generatedVoices || [];
      if (!generatedVoices.includes(voice.name)) {
        generatedVoices.push(voice.name);
      }
      
      await this.progressManager.updateWordProgress(wordId, {
        generatedVoices
      });
      
      return { success: true, audioPath };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ Failed to generate ${voice.name} voice for "${wordText}": ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  async getResumableWords(allWords: Word[]): Promise<Word[]> {
    const wordsToProcess: Word[] = [];
    
    for (const word of allWords) {
      // Check if word needs generation (no audio file exists)
      const hasAudio = await this.fileManager.audioFileExists(word.id, 'rachel'); // Check primary voice
      if (!hasAudio) {
        wordsToProcess.push(word);
      }
    }
    
    // Also include failed words for retry
    const failedWords = this.progressManager.getFailedWords();
    const failedWordObjects = allWords.filter(word => failedWords.includes(word.id));
    
    // Combine and deduplicate
    const allWordsToProcess = [...wordsToProcess];
    for (const failedWord of failedWordObjects) {
      if (!wordsToProcess.find(w => w.id === failedWord.id)) {
        allWordsToProcess.push(failedWord);
      }
    }
    
    return allWordsToProcess;
  }
}
