#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const S3_BUCKET = process.env.S3_BUCKET || 'spellmatereact';

const VOICES = {
  rachel: '21m00Tcm4TlvDq8ikWAM',
  adam: 'pNInz6obpgDQGcFmaJgB', 
  bella: 'EXAVITQu4vr4xnSDxMaL'
};

const MODEL = 'eleven_turbo_v2_5';

// Get script directory for resolving relative paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import words - path relative to scripts/ directory
// Used in extractWords() function
const WORDS_FILE = '../src/data/words.ts';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function generateAudio(text, voiceId) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return await response.arrayBuffer();
}

async function playAudio(audioBuffer) {
  // Save temp file and play it
  const tempFile = '/tmp/temp_audio.mp3';
  fs.writeFileSync(tempFile, Buffer.from(audioBuffer));
  
  try {
    await execAsync(`afplay "${tempFile}"`); // macOS audio player
  } catch {
    console.log('Could not play audio automatically. Check the temp file:', tempFile);
  }
}

async function uploadToS3(audioBuffer, key) {
  const tempFile = `/tmp/${key.replace('/', '_')}`;
  fs.writeFileSync(tempFile, Buffer.from(audioBuffer));
  
  try {
    await execAsync(`aws s3 cp "${tempFile}" "s3://${S3_BUCKET}/${key}" --content-type audio/mpeg`);
    fs.unlinkSync(tempFile);
    return true;
  } catch (error) {
    console.error(`Failed to upload ${key}:`, error.message);
    return false;
  }
}

async function reviewWord(word, voiceName, voiceId) {
  console.log(`\n🎵 Generating "${word.text}" with ${voiceName}...`);
  
  try {
    const audioBuffer = await generateAudio(word.text, voiceId);
    
    console.log(`▶️  Playing "${word.text}"...`);
    await playAudio(audioBuffer);
    
    const response = await question(`Is this good? (y/n/r for retry): `);
    
    if (response.toLowerCase() === 'y') {
      const key = `${voiceName}/${word.id}.mp3`;
      const uploaded = await uploadToS3(audioBuffer, key);
      if (uploaded) {
        console.log(`✅ Uploaded: ${key}`);
        return { success: true, voice: voiceName };
      } else {
        console.log(`❌ Upload failed for ${key}`);
        return { success: false };
      }
    } else if (response.toLowerCase() === 'r') {
      return await reviewWord(word, voiceName, voiceId); // Retry same voice
    } else {
      return { success: false, needsAlternative: true };
    }
  } catch (error) {
    console.error(`Error generating ${word.text}:`, error.message);
    return { success: false };
  }
}

async function processWord(word) {
  console.log(`\n📝 Processing word: "${word.text}" (${word.id})`);
  
  // Try primary voice first (Rachel)
  let result = await reviewWord(word, 'rachel', VOICES.rachel);
  
  if (result.success) {
    return result;
  }
  
  if (result.needsAlternative) {
    console.log(`\n🔄 Trying alternative voices for "${word.text}"...`);
    
    // Try other voices
    for (const [voiceName, voiceId] of Object.entries(VOICES)) {
      if (voiceName === 'rachel') continue; // Already tried
      
      console.log(`\n🎭 Trying ${voiceName}...`);
      result = await reviewWord(word, voiceName, voiceId);
      
      if (result.success) {
        return result;
      }
    }
  }
  
  console.log(`❌ Could not generate acceptable audio for "${word.text}"`);
  return { success: false, word: word.text };
}

async function extractWords() {
  // Simple extraction - you might need to adjust this
  // Use WORDS_FILE constant resolved relative to script directory
  const wordsPath = path.resolve(__dirname, WORDS_FILE);
  const content = fs.readFileSync(wordsPath, 'utf8');
  
  // Extract word objects using regex (basic approach)
  const wordMatches = content.match(/{\s*id:\s*['"`]([^'"`]+)['"`],\s*text:\s*['"`]([^'"`]+)['"`]/g);
  
  if (!wordMatches) {
    throw new Error('Could not extract words from words.ts');
  }
  
  return wordMatches.map(match => {
    const [, id, text] = match.match(/id:\s*['"`]([^'"`]+)['"`],\s*text:\s*['"`]([^'"`]+)['"`]/);
    return { id, text };
  });
}

async function main() {
  if (!ELEVENLABS_API_KEY) {
    console.error('Please set ELEVENLABS_API_KEY environment variable');
    process.exit(1);
  }
  
  console.log('🎤 ElevenLabs Voice Generation with Quality Review');
  console.log(`📦 S3 Bucket: ${S3_BUCKET}`);
  console.log(`🎭 Available voices: ${Object.keys(VOICES).join(', ')}`);
  
  const words = await extractWords();
  console.log(`📚 Found ${words.length} words to process`);
  
  const startFrom = await question(`Start from word index (0-${words.length-1}, or press Enter for 0): `);
  const startIndex = parseInt(startFrom) || 0;
  
  const results = {
    success: [],
    failed: []
  };
  
  for (let i = startIndex; i < words.length; i++) {
    const word = words[i];
    console.log(`\n📊 Progress: ${i + 1}/${words.length}`);
    
    const result = await processWord(word);
    
    if (result.success) {
      results.success.push({ ...word, voice: result.voice });
    } else {
      results.failed.push(word);
    }
    
    // Save progress
    fs.writeFileSync('voice-generation-progress.json', JSON.stringify(results, null, 2));
  }
  
  console.log('\n🎉 Generation complete!');
  console.log(`✅ Success: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\n❌ Failed words:');
    results.failed.forEach(word => console.log(`  - ${word.text} (${word.id})`));
  }
  
  rl.close();
}

main().catch(console.error);
