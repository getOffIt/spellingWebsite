import { CommandResult, Word } from '../types/index.js';
import { WordExtractor } from './WordExtractor.js';
import { ProgressManager } from './ProgressManager.js';
import { FileManager } from './FileManager.js';
import { ElevenLabsClient } from './ElevenLabsClient.js';
import { AudioPlayer } from './AudioPlayer.js';
import { BatchGenerator } from './BatchGenerator.js';
import { ReviewWorkflow } from './ReviewWorkflow.js';
import { loadConfig } from '../config/config.js';
import readline from 'readline';

export class CommandModeHandler {
  private wordExtractor: WordExtractor;
  private progressManager: ProgressManager;
  private fileManager: FileManager;
  private client: ElevenLabsClient;
  private audioPlayer: AudioPlayer;
  private batchGenerator: BatchGenerator;
  private reviewWorkflow: ReviewWorkflow;
  private config: ReturnType<typeof loadConfig>;

  constructor() {
    this.config = loadConfig();
    this.wordExtractor = new WordExtractor();
    this.progressManager = new ProgressManager();
    this.fileManager = new FileManager();
    this.client = new ElevenLabsClient(this.config.elevenlabs.apiKey);
    this.audioPlayer = new AudioPlayer(this.config.audio.platform, this.config.audio.autoPlay);
    
    this.batchGenerator = new BatchGenerator(
      this.client,
      this.fileManager,
      this.progressManager,
      this.config.elevenlabs.voiceSettings
    );
    
    this.reviewWorkflow = new ReviewWorkflow(
      this.audioPlayer,
      this.fileManager,
      this.progressManager,
      this.batchGenerator,
      this.config.voices,
      readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
    );
  }

  async executeBatch(): Promise<CommandResult> {
    try {
      console.log('🎵 Starting batch generation...');
      
      // Load words
      const words = await this.loadWords();
      console.log(`📚 Loaded ${words.length} words for generation`);
      
      // Check API key
      const isValidKey = await this.client.validateApiKey();
      if (!isValidKey) {
        return {
          success: false,
          message: 'Authentication failed: Invalid ElevenLabs API key',
          nextAction: 'Please check your ELEVENLABS_API_KEY environment variable'
        };
      }
      
      console.log('✅ API key validated');
      
      // Generate audio for all words with Rachel voice
      const rachelVoice = this.config.voices[0]; // Rachel is first
      const result = await this.batchGenerator.generateBatch(words, rachelVoice);
      
      return {
        success: true,
        message: `Batch generation complete: ${result.generated}/${result.total} words generated successfully`,
        data: result,
        nextAction: result.generated > 0 ? 'Ready for review phase' : 'Check API configuration'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Batch generation failed: ${error instanceof Error ? error.message : error}`,
        nextAction: 'Check configuration and try again'
      };
    }
  }

  async executeReview(wordId: string, decision?: 'accept' | 'reject' | 'next'): Promise<CommandResult> {
    try {
      console.log(`🎧 Starting review for word: "${wordId}"`);
      
      // Check if audio exists
      const rachelVoice = this.config.voices[0].name;
      const hasAudio = await this.fileManager.audioFileExists(wordId, rachelVoice);
      
      if (!hasAudio) {
        return {
          success: false,
          message: `No audio found for word "${wordId}"`,
          nextAction: 'Run batch generation first or generate this specific word'
        };
      }
      
      // Load and play audio
      console.log(`🔊 Playing audio for "${wordId}" with ${rachelVoice} voice...`);
      const audioBuffer = await this.fileManager.loadAudioFile(wordId, rachelVoice);
      await this.audioPlayer.play(audioBuffer);
      
      console.log(`✅ Audio played for "${wordId}" with ${rachelVoice} voice`);
      
      // Handle decision if provided (for Kiro CLI)
      if (decision === 'accept') {
        console.log('🤖 Accepting audio (Kiro CLI mode)');
        const audioPath = `./audio-cache/${rachelVoice}/${wordId}.mp3`;
        await this.progressManager.markWordCompleted(wordId, rachelVoice, audioPath);
        
        return {
          success: true,
          message: `Audio accepted for "${wordId}" with ${rachelVoice} voice`,
          data: { wordId, currentVoice: rachelVoice, accepted: true },
          nextAction: 'Word approved and marked complete'
        };
      }
      
      // No decision provided - just played audio
      return {
        success: true,
        message: `Audio played for "${wordId}" with ${rachelVoice} voice`,
        data: { wordId, currentVoice: rachelVoice, audioReady: true },
        nextAction: 'Use --review-accept, --review-reject, or --review-next to make decision'
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Review failed for "${wordId}": ${error instanceof Error ? error.message : error}`,
        nextAction: 'Check if audio file exists or regenerate'
      };
    }
  }

