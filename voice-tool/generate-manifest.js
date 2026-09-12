#!/usr/bin/env node

import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = resolve(SCRIPT_DIR, 'progress/voice-generation-progress.json');
const MANIFEST_BASE_URL = process.env.VOICE_MANIFEST_BASE_URL || 'https://spellingninjas.com';
const S3_KEY_PREFIX = process.env.S3_KEY_PREFIX || 'voices';

async function generateVoiceManifest() {
  try {
    const progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
    const words = Object.entries(progress.words || {});
    const manifestEntries = [];

    for (const [wordId, wordProgress] of words) {
      if (
        wordProgress?.status !== 'completed' ||
        !wordProgress?.voiceUsed ||
        !wordProgress?.localAudioPath
      ) {
        continue;
      }

      const manifestKey = `${S3_KEY_PREFIX}/${wordProgress.voiceUsed}/${wordId}.mp3`;
      manifestEntries.push([wordId, `${MANIFEST_BASE_URL}/${manifestKey}`]);
    }

    manifestEntries.sort(([wordA], [wordB]) => wordA.localeCompare(wordB));
    const manifest = Object.fromEntries(manifestEntries);

    console.log(JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Failed to generate manifest:', error);
    process.exit(1);
  }
}

generateVoiceManifest();
