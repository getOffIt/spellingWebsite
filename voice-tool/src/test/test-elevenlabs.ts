import { ElevenLabsClient } from '../services/ElevenLabsClient.js';
import { AudioPlayer } from '../services/AudioPlayer.js';
import { loadConfig } from '../config/config.js';

async function testElevenLabsIntegration() {
  console.log('🧪 Testing ElevenLabs Client Integration');
  
  const config = loadConfig();
  
  // Test API key validation
  console.log('\n🔑 Testing API key validation...');
  const client = new ElevenLabsClient(config.elevenlabs.apiKey);
  
  try {
    const isValid = await client.validateApiKey();
    if (isValid) {
      console.log('✅ API key is valid');
      
      // Test audio generation with first test word
      console.log('\n🎵 Testing audio generation...');
      console.log('Generating audio for word: "off"');
      
      const audioBuffer = await client.generateAudio(
        'off',
        config.voices[0].id, // Rachel voice
        config.elevenlabs.voiceSettings
      );
      
      console.log(`✅ Generated audio: ${audioBuffer.byteLength} bytes`);
      
      // Test audio playback
      console.log('\n🔊 Testing audio playback...');
      const audioPlayer = new AudioPlayer(config.audio.platform, config.audio.autoPlay);
      
      await audioPlayer.play(audioBuffer);
      console.log('✅ Audio playback test complete');
      
    } else {
      console.log('❌ API key validation failed');
      console.log('ℹ️  This is expected if using a test key');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes('Authentication failed')) {
      console.log('ℹ️  This is expected when using a test API key');
      console.log('ℹ️  Set a real ELEVENLABS_API_KEY to test actual generation');
    }
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testElevenLabsIntegration();
}