  async executeStatus(): Promise<CommandResult> {
    try {
      const progress = await this.progressManager.loadProgress();
      const status = this.progressManager.getCompletionStatus();
      const cacheStats = await this.fileManager.getAudioCacheStats();
      
      const completedWords = this.progressManager.getCompletedWords();
      const failedWords = this.progressManager.getFailedWords();
      
      console.log('📊 Voice Generation Status:');
      console.log(`Progress: ${status.completed}/${status.total} words completed (${status.percentage}%)`);
      console.log(`Audio Cache: ${cacheStats.totalFiles} files (${Math.round(cacheStats.totalSize / 1024)}KB)`);
      
      if (Object.keys(cacheStats.voiceBreakdown).length > 0) {
        console.log('Voice Breakdown:');
        for (const [voice, count] of Object.entries(cacheStats.voiceBreakdown)) {
          console.log(`  ${voice}: ${count} files`);
        }
      }
      
      if (failedWords.length > 0) {
        console.log(`Failed Words: ${failedWords.slice(0, 5).join(', ')}${failedWords.length > 5 ? ` (and ${failedWords.length - 5} more)` : ''}`);
      }
      
      let nextAction = 'Ready for operations';
      if (status.total === 0) {
        nextAction = 'Run batch generation to start';
      } else if (status.completed === status.total) {
        nextAction = 'All words completed - ready for S3 upload';
      } else if (cacheStats.totalFiles > 0) {
        nextAction = 'Continue with review workflow';
      }
      
      return {
        success: true,
        message: `Status: ${status.completed}/${status.total} words completed (${status.percentage}%)`,
        data: { 
          progress: status, 
          cache: cacheStats, 
          completed: completedWords.length,
          failed: failedWords.length 
        },
        nextAction
      };
      
    } catch (error) {
      return {
        success: false,
        message: `Status check failed: ${error instanceof Error ? error.message : error}`,
        nextAction: 'Check file permissions and try again'
      };
    }
  }

  async executeUpload(): Promise<CommandResult> {
    try {
      console.log('📤 Preparing S3 upload...');
      
      const approvedFiles = await this.fileManager.prepareApprovedFiles();
      
      if (approvedFiles.length === 0) {
        return {
          success: false,
          message: 'No approved audio files found for upload',
          nextAction: 'Complete batch generation and review process first'
        };
      }
      
      console.log(`📤 Found ${approvedFiles.length} files ready for upload`);
      
      // Initialize S3 with config
      this.fileManager.initializeS3({
        bucketName: this.config.s3.bucketName,
        region: this.config.s3.region,
        keyPrefix: this.config.s3.keyPrefix
      });
      
      // Upload to S3
      const result = await this.fileManager.uploadToS3(approvedFiles);
      
      if (result.success) {
        return {
          success: true,
          message: `S3 upload complete: ${result.uploaded}/${result.total} files uploaded successfully`,
          data: result,
          nextAction: 'Audio files are now available on the spelling website'
        };
      } else {
        return {
          success: false,
          message: `S3 upload partially failed: ${result.uploaded}/${result.total} files uploaded, ${result.failed} failed`,
          data: result,
          nextAction: `Check failed files: ${result.failedFiles.join(', ')}`
        };
      }
      
    } catch (error) {
      return {
        success: false,
        message: `S3 upload failed: ${error instanceof Error ? error.message : error}`,
        nextAction: 'Check AWS credentials and S3 configuration'
      };
    }
  }

  private async loadWords(): Promise<Word[]> {
    return await this.wordExtractor.extractWords(this.config.cli.wordsFile);
  }
}
