import { CommandConfig, OperationMode } from '../types/index.js';
import { loadConfig, validateConfig } from '../config/config.js';
import { WordExtractor } from '../services/WordExtractor.js';
import { CommandModeHandler } from '../services/CommandModeHandler.js';
import { ReviewWorkflow } from '../services/ReviewWorkflow.js';
import { AudioPlayer } from '../services/AudioPlayer.js';
import { FileManager } from '../services/FileManager.js';
import { ProgressManager } from '../services/ProgressManager.js';
import { BatchGenerator } from '../services/BatchGenerator.js';
import { ElevenLabsClient } from '../services/ElevenLabsClient.js';
import readline from 'readline';

export class CLIInterface {
  private wordExtractor = new WordExtractor();
  private commandHandler = new CommandModeHandler();
  private config = loadConfig();

  async start(): Promise<void> {
    console.log('🎤 ElevenLabs Voice Generation Tool');
    
    // Load and validate configuration
    const configErrors = validateConfig(this.config);
    
    if (configErrors.length > 0) {
      console.error('❌ Configuration errors:');
      configErrors.forEach(error => console.error(`  - ${error}`));
      console.error('\nPlease check your .env file or environment variables.');
      process.exit(1);
    }

    // Parse command line arguments
    const commandConfig = this.parseArguments(process.argv.slice(2));
    
    if (commandConfig.mode === 'interactive') {
      await this.runInteractiveMode();
    } else {
      await this.runCommandMode(commandConfig);
    }
  }

  parseArguments(args: string[]): CommandConfig {
    // Default to interactive mode if no arguments
    if (args.length === 0) {
      return {
        mode: 'interactive',
        options: {}
      };
    }

    const mode = args[0];
    
    switch (mode) {
      case '--interactive':
        return { mode: 'interactive', options: {} };
      case '--batch':
        return { mode: 'batch', options: {} };
      case '--status':
        return { mode: 'status', options: {} };
      case '--upload':
        return { mode: 'upload', options: {} };
      case '--review':
        if (args.length < 2) {
          throw new Error('--review requires a word ID');
        }
        return { mode: 'review', wordId: args[1], options: {} };
      case '--review-accept':
        if (args.length < 2) {
          throw new Error('--review-accept requires a word ID');
        }
        return { mode: 'review-accept', wordId: args[1], options: {} };
      case '--review-reject':
        if (args.length < 2) {
          throw new Error('--review-reject requires a word ID');
        }
        return { mode: 'review-reject', wordId: args[1], options: {} };
      case '--review-next':
        if (args.length < 2) {
          throw new Error('--review-next requires a word ID');
        }
        return { mode: 'review-next', wordId: args[1], options: {} };
      default:
        throw new Error(`Unknown command: ${mode}. Use --interactive, --batch, --review <word>, --status, or --upload`);
    }
  }

