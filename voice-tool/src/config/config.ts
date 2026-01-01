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
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'sarah',
    description: 'Young adult woman with confident, warm, mature quality'
  },
  {
    id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'laura',
    description: 'Young adult female with sunny enthusiasm and quirky attitude'
  },
  {
    id: 'IKne3meq5aSn9XLyUdCD',
    name: 'charlie',
    description: 'Young Australian male with confident and energetic voice'
  },
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'george',
    description: 'Warm British male voice that captivates listeners'
  },
  {
    id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'alice',
    description: 'Clear and engaging British female, suitable for education'
  },
  {
    id: 'XrExE9yKIg1WjnnlVkGX',
    name: 'matilda',
    description: 'Professional American female with pleasing alto pitch'
  },
  {
    id: 'cgSgspJ2msm6clMCkdW9',
    name: 'jessica',
    description: 'Young playful American female, bright and warm'
  },
  {
    id: 'cjVigY5qzO86Huf0OWal',
    name: 'eric',
    description: 'Smooth American male tenor, trustworthy'
  },
  {
    id: 'iP95p4xoKVk53GoZ742B',
    name: 'chris',
    description: 'Natural down-to-earth American male voice'
  },
  {
    id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'daniel',
    description: 'Strong British male voice, professional broadcaster'
  },
  {
    id: 'pFZP5JQG7iQjIQuC4Bku',
    name: 'lily',
    description: 'Velvety British female voice with warmth and clarity'
  },
  {
    id: 'bIHbv24MWmeRgasZH58o',
    name: 'will',
    description: 'Conversational and laid back American male'
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
    verboseLogging: process.env.VERBOSE_LOGGING === 'true',
    wordsFile: process.env.WORDS_FILE || './real-words.ts'
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
