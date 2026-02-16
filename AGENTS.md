# AGENTS.md - AI Assistant Guide for Spelling Website

## Project Overview

The Spelling Website is a React-based educational application with an integrated voice generation system. It consists of two main components:

1. **Frontend Application**: React 19 app for spelling practice with OIDC authentication
2. **Voice Tool**: Node.js CLI tool for generating AI voices via ElevenLabs API

## Quick Context for AI Assistants

### Primary Technologies
- **Frontend**: React 19, TypeScript, Vite, React Router v7, OIDC authentication
- **Voice Tool**: Node.js, TypeScript, ElevenLabs API, AWS S3, Kiro CLI compatible
- **Testing**: Vitest, React Testing Library
- **Build**: Vite for frontend, TypeScript compiler for voice tool

### Recent Development Focus (Jan-Feb 2026)
- **Voice Integration**: VoiceService in frontend with MP3 manifest lookup + TTS fallback
- **Word Database Expansion**: ~470 words across 5 lists (Year 1, Common, Year 2, List A, List B)
- **DRY Architecture**: Centralized mastery thresholds and configuration-driven word selection pages
- **Voice Manifest Pipeline**: Scripts for generating, deploying, and validating voice manifests
- **CI/CD**: Auto PR creation workflow with reviewer assignment

## Directory Structure and File Organization

```
spellingWebsite/
├── src/                          # React frontend application
│   ├── App.tsx                   # Main app component with 6 protected routes
│   ├── components/               # Reusable UI components
│   │   ├── Header.tsx           # Navigation and auth status
│   │   ├── ProtectedRoute.tsx   # Route guard component
│   │   ├── BaseWordSelection.tsx # Shared word selection logic (config-driven)
│   │   ├── Challenge.tsx        # Gamification with progress & motivation messages
│   │   └── WordChip.tsx         # Word display component
│   ├── pages/                   # Page-level components
│   │   ├── ChallengesPage.tsx   # Dashboard for 4 challenge types
│   │   ├── WordSelection.tsx    # Year 1 word selection
│   │   ├── CommonWordsSelection.tsx # Common words selection
│   │   ├── SpellingListASelection.tsx # Spelling List A (NEW)
│   │   ├── SpellingListBSelection.tsx # Spelling List B (NEW)
│   │   ├── SpellingTest.tsx     # Core spelling test with VoiceService
│   │   ├── ProfilePage.tsx      # User profile with analytics
│   │   └── Login.tsx            # Authentication page
│   ├── services/                # Frontend service layer
│   │   └── VoiceService.ts     # MP3 manifest + TTS fallback (NEW)
│   ├── contexts/                # React contexts (ProgressProvider)
│   ├── hooks/                   # Custom hooks (useWord with dynamic thresholds)
│   ├── config/                  # Configuration management
│   │   ├── masteryThresholds.ts # Centralized mastery thresholds (NEW)
│   │   └── wordSelectionConfigs.ts # Config-driven word selection pages
│   ├── data/                    # Data models (~470 words across 5 lists)
│   └── utils/                   # Utility functions
├── voice-tool/                  # Voice generation system
│   ├── src/
│   │   ├── services/            # Core business logic services
│   │   │   ├── ElevenLabsService # Voice generation API
│   │   │   ├── AudioService     # Audio file management
│   │   │   ├── S3Service        # AWS S3 integration
│   │   │   ├── ProgressService  # State persistence
│   │   │   ├── BatchService     # Batch processing
│   │   │   ├── ReviewService    # Human review workflow
│   │   │   └── UploadService    # S3 deployment
│   │   ├── types/               # TypeScript interfaces
│   │   ├── config/              # Configuration management
│   │   └── cli/                 # CLI interfaces
│   ├── kiro-cli.js             # AI agent interface (Kiro CLI)
│   ├── generate-manifest.js    # Build voice manifest from S3 (NEW)
│   ├── deploy-manifest.js      # Deploy manifest to S3 (NEW)
│   ├── check-missing-files.js  # Validate manifest consistency (NEW)
│   ├── upload-approved-only.js # Selective S3 upload (NEW)
│   ├── real-words.ts           # Production word list (220+ words)
│   ├── test-5-words.ts         # Quick test word list
│   ├── progress/               # State persistence files
│   └── audio-cache/            # Generated audio files
├── public/                     # Static assets
│   └── voices/
│       └── voice-manifest.json # Word ID → CDN audio URL mapping (NEW)
├── infrastructure/             # Private git submodule (NEW)
├── lambdas/                    # AWS Lambda functions
├── .github/workflows/          # CI/CD (auto PR creation)
└── scripts/                    # Build and deployment scripts
```

