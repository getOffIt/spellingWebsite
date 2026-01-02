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

### Recent Development Focus
The **voice-tool directory** contains the most recent development work:
- ElevenLabs API integration for voice generation
- Batch processing with human-in-the-loop review
- AWS S3 deployment automation
- Kiro CLI agent compatibility

## Directory Structure and File Organization

```
spellingWebsite/
├── src/                          # React frontend application
│   ├── App.tsx                   # Main app component with routing
│   ├── components/               # Reusable UI components
│   │   ├── Header.tsx           # Navigation and auth status
│   │   ├── ProtectedRoute.tsx   # Route guard component
│   │   ├── BaseWordSelection.tsx # Shared word selection logic
│   │   ├── Challenge.tsx        # Individual challenge display
│   │   └── WordChip.tsx         # Word display component
│   ├── pages/                   # Page-level components
│   │   ├── ChallengesPage.tsx   # Main dashboard
│   │   ├── WordSelection.tsx    # Word list selection
│   │   ├── SpellingTest.tsx     # Core spelling test functionality
│   │   ├── ProfilePage.tsx      # User profile management
│   │   └── Login.tsx            # Authentication page
│   ├── contexts/                # React contexts for state
│   ├── hooks/                   # Custom React hooks
│   ├── config/                  # Configuration management
│   ├── data/                    # Data models and constants
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
│   ├── real-words.ts           # Production word list (220+ words)
│   ├── test-5-words.ts         # Quick test word list
│   ├── progress/               # State persistence files
│   └── audio-cache/            # Generated audio files
├── public/                     # Static assets
├── lambdas/                    # AWS Lambda functions
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
- **Context**: React Context for authentication (OIDC context)
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
- **CDN Delivery**: Public read access for audio playback
- **Batch Operations**: Parallel uploads with progress tracking

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
- **Development**: Use `test-5-words.ts` for quick testing
- **Production**: Modify `real-words.ts` for production word list
- **Format**: Flat array of strings, no nested structures

### Voice Generation Workflow
1. **Generate**: `--batch` command processes all missing words
2. **Review**: `--play word` to listen to generated audio
3. **Accept/Reject**: `--accept word` or `--reject word` to control quality
4. **Alternative Voices**: Rejection automatically tries next voice in chain
5. **Deploy**: `--upload` command deploys approved audio to S3

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
- **Audio Caching**: Browser caching of S3-delivered audio files
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
3. **Recent Changes**: Focus on `voice-tool/` directory for latest development work
4. **Testing**: Use `test-5-words.ts` for quick development cycles

### Common Questions and Answers

**Q: How do I add a new spelling word?**
A: Add to `real-words.ts` array, then run `--batch` to generate audio

**Q: How do I test voice generation quickly?**
A: Use `WORDS_FILE=./test-5-words.ts node --env-file=.env kiro-cli.js --batch`

**Q: How do I add a new React page?**
A: Create component in `src/pages/`, add route in `App.tsx`, wrap with `ProtectedRoute`

**Q: How do I handle authentication in new components?**
A: Use `useAuth()` hook from react-oidc-context, wrap routes with `ProtectedRoute`

**Q: How do I modify the voice generation workflow?**
A: Edit services in `voice-tool/src/services/`, update CLI interface in `kiro-cli.js`

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
- **Audio Not Playing**: Verify S3 URLs and CORS configuration

This guide provides the essential context for AI assistants to effectively help with development tasks in the Spelling Website project. For detailed technical specifications, refer to the individual documentation files in `.sop/summary/`.
