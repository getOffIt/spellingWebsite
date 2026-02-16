# Data Models and Structures #data

## Frontend Data Models #react

### Word and List Structures

#### Word Type (actual implementation)
```typescript
type Word = {
  id: string;
  text: string;
  year: 1 | 2;
  category: string;
}
```

#### Word Lists (src/data/words.ts)
- **YEAR1_WORDS**: ~122 words (double consonants, digraphs, suffixes, vowel digraphs, two-syllable)
- **COMMON_WORDS**: ~82 common words in 12 categories
- **YEAR2_WORDS**: ~94 words (suffixes like -less, -ies, comparatives, misc)
- **SPELLING_LIST_A**: ~90 words (tion/sion, double consonants, homophones)
- **SPELLING_LIST_B**: ~76 words (oor patterns, unstressed vowels)
- **ALL_WORDS**: Combined array (~470 words total)

For all lists, **word identity**: `id` equals display text (e.g. `id: 'door', text: 'door'`). Progress is keyed by this word text and shared across lists when the same word appears in multiple lists.

#### Word Selection Configuration (NEW)
```typescript
interface WordSelectionConfig {
  words: Word[];
  title: string;
  themeClass?: string;
  wordFilter?: (word: Word) => boolean;
  challengeConfig?: ChallengeConfig;
  masteryThreshold?: number;
}
```

#### Word List Selection State
```typescript
interface WordListConfig {
  words: string[];
  type: 'single' | 'less_family';
  testMode?: 'practice' | 'full_test';
  passThreshold?: number;
}
```

#### Word List Types
- **single**: Individual words for spelling practice
- **less_family**: Word families with common patterns (e.g., -less suffix)

#### Test Configuration
```typescript
interface TestConfig {
  mode: 'practice' | 'full_test';
  passThreshold: number; // Percentage required to pass
  allowRetries: boolean;
  showCorrectAnswer: boolean;
  audioPlayLimit?: number;
}
```

### User and Authentication Models

#### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferredVoice?: string;
  testHistory: TestSession[];
  preferences: UserPreferences;
}

interface UserPreferences {
  autoPlayAudio: boolean;
  showHints: boolean;
  preferredDifficulty: 'easy' | 'medium' | 'hard';
  audioVolume: number;
}
```

#### Authentication State
```typescript
interface AuthState {
  user?: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}
```

### Test and Progress Models

#### Test Session
```typescript
interface TestSession {
  sessionId: string;
  userId: string;
  listType: 'single' | 'less_family';
  testMode: 'practice' | 'full_test';
  words: string[];
  results: TestResult[];
  startedAt: string;
  completedAt?: string;
  score: number;
  passed: boolean;
  timeSpent: number;
}

interface TestResult {
  wordId: string;
  word: string;
  userInput: string;
  correct: boolean;
  attempts: number;
  timeSpent: number;
  audioPlayCount: number;
  hintsUsed: number;
}
```

#### Progress Tracking (actual implementation)
```typescript
// ProgressProvider context types
type ProgressData = Record<string, WordAttempt[]>; // wordId → attempts array

interface WordAttempt {
  date: string;
  correct: boolean;
  attempt: string;
}

interface WordStats {
  status: 'not-started' | 'in-progress' | 'mastered';
  attempts: number;
  streak: number; // consecutive correct (reverse iteration)
  lastSeen: string;
}
```

#### Mastery Thresholds (NEW - src/config/masteryThresholds.ts)
```typescript
const MASTERY_THRESHOLD = 10; // Consecutive correct answers for all words
function getMasteryThreshold(wordId: string): number;
```

#### Challenge Configuration (NEW)
```typescript
interface ChallengeConfig {
  title: string;
  description: string;
  rewardText: string;
  motivationMessages: Record<string, string>; // threshold → message template
}
// Template variables: {remaining}, {total}, {mastered}
```

#### Voice Manifest (NEW - public/voices/voice-manifest.json)
```typescript
// Simple key-value mapping
type VoiceManifest = Record<string, string>;
// Example: { "cat": "https://spellingninjas.com/voices/dorothy/cat.mp3" }
```

## Voice Tool Data Models #voice-tool

### Voice Generation Models

#### Voice Configuration
```typescript
interface VoiceConfig {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  language: string;
  description: string;
  isDefault: boolean;
  priority: number;
}

interface VoiceSettings {
  stability: number; // 0.0 - 1.0
  similarityBoost: number; // 0.0 - 1.0
  style?: number; // 0.0 - 1.0
  useSpeakerBoost?: boolean;
}
```

#### Voice Generation Request
```typescript
interface VoiceGenerationRequest {
  text: string;
  voiceId: string;
  wordId: string;
  outputPath: string;
  settings?: VoiceSettings;
  metadata: {
    listType: string;
    difficulty?: number;
    category?: string;
  };
}