## Development Patterns and Conventions

### React Component Patterns

#### Component Structure
```typescript
// Standard functional component pattern
export default function ComponentName({ prop1, prop2 }: Props) {
  const [localState, setLocalState] = useState<Type>(initialValue);
  
  // Event handlers
  const handleEvent = (param: Type) => {
    // Handle event logic
  };
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
}
```

#### State Management Patterns
- **Local State**: `useState` for component-specific state
- **Lifted State**: Pass state up to parent components (see App.tsx word selection)
- **Context**: React Context for authentication (OIDC) and progress tracking (ProgressProvider)
- **Configuration**: Centralized configs drive word selection pages (`wordSelectionConfigs`) and mastery thresholds (`getMasteryThreshold`)
- **Props Down, Events Up**: Standard React data flow pattern

#### Route Protection Pattern
```typescript
// All main routes wrapped with ProtectedRoute
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <ProtectedComponent />
    </ProtectedRoute>
  }
/>
```

### Voice Tool Service Patterns

#### Service Layer Architecture
- **Single Responsibility**: Each service handles one concern
- **Dependency Injection**: Services receive dependencies via constructor
- **Error Handling**: Consistent error handling with retry logic
- **State Persistence**: JSON-based progress tracking for resume capability

#### CLI Interface Pattern
```typescript
// Kiro CLI compatible command structure
node --env-file=.env kiro-cli.js --command [args]

// Available commands:
--batch          # Generate all missing audio
--play word      # Review specific word
--accept word    # Accept current voice
--reject word    # Reject and try next voice
--upload         # Deploy to S3
--status         # Show progress
```

## Testing Patterns

### Frontend Testing
- **Component Tests**: React Testing Library for user-centric testing
- **Test Files**: `.test.tsx` suffix (e.g., `WordChip.test.tsx`)
- **Testing Philosophy**: Test user interactions, not implementation details
- **Mocking**: Mock external dependencies and API calls

### Voice Tool Testing
- **Unit Tests**: Service layer testing with mocked dependencies
- **Integration Tests**: API integration validation
- **CLI Tests**: Command interface testing
- **Test Data**: Use `test-5-words.ts` for quick development testing

## Configuration Management

### Frontend Configuration
- **Environment Variables**: Build-time injection via Vite
- **OIDC Config**: Authentication provider configuration
- **API Endpoints**: Configurable base URLs
- **Mastery Thresholds**: `src/config/masteryThresholds.ts` - DEFAULT_THRESHOLD=3, List A/B=10
- **Word Selection Configs**: `src/config/wordSelectionConfigs.ts` - Drives all 4 word selection pages with titles, themes, filters, challenge configs

### Voice Tool Configuration
```typescript
// Environment variables (.env file)
ELEVENLABS_API_KEY=your_api_key_here
S3_BUCKET=spellmatereact
S3_REGION=eu-west-2
S3_KEY_PREFIX=voices
AUDIO_PLATFORM=macos
AUTO_PLAY_AUDIO=true
WORDS_FILE=./real-words.ts  # or ./test-5-words.ts for testing
```

## API Integration Patterns

### ElevenLabs API Integration
- **Rate Limiting**: Built-in request throttling
- **Voice Fallback**: Rachel → Dorothy → Emily → Thomas → Antoni → Adam
- **Error Handling**: Exponential backoff with retry logic
- **Quality Control**: Human-in-the-loop review workflow

