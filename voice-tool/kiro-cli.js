#!/usr/bin/env node

/**
 * Kiro CLI Interface for ElevenLabs Voice Tool
 * Stateless commands for AI agent integration
 */

import dotenv from 'dotenv';
dotenv.config();

import { loadConfig } from './dist/config/config.js';
import { WordExtractor } from './dist/services/WordExtractor.js';
import { ProgressManager } from './dist/services/ProgressManager.js';
import { FileManager } from './dist/services/FileManager.js';
import { ElevenLabsClient } from './dist/services/ElevenLabsClient.js';
import { AudioPlayer } from './dist/services/AudioPlayer.js';
import { BatchGenerator } from './dist/services/BatchGenerator.js';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Kiro CLI Commands:');
    console.log('  --status                 Show generation progress');
    console.log('  --batch                  Generate all missing audio');
    console.log('  --play <word>           Play audio for word (latest voice)');
    console.log('  --play-voice <word> <voice>  Play specific voice for word');
    console.log('  --accept <word>         Accept current audio for word');
    console.log('  --reject <word>         Reject and try next voice');
    console.log('  --choose <word> <voice> Choose specific voice from generated options');
    console.log('  --list-voices <word>    Show all available voices for word');
    console.log('  --reject <word>         Reject and try next voice');
    console.log('  --upload                Prepare files for S3 upload');
    process.exit(0);
  }

  try {
    const config = loadConfig();
    const progressManager = new ProgressManager();
    const fileManager = new FileManager();
    const client = new ElevenLabsClient(config.elevenlabs.apiKey);
    const audioPlayer = new AudioPlayer(config.audio.platform, config.audio.autoPlay);
    
    const command = args[0];
    const wordId = args[1];

    switch (command) {
      case '--status':
        await handleStatus(progressManager, fileManager);
        break;
        
      case '--batch':
        await handleBatch(config, client, fileManager, progressManager);
        break;
        
      case '--play':
        if (!wordId) throw new Error('--play requires word ID');
        await handlePlay(wordId, fileManager, audioPlayer, config);
        break;
        
      case '--play-voice':
        if (!wordId || !args[2]) throw new Error('--play-voice requires word ID and voice name');
        await handlePlayVoice(wordId, args[2], fileManager, audioPlayer);
        break;
        
      case '--accept':
        if (!wordId) throw new Error('--accept requires word ID');
        await handleAccept(wordId, progressManager, fileManager, config);
        break;
        
      case '--reject':
        if (!wordId) throw new Error('--reject requires word ID');
        await handleReject(wordId, progressManager, fileManager, client, config);
        break;
        
      case '--choose':
        if (!wordId || !args[2]) throw new Error('--choose requires word ID and voice name');
        await handleChoose(wordId, args[2], progressManager, fileManager);
        break;
        
      case '--list-voices':
        if (!wordId) throw new Error('--list-voices requires word ID');
        await handleListVoices(wordId, fileManager);
        break;
        
      case '--upload':
        await handleUpload(fileManager, config);
        break;
        
      default:
        throw new Error(`Unknown command: ${command}`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

async function handleStatus(progressManager, fileManager) {
  const status = progressManager.getCompletionStatus();
  const cacheStats = await fileManager.getAudioCacheStats();
  
  console.log(`📊 Progress: ${status.completed}/${status.total} words (${status.percentage}%)`);
  console.log(`💾 Cache: ${cacheStats.totalFiles} files`);
  
  if (status.total === 0) {
    console.log('➡️  Next: Run --batch to start generation');
  } else if (status.completed === status.total) {
    console.log('➡️  Next: All complete, ready for --upload');
  } else {
    console.log('➡️  Next: Continue with --play <word> for review');
  }
}

async function handleBatch(config, client, fileManager, progressManager) {
  console.log('🎵 Starting batch generation...');
  
  const wordExtractor = new WordExtractor();
  const words = await loadWords(wordExtractor);
  console.log(`📚 Loaded ${words.length} words`);
  
  const isValidKey = await client.validateApiKey();
  if (!isValidKey) {
    throw new Error('Invalid ElevenLabs API key');
  }
  
  const batchGenerator = new BatchGenerator(
    client, fileManager, progressManager, config.elevenlabs.voiceSettings
  );
  
  const result = await batchGenerator.generateBatch(words, config.voices[0]);
  console.log(`✅ Generated ${result.generated}/${result.total} words`);
  console.log('➡️  Next: Use --play <word> to review audio');
}

async function handlePlay(wordId, fileManager, audioPlayer, config) {
  // Find the most recently generated voice for this word
  const generatedVoices = await fileManager.getGeneratedVoices(wordId);
  
  if (generatedVoices.length === 0) {
    throw new Error(`No audio found for "${wordId}"`);
  }
  
  // Use the last generated voice (most recent)
  const voiceName = generatedVoices[generatedVoices.length - 1];
  
  console.log(`🔊 Playing "${wordId}" with ${voiceName} voice...`);
  const audioBuffer = await fileManager.loadAudioFile(wordId, voiceName);
  await audioPlayer.play(audioBuffer);
  
  console.log(`✅ Audio played for "${wordId}" with ${voiceName} voice`);
  console.log('➡️  Next: Use --accept or --reject to make decision');
}

async function handleAccept(wordId, progressManager, fileManager, config) {
  // Find the most recently generated voice for this word
  const generatedVoices = await fileManager.getGeneratedVoices(wordId);
  const voiceName = generatedVoices[generatedVoices.length - 1] || config.voices[0].name;
  
  const audioPath = `./audio-cache/${voiceName}/${wordId}.mp3`;
  
  await progressManager.markWordCompleted(wordId, voiceName, audioPath);
  console.log(`✅ Accepted "${wordId}" with ${voiceName} voice`);
  console.log('➡️  Next: Continue with next word or --upload when done');
}

async function handleReject(wordId, progressManager, fileManager, client, config) {
  // Find which voices have been generated for this word
  const generatedVoices = await fileManager.getGeneratedVoices(wordId);
  const lastVoice = generatedVoices[generatedVoices.length - 1] || config.voices[0].name;
  
  // Find next voice to try
  const currentVoiceIndex = config.voices.findIndex(v => v.name === lastVoice);
  const nextVoiceIndex = currentVoiceIndex + 1;
  
  if (nextVoiceIndex >= config.voices.length) {
    console.log(`❌ No more voices to try for "${wordId}"`);
    console.log(`   Already tried: ${generatedVoices.join(', ')}`);
    console.log('➡️  Next: Manual intervention required or skip word');
    return;
  }
  
  const nextVoice = config.voices[nextVoiceIndex];
  console.log(`🔄 Trying "${wordId}" with ${nextVoice.name} voice...`);
  console.log(`   Previous voices: ${generatedVoices.join(', ')}`);
  
  // Generate with next voice
  const batchGenerator = new BatchGenerator(
    client, fileManager, progressManager, config.elevenlabs.voiceSettings
  );
  
  const result = await batchGenerator.generateAlternativeVoice(wordId, wordId, nextVoice);
  if (result.success) {
    console.log(`✅ Generated "${wordId}" with ${nextVoice.name}`);
    console.log('➡️  Next: Use --play to listen to new version');
  } else {
    console.log(`❌ Failed to generate with ${nextVoice.name}: ${result.error}`);
  }
}

async function handlePlayVoice(wordId, voiceName, fileManager, audioPlayer) {
  const hasAudio = await fileManager.audioFileExists(wordId, voiceName);
  if (!hasAudio) {
    throw new Error(`No ${voiceName} voice found for "${wordId}"`);
  }
  
  console.log(`🔊 Playing "${wordId}" with ${voiceName} voice...`);
  const audioBuffer = await fileManager.loadAudioFile(wordId, voiceName);
  await audioPlayer.play(audioBuffer);
  
  console.log(`✅ Audio played for "${wordId}" with ${voiceName} voice`);
  console.log('➡️  Next: Use --accept or --reject to make decision');
}

async function handleChoose(wordId, voiceName, progressManager, fileManager) {
  // Check if the voice exists
  const generatedVoices = await fileManager.getGeneratedVoices(wordId);
  
  if (!generatedVoices.includes(voiceName)) {
    console.log(`❌ Voice "${voiceName}" not available for "${wordId}"`);
    console.log(`Available voices: ${generatedVoices.join(', ')}`);
    return;
  }
  
  const audioPath = `./audio-cache/${voiceName}/${wordId}.mp3`;
  await progressManager.markWordCompleted(wordId, voiceName, audioPath);
  
  console.log(`✅ Chose "${wordId}" with ${voiceName} voice`);
  console.log('➡️  Next: Continue with next word or --upload when done');
}

async function handleListVoices(wordId, fileManager) {
  const generatedVoices = await fileManager.getGeneratedVoices(wordId);
  
  if (generatedVoices.length === 0) {
    console.log(`❌ No voices generated for "${wordId}"`);
    return;
  }
  
  console.log(`🎭 Available voices for "${wordId}":`);
  generatedVoices.forEach((voice, index) => {
    console.log(`  ${index + 1}. ${voice}`);
  });
  console.log('➡️  Use --choose <word> <voice> to select, or --play-voice <word> <voice> to listen');
}

async function handleUpload(fileManager, config) {
  const approvedFiles = await fileManager.prepareApprovedFiles();
  
  if (approvedFiles.length === 0) {
    console.log('❌ No approved files found for upload');
    console.log('➡️  Next: Complete batch generation and review process first');
    return;
  }
  
  console.log(`📤 Found ${approvedFiles.length} approved files for upload`);
  
  // Initialize S3
  fileManager.initializeS3({
    bucketName: config.s3.bucketName,
    region: config.s3.region,
    keyPrefix: config.s3.keyPrefix
  });
  
  // Upload to S3
  const result = await fileManager.uploadToS3(approvedFiles);
  
  if (result.success) {
    console.log(`✅ S3 upload complete: ${result.uploaded}/${result.total} files uploaded`);
    console.log('➡️  Next: Audio files are now available on the spelling website');
  } else {
    console.log(`⚠️  S3 upload partially failed: ${result.uploaded}/${result.total} uploaded, ${result.failed} failed`);
    if (result.failedFiles.length > 0) {
      console.log(`Failed files: ${result.failedFiles.join(', ')}`);
    }
  }
}

async function loadWords(wordExtractor) {
  try {
    return await wordExtractor.extractWords('./test-new-3-words.ts');
  } catch {
    try {
      return await wordExtractor.extractWords('./test-5-words.ts');
    } catch {
      try {
        return await wordExtractor.extractWords('./real-words.ts');
      } catch {
        try {
          return await wordExtractor.extractWords('../src/data/words.ts');
        } catch {
          return await wordExtractor.extractWords('./test-words.ts');
        }
      }
    }
  }
}

main();
