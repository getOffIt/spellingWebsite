import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { ProgressData, WordProgress, Word, CompletedWord } from '../types/index.js';

export class ProgressManager {
  private progressFilePath: string;
  private progressData: ProgressData | null = null;

  constructor(progressFilePath = './progress/voice-generation-progress.json') {
    this.progressFilePath = progressFilePath;
  }

  async loadProgress(): Promise<ProgressData> {
    try {
      const content = await readFile(this.progressFilePath, 'utf8');
      const data = JSON.parse(content);
      
      // Convert Map from JSON
      data.words = new Map(Object.entries(data.words || {}));
      
      this.progressData = data;
      return data;
    } catch (error) {
      // File doesn't exist or is invalid, create new progress
      return this.createNewProgress();
    }
  }

  async saveProgress(state: ProgressData): Promise<void> {
    try {
      // Ensure directory exists
      await mkdir(dirname(this.progressFilePath), { recursive: true });
      
      // Convert Map to object for JSON serialization
      const dataToSave = {
        ...state,
        words: Object.fromEntries(state.words),
        lastUpdatedAt: new Date()
      };
      
      await writeFile(this.progressFilePath, JSON.stringify(dataToSave, null, 2));
      this.progressData = state;
    } catch (error) {
      throw new Error(`Failed to save progress: ${error instanceof Error ? error.message : error}`);
    }
  }

  async updateWordProgress(wordId: string, update: Partial<WordProgress>): Promise<void> {
    if (!this.progressData) {
      await this.loadProgress();
    }

    const existing = this.progressData!.words.get(wordId) || this.createWordProgress(wordId);
    const updated = { ...existing, ...update };
    
    this.progressData!.words.set(wordId, updated);
    this.updateCounts();
    
    await this.saveProgress(this.progressData!);
  }

  async markWordCompleted(wordId: string, voiceUsed: string, audioPath: string): Promise<void> {
    await this.updateWordProgress(wordId, {
      status: 'completed',
      voiceUsed,
      localAudioPath: audioPath,
      completedAt: new Date(),
      s3Uploaded: false
    });
  }

  async markWordFailed(wordId: string, error: string): Promise<void> {
    await this.updateWordProgress(wordId, {
      status: 'failed',
      lastError: error,
      attempts: (this.getWordProgress(wordId)?.attempts || 0) + 1
    });
  }

  getCompletionStatus(): { completed: number; total: number; percentage: number } {
    if (!this.progressData) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = this.progressData.completedCount;
    const total = this.progressData.totalWords;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  getNewWords(allWords: Word[]): Word[] {
    if (!this.progressData) {
      return allWords;
    }

    return allWords.filter(word => !this.progressData!.words.has(word.id));
  }

  getWordProgress(wordId: string): WordProgress | undefined {
    return this.progressData?.words.get(wordId);
  }

  getCompletedWords(): CompletedWord[] {
    if (!this.progressData) {
      return [];
    }

    const completed: CompletedWord[] = [];
    for (const [wordId, progress] of this.progressData.words) {
      if (progress.status === 'completed' && progress.voiceUsed && progress.localAudioPath && progress.completedAt) {
        completed.push({
          wordId,
          voiceUsed: progress.voiceUsed,
          audioPath: progress.localAudioPath,
          completedAt: progress.completedAt
        });
      }
    }

    return completed;
  }

  getFailedWords(): string[] {
    if (!this.progressData) {
      return [];
    }

    const failed: string[] = [];
    for (const [wordId, progress] of this.progressData.words) {
      if (progress.status === 'failed') {
        failed.push(wordId);
      }
    }

    return failed;
  }

  async initializeWords(words: Word[]): Promise<void> {
    if (!this.progressData) {
      await this.loadProgress();
    }

    // Add any new words that aren't in progress yet
    for (const word of words) {
      if (!this.progressData!.words.has(word.id)) {
        this.progressData!.words.set(word.id, this.createWordProgress(word.id));
      }
    }

    this.progressData!.totalWords = words.length;
    this.updateCounts();
    await this.saveProgress(this.progressData!);
  }

  private createNewProgress(): ProgressData {
    const data: ProgressData = {
      version: '1.0.0',
      sessionId: `session_${Date.now()}`,
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
      totalWords: 0,
      completedCount: 0,
      failedCount: 0,
      words: new Map()
    };

    this.progressData = data;
    return data;
  }

  private createWordProgress(wordId: string): WordProgress {
    return {
      wordId,
      status: 'pending',
      generatedVoices: [],
      s3Uploaded: false,
      attempts: 0
    };
  }

  private updateCounts(): void {
    if (!this.progressData) return;

    let completed = 0;
    let failed = 0;

    for (const progress of this.progressData.words.values()) {
      if (progress.status === 'completed') completed++;
      if (progress.status === 'failed') failed++;
    }

    this.progressData.completedCount = completed;
    this.progressData.failedCount = failed;
  }
}