### AWS S3 Integration
- **Upload Pattern**: Direct upload with proper caching headers
- **File Structure**: `voices/{voice_name}/{word_id}.mp3`
- **CDN Delivery**: Public read access via `https://spellingninjas.com/voices/...`
- **Batch Operations**: Parallel uploads with progress tracking
- **Voice Manifest**: JSON file mapping word IDs to CDN URLs, deployed to S3

### Voice Playback (Frontend)
- **VoiceService** (`src/services/VoiceService.ts`): Singleton audio playback service
- **Strategy**: MP3-first (lookup in voice manifest) with browser TTS fallback
- **Manifest**: Lazy-loaded from `/voices/voice-manifest.json` on first use
- **Audio**: Single `HTMLAudioElement` instance, Promise-based API

### OIDC Authentication
- **Flow**: Authorization Code Flow with PKCE
- **Token Management**: Automatic refresh with react-oidc-context
- **Route Protection**: All main routes behind authentication

## Development Workflow

### Frontend Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Voice Tool Development
```bash
# Build TypeScript
npm run build

# Quick test (5 words, ~10 seconds)
WORDS_FILE=./test-5-words.ts node --env-file=.env kiro-cli.js --batch

# Test audio playback
node --env-file=.env kiro-cli.js --play cat

# Full production run (220+ words, ~5-10 minutes)
node --env-file=.env kiro-cli.js --batch

# Check status
node --env-file=.env kiro-cli.js --status
```

## Common Development Tasks

### Adding New React Components
1. Create component file in appropriate directory (`src/components/` or `src/pages/`)
2. Follow functional component pattern with TypeScript
3. Add to routing in `App.tsx` if it's a page component
4. Wrap with `ProtectedRoute` if authentication required
5. Add tests in `.test.tsx` file

### Adding New Voice Tool Services
1. Create service in `src/services/` directory
2. Follow service layer pattern with dependency injection
3. Add TypeScript interfaces in `src/types/`
4. Integrate with CLI interface in `kiro-cli.js`
5. Add unit tests

### Modifying Word Lists
- **Frontend Words**: Modify `src/data/words.ts` - Word type: `{ id, text, year: 1|2, category }`
- **Voice Tool Words**: Use `test-5-words.ts` for quick testing, `real-words.ts` for production
- **Word Lists**: YEAR1_WORDS (~122), COMMON_WORDS (~82), YEAR2_WORDS (~94), SPELLING_LIST_A (~90), SPELLING_LIST_B (~76)
- **Word IDs**: `id` equals display text for all words (e.g. `id: 'door', text: 'door'`); progress is keyed by word text and shared across lists

### Adding a New Word Selection Page
1. Add word list to `src/data/words.ts` following existing `Word` type pattern
2. Add config to `src/config/wordSelectionConfigs.ts` with words, title, theme, challenge config
3. Create thin wrapper page in `src/pages/` (delegates to `BaseWordSelection`)
4. Add route in `App.tsx` wrapped with `ProtectedRoute`
5. Add challenge card in `ChallengesPage.tsx`
6. If different mastery threshold needed, update `src/config/masteryThresholds.ts`

### Voice Generation Workflow
1. **Generate**: `--batch` command processes all missing words
2. **Review**: `--play word` to listen to generated audio
3. **Accept/Reject**: `--accept word` or `--reject word` to control quality
4. **Alternative Voices**: Rejection automatically tries next voice in chain
5. **Upload**: `upload-approved-only.js` uploads completed audio to S3
6. **Manifest**: `generate-manifest.js` builds manifest from S3, `deploy-manifest.js` deploys it
7. **Validate**: `check-missing-files.js` ensures consistency between manifest and progress

## Error Handling Guidelines

### Frontend Error Handling
- **Route Guards**: Redirect to login for unauthenticated users
- **API Errors**: Graceful degradation with user-friendly messages
- **Component Boundaries**: Use error boundaries for component failures

### Voice Tool Error Handling
- **API Failures**: Exponential backoff with configurable retry limits
- **File System Errors**: Proper permission and disk space handling
- **State Recovery**: Resume from last known good state on restart
- **User Feedback**: Clear error messages with suggested actions

