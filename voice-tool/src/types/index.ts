// Core data types for the voice generation tool

export interface Word {
  id: string          // Unique identifier (e.g., "off", "stuff")
  text: string        // The word to be spoken
  year: 1 | 2        // School year level
  category: string    // Phonics category (e.g., "ff", "ll")
}

export interface VoiceConfig {
  id: string
  name: string
  description: string
}

export interface VoiceSettings {
  modelId: string
  stability: number
  similarityBoost: number
  style: number
  useSpeakerBoost: boolean
  outputFormat: string
}

export interface GenerationResult {
  wordId: string
  success: boolean
  audioBuffer?: ArrayBuffer
  error?: string
}

export interface CompletedWord {
  wordId: string
  voiceUsed: string
  audioPath: string
  completedAt: Date
}

export interface ProgressState {
  completedWords: Map<string, CompletedWord>
  failedWords: string[]
  lastProcessedIndex: number
  sessionStartTime: Date
}

export interface WordProgress {
  wordId: string
  status: 'pending' | 'completed' | 'failed' | 'skipped'
  voiceUsed?: string
  generatedVoices: string[]  // List of voices generated for this word
  localAudioPath?: string
  s3Uploaded: boolean
  attempts: number
  lastError?: string
  completedAt?: Date
}

export interface ProgressData {
  version: string
  sessionId: string
  startedAt: Date
  lastUpdatedAt: Date
  totalWords: number
  completedCount: number
  failedCount: number
  words: Map<string, WordProgress>
}

export interface CommandConfig {
  mode: 'interactive' | 'batch' | 'review' | 'review-accept' | 'review-reject' | 'review-next' | 'status' | 'upload'
  wordId?: string
  options: CommandOptions
}

export interface CommandOptions {
  silent?: boolean
  verbose?: boolean
  jsonOutput?: boolean
  testMode?: boolean
}

export interface CommandResult {
  success: boolean
  message: string
  data?: any
  nextAction?: string
}

export interface AppConfig {
  elevenlabs: ElevenLabsConfig
  s3: S3Config
  audio: AudioConfig
  voices: VoiceConfig[]
  cli: CLIConfig
}

export interface ElevenLabsConfig {
  apiKey: string
  baseUrl: string
  defaultModel: string
  voiceSettings: VoiceSettings
  rateLimitPerMinute: number
  maxRetries: number
  timeoutSeconds: number
}

export interface S3Config {
  bucketName: string
  region: string
  keyPrefix: string
}

export interface AudioConfig {
  platform: 'macos' | 'linux' | 'windows'
  autoPlay: boolean
  fallbackCommand?: string
}

export interface CLIConfig {
  defaultMode: 'interactive' | 'command'
  outputFormat: 'human' | 'json'
  autoPlayAudio: boolean
  verboseLogging: boolean
  wordsFile: string  // Path to words file (default: './real-words.ts')
}

export enum OperationMode {
  Interactive = 'interactive',
  Batch = 'batch',
  Review = 'review', 
  Status = 'status',
  Upload = 'upload'
}

export enum ErrorType {
  Authentication = 'auth',      // Invalid API key
  RateLimit = 'rate_limit',     // 429 responses
  ServerError = 'server',       // 5XX responses
  Network = 'network',          // Connectivity issues
  Timeout = 'timeout',          // Request timeouts
  Validation = 'validation',    // 422 responses
  FileSystem = 'filesystem',    // Local file operations
  Unknown = 'unknown'
}

export enum ErrorAction {
  Retry = 'retry',
  Skip = 'skip', 
  Abort = 'abort',
  UserIntervention = 'user_intervention'
}
