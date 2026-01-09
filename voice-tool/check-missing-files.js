#!/usr/bin/env node

import { readFileSync } from 'fs';

// Read manifest
const manifest = JSON.parse(readFileSync('../public/voices/voice-manifest.json', 'utf8'));

// Read progress
const progress = JSON.parse(readFileSync('./progress/voice-generation-progress.json', 'utf8'));

console.log('🔍 Checking for mismatches between manifest and progress...\n');

let mismatches = 0;

for (const [word, url] of Object.entries(manifest)) {
  const progressEntry = progress.words[word];
  
  if (!progressEntry) {
    console.log(`❌ ${word}: Not found in progress file`);
    mismatches++;
    continue;
  }
  
  // Extract voice from URL
  const urlVoice = url.match(/\/voices\/([^\/]+)\//)?.[1];
  const progressVoice = progressEntry.voiceUsed;
  
  if (urlVoice !== progressVoice) {
    console.log(`🔄 ${word}: Manifest has ${urlVoice}, progress has ${progressVoice}`);
    mismatches++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Voice mismatches: ${mismatches}`);
console.log(`   Total words in manifest: ${Object.keys(manifest).length}`);

if (mismatches > 0) {
  console.log('\n💡 Recommendation: Regenerate manifest with: npm run create-manifest > ../public/voices/voice-manifest.json');
}