## Performance Considerations

### Frontend Performance
- **Code Splitting**: Vite handles automatic route-based splitting
- **Bundle Size**: Current core bundle ~82KB gzipped
- **Audio Caching**: Browser caching of CDN-delivered audio files
- **Voice Manifest**: Lazy-loaded once on first voice playback
- **Lazy Loading**: Route-based component lazy loading

### Voice Tool Performance
- **Batch Processing**: Configurable batch sizes for API rate limits
- **Local Caching**: Audio files cached during generation process
- **Parallel Processing**: Multiple concurrent voice generation streams
- **Resume Capability**: Avoid re-processing completed work

## Deployment and Operations

### Frontend Deployment
- **Build Tool**: Vite optimized production builds
- **Static Hosting**: Suitable for CDN deployment
- **Environment Config**: Build-time configuration injection

### Voice Tool Deployment
- **Local Execution**: Runs on developer machines
- **Cloud Integration**: Direct AWS S3 and ElevenLabs API access
- **State Persistence**: JSON files for progress tracking
- **Cleanup**: Automatic temporary file cleanup

## AI Assistant Usage Guidelines

### Effective Patterns
1. **Context Files**: Add `.sop/summary/index.md` to context for comprehensive project understanding
2. **Specific Documentation**: Reference individual files in `.sop/summary/` for detailed information
3. **Recent Changes**: Focus on `src/config/`, `src/services/`, and `src/pages/` for latest frontend work
4. **Testing**: Use `test-5-words.ts` for quick development cycles

### Common Questions and Answers

**Q: How do I add a new spelling word?**
A: Add to `src/data/words.ts` (appropriate list), run voice-tool `--batch` to generate audio, then update manifest

**Q: How do I add a new word list/challenge?**
A: Add words to `words.ts`, add config to `wordSelectionConfigs.ts`, create wrapper page, add route in `App.tsx`, add card to `ChallengesPage.tsx`. Update `masteryThresholds.ts` if needed.

**Q: How do I test voice generation quickly?**
A: Use `WORDS_FILE=./test-5-words.ts node --env-file=.env kiro-cli.js --batch`

**Q: How do I add a new React page?**
A: Create component in `src/pages/`, add route in `App.tsx`, wrap with `ProtectedRoute`

**Q: How do I handle authentication in new components?**
A: Use `useAuth()` hook from react-oidc-context, wrap routes with `ProtectedRoute`

**Q: How do I modify mastery thresholds?**
A: Edit `src/config/masteryThresholds.ts` - adjust `DEFAULT_THRESHOLD` or add word IDs to high-threshold sets

**Q: How does voice playback work?**
A: VoiceService loads `/voices/voice-manifest.json` once, looks up word IDs to get CDN URLs, plays MP3. Falls back to browser TTS if no MP3 found.

**Q: How do I deploy new voice audio?**
A: `upload-approved-only.js` → `generate-manifest.js` → `deploy-manifest.js` → `check-missing-files.js`

## Troubleshooting Common Issues

### Voice Tool Issues
- **API Key Errors**: Check `ELEVENLABS_API_KEY` in `.env` file
- **S3 Upload Failures**: Verify AWS credentials and bucket permissions
- **Audio Playback Issues**: Check `AUDIO_PLATFORM` setting (macos/linux/windows)
- **Progress Lost**: Check `progress/` directory for state files

### Frontend Issues
- **Authentication Loops**: Check OIDC provider configuration
- **Route Access Issues**: Verify `ProtectedRoute` wrapping
- **Build Failures**: Check TypeScript errors and dependency versions
- **Audio Not Playing**: Check voice manifest loaded correctly, verify CDN URLs accessible, check browser TTS fallback
- **Mastery Not Tracking**: Check `getMasteryThreshold()` returns expected value for the word (id/text), verify `ProgressProvider` is wrapping the component tree

This guide provides the essential context for AI assistants to effectively help with development tasks in the Spelling Website project. For detailed technical specifications, refer to the individual documentation files in `.sop/summary/`.
