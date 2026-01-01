#!/usr/bin/env node

import { ElevenLabsClient } from './dist/services/ElevenLabsClient.js';

async function fetchVoices() {
  const client = new ElevenLabsClient(process.env.ELEVENLABS_API_KEY);
  
  console.log('🎭 Fetching available voices from ElevenLabs API...');
  
  const voices = await client.getAvailableVoices();
  
  if (voices.length === 0) {
    console.log('❌ No voices found or API error');
    return;
  }
  
  console.log(`\n📊 Found ${voices.length} voices:\n`);
  
  voices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.name} (${voice.voice_id})`);
    console.log(`   Category: ${voice.category || 'Unknown'}`);
    console.log(`   Description: ${voice.description || 'No description'}`);
    console.log(`   Labels: ${voice.labels ? Object.entries(voice.labels).map(([k,v]) => `${k}:${v}`).join(', ') : 'None'}`);
    console.log('');
  });
  
  console.log('\n🔧 To add new voices, copy the voice_id and add to src/config/config.ts');
}

fetchVoices().catch(console.error);
