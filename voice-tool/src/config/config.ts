import { AppConfig, VoiceConfig, ElevenLabsConfig, S3Config, AudioConfig, CLIConfig } from '../types/index.js';

// Default voice configurations
export const DEFAULT_VOICES: VoiceConfig[] = [
  {
    id: '21m00Tcm4TlvDq8ikWAM',
    name: 'rachel',
    description: 'Clear, neutral female voice, child-friendly'
  },
  {
    id: 'ThT5KcBeYPX3keUQqHPh',
    name: 'dorothy',
    description: 'Pleasant, young female, British accent, ideal for children\'s stories'
  },
  {
    id: 'LcfcDJNUP1GQjkzn1xUU',
    name: 'emily',
    description: 'Calm, young female, American accent'
  },
  {
    id: 'GBv7mTt0atIp3Br8iCZE',
    name: 'thomas',
    description: 'Calm, young male, American accent'
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'antoni',
    description: 'Well-rounded, young male, American accent'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'adam',
    description: 'Deep, male voice, American accent'
  }
];

export function loadConfig(): AppConfig {
  const elevenlabs: ElevenLabsConfig = {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    baseUrl: 'https://api.elevenlabs.io',
    defaultModel: 'eleven_turbo_v2_5',
    voiceSettings: {
      modelId: 'eleven_turbo_v2_5',
      stability: 0.6,
      similarityBoost: 0.8,
      style: 0.2,
      useSpeakerBoost: true,
      outputFormat: 'mp3_44100_128'
    },
    rateLimitPerMinute: 50,
    maxRetries: 3,
    timeoutSeconds: 240
  };

  const s3: S3Config = {
    bucketName: process.env.S3_BUCKET || 'spellmatereact',
    region: process.env.S3_REGION || 'eu-west-2',
    keyPrefix: process.env.S3_KEY_PREFIX || 'voices'
  };

  const audio: AudioConfig = {
    platform: (process.env.AUDIO_PLATFORM as any) || 'macos',
    autoPlay: process.env.AUTO_PLAY_AUDIO !== 'false',
    fallbackCommand: undefined
  };

  const cli: CLIConfig = {
    defaultMode: 'interactive',
    outputFormat: 'human',
    autoPlayAudio: true,
    verboseLogging: process.env.VERBOSE_LOGGING === 'true'
  };

  return {
    elevenlabs,
    s3,
    audio,
    voices: DEFAULT_VOICES,
    cli
  };
}

export function validateConfig(config: AppConfig): string[] {
  const errors: string[] = [];

  if (!config.elevenlabs.apiKey) {
    errors.push('ELEVENLABS_API_KEY is required');
  }

  if (!config.s3.bucketName) {
    errors.push('S3_BUCKET is required');
  }

  return errors;
}