interface VoiceGenerationResponse {
  success: boolean;
  audioPath?: string;
  duration?: number;
  fileSize?: number;
  error?: VoiceGenerationError;
  metadata: AudioMetadata;
}
```

### Progress and State Models

#### Generation Progress State
```typescript
interface GenerationProgressState {
  sessionId: string;
  totalWords: number;
  completed: string[];
  failed: string[];
  pending: string[];
  currentVoice: string;
  startedAt: string;
  lastUpdated: string;
  errors: Record<string, GenerationError>;
  statistics: GenerationStatistics;
}

interface GenerationStatistics {
  totalRequests: number;
  successfulGenerations: number;
  failedGenerations: number;
  averageDuration: number;
  totalAudioDuration: number;
  apiCallsUsed: number;
  charactersProcessed: number;
}

interface GenerationError {
  wordId: string;
  voice: string;
  error: string;
  timestamp: string;
  retryCount: number;
  lastRetryAt?: string;
}
```

#### Review State
```typescript
interface ReviewState {
  wordId: string;
  availableVoices: string[];
  currentVoice: string;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  qualityScore?: number;
}

interface BatchReviewState {
  sessionId: string;
  totalWords: number;
  reviewed: ReviewState[];
  pending: string[];
  approved: string[];
  rejected: string[];
  currentIndex: number;
  startedAt: string;
  lastUpdated: string;
}
```

### Storage and Deployment Models

#### Audio File Metadata
```typescript
interface AudioMetadata {
  wordId: string;
  word: string;
  voice: string;
  voiceId: string;
  duration: number;
  fileSize: number;
  format: 'mp3' | 'wav';
  sampleRate: number;
  bitRate: number;
  generatedAt: string;
  localPath: string;
  s3Key?: string;
  s3Url?: string;
  uploadedAt?: string;
  cacheControl?: string;
}
```

#### S3 Upload State
```typescript
interface S3UploadState {
  sessionId: string;
  totalFiles: number;
  uploaded: UploadResult[];
  pending: string[];
  failed: UploadError[];
  currentFile?: string;
  startedAt: string;
  completedAt?: string;
  statistics: UploadStatistics;
}

interface UploadResult {
  wordId: string;
  localPath: string;
  s3Key: string;
  s3Url: string;
  fileSize: number;
  uploadedAt: string;
  duration: number;
}

interface UploadError {
  wordId: string;
  localPath: string;
  error: string;
  timestamp: string;
  retryCount: number;
}

interface UploadStatistics {
  totalFiles: number;
  successfulUploads: number;
  failedUploads: number;
  totalBytes: number;
  averageUploadTime: number;
  totalUploadTime: number;
}
```

## Configuration Models

### Application Configuration
```typescript
interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  auth: {
    authority: string;
    clientId: string;
    redirectUri: string;
    scope: string;
  };
  audio: {
    defaultVoice: string;
    maxPlayCount: number;
    volume: number;
    autoPlay: boolean;
  };
}
```

### Voice Tool Configuration
```typescript
interface VoiceToolConfig {
  elevenlabs: {
    apiKey: string;
    baseUrl: string;
    defaultVoice: string;
    voiceSettings: VoiceSettings;
    rateLimits: {
      requestsPerMinute: number;
      charactersPerMonth: number;
    };
  };
  aws: {
    region: string;
    bucket: string;
    keyPrefix: string;
    cacheControl: string;
  };
  processing: {
    batchSize: number;
    maxRetries: number;
    retryDelay: number;
    parallelRequests: number;
  };
  storage: {
    tempDir: string;
    cacheDir: string;
    progressFile: string;
    cleanupOnExit: boolean;
  };
}
```

## Data Validation Schemas

### Word List Validation
```typescript
interface WordListValidation {
  minWords: number;
  maxWords: number;
  allowedCharacters: RegExp;
  maxWordLength: number;
  requiredFields: string[];
}
```

### Audio Quality Validation
```typescript
interface AudioQualityMetrics {
  minDuration: number; // seconds
  maxDuration: number; // seconds
  minFileSize: number; // bytes
  maxFileSize: number; // bytes
  requiredFormat: string[];
  minSampleRate: number;
  maxSilenceDuration: number;
}
```

## Error and Status Models

### Error Types
```typescript
enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  API_ERROR = 'api_error',
  NETWORK_ERROR = 'network_error',
  FILE_ERROR = 'file_error',
  AUTHENTICATION_ERROR = 'auth_error',
  PERMISSION_ERROR = 'permission_error',
  QUOTA_ERROR = 'quota_error',
  TIMEOUT_ERROR = 'timeout_error'
}

interface ApplicationError {
  type: ErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  context?: {
    userId?: string;
    sessionId?: string;
    wordId?: string;
    operation?: string;
  };
}
```

### Status Models
```typescript
interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  services: {
    frontend: ServiceStatus;
    voiceTool: ServiceStatus;
    elevenlabs: ServiceStatus;
    s3: ServiceStatus;
    auth: ServiceStatus;
  };
  lastChecked: string;
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  errorRate?: number;
  lastError?: string;
  uptime?: number;
}
```