  async runInteractiveMode(): Promise<void> {
    console.log('\n📋 Interactive Mode');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      while (true) {
        console.log('\n📋 Main Menu:');
        console.log('  1. Start batch generation');
        console.log('  2. Start interactive review');
        console.log('  3. Show progress summary');
        console.log('  4. Upload to S3');
        console.log('  5. Exit');
        
        const choice = await this.getUserInput(rl, '\nSelect option (1-5): ');
        
        switch (choice) {
          case '1':
            await this.runBatchGeneration();
            break;
          case '2':
            await this.runInteractiveReview();
            break;
          case '3':
            await this.showProgressSummary();
            break;
          case '4':
            await this.runUpload();
            break;
          case '5':
            console.log('👋 Goodbye!');
            rl.close();
            return;
          default:
            console.log('❌ Invalid option. Please select 1-5.');
        }
      }
    } finally {
      rl.close();
    }
  }

  private async runBatchGeneration(): Promise<void> {
    console.log('\n🎵 Starting Batch Generation...');
    const result = await this.commandHandler.executeBatch();
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
    } else {
      console.log(`❌ ${result.message}`);
    }
  }

  private async runInteractiveReview(): Promise<void> {
    console.log('\n🎧 Starting Interactive Review...');
    
    try {
      // Load words and check for generated audio
      const words = await this.loadWords();
      const fileManager = new FileManager();
      
      // Filter to words that have Rachel audio
      const wordsWithAudio = [];
      for (const word of words.slice(0, 5)) { // Test with first 5 words
        const hasAudio = await fileManager.audioFileExists(word.id, 'rachel');
        if (hasAudio) {
          wordsWithAudio.push(word);
        }
      }
      
      if (wordsWithAudio.length === 0) {
        console.log('❌ No generated audio found. Run batch generation first.');
        return;
      }
      
      console.log(`📊 Found ${wordsWithAudio.length} words with generated audio`);
      console.log('🎧 Starting review process...');
      console.log('Controls: y (accept), n (next voice), l (listen again), s (skip)');
      
      // Initialize services for review
      const progressManager = new ProgressManager();
      const client = new ElevenLabsClient(this.config.elevenlabs.apiKey);
      const audioPlayer = new AudioPlayer(this.config.audio.platform, true);
      
      const batchGenerator = new BatchGenerator(
        client,
        fileManager,
        progressManager,
        this.config.elevenlabs.voiceSettings
      );
      
      const reviewWorkflow = new ReviewWorkflow(
        audioPlayer,
        fileManager,
        progressManager,
        batchGenerator,
        this.config.voices
      );
      
      // Review words
      const result = await reviewWorkflow.reviewAllWords(wordsWithAudio);
      
      console.log('\n🎉 Review Complete!');
      console.log(`✅ Approved: ${result.approved} words`);
      console.log(`⏭️  Skipped: ${result.skipped} words`);
      console.log(`❌ Failed: ${result.failed} words`);
      
      reviewWorkflow.close();
      
    } catch (error) {
      console.error('❌ Review failed:', error instanceof Error ? error.message : error);
    }
  }

  private async showProgressSummary(): Promise<void> {
    console.log('\n📊 Progress Summary...');
    const result = await this.commandHandler.executeStatus();
    console.log(`✅ ${result.message}`);
  }

  private async runUpload(): Promise<void> {
    console.log('\n📤 S3 Upload...');
    const result = await this.commandHandler.executeUpload();
    console.log(`✅ ${result.message}`);
  }

  private async getUserInput(rl: readline.Interface, prompt: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async loadWords() {
    try {
      return await this.wordExtractor.extractWords('./real-words.ts');
    } catch {
      return await this.wordExtractor.extractWords('./test-words.ts');
    }
  }

  async runCommandMode(config: CommandConfig): Promise<void> {
    console.log(`\n🤖 Command Mode: ${config.mode}`);
    
    let result;
    
    try {
      switch (config.mode) {
        case 'batch':
          result = await this.commandHandler.executeBatch();
          break;
        case 'review':
          result = await this.commandHandler.executeReview(config.wordId!);
          break;
        case 'review-accept':
          result = await this.commandHandler.executeReview(config.wordId!, 'accept');
          break;
        case 'review-reject':
          result = await this.commandHandler.executeReview(config.wordId!, 'reject');
          break;
        case 'review-next':
          result = await this.commandHandler.executeReview(config.wordId!, 'next');
          break;
        case 'status':
          result = await this.commandHandler.executeStatus();
          break;
        case 'upload':
          result = await this.commandHandler.executeUpload();
          break;
        default:
          throw new Error(`Unsupported command mode: ${config.mode}`);
      }
      
      if (result.success) {
        console.log(`✅ ${result.message}`);
        if (result.nextAction) {
          console.log(`➡️  Next: ${result.nextAction}`);
        }
      } else {
        console.log(`❌ ${result.message}`);
        if (result.nextAction) {
          console.log(`💡 Suggestion: ${result.nextAction}`);
        }
        process.exit(1);
      }
      
    } catch (error) {
      console.error(`❌ Command failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  }
}
