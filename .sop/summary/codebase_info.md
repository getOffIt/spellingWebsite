# Codebase Information

## Project Overview
- **Name**: Spelling Website
- **Type**: React-based web application with voice generation tooling
- **Version**: 0.0.0
- **Technology Stack**: React 19, TypeScript, Vite, Node.js

## Directory Structure

### Main Application (`/src`)
- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest with React Testing Library
- **Routing**: React Router DOM v7
- **Authentication**: OIDC (OpenID Connect)

### Voice Tool (`/voice-tool`)
- **Purpose**: ElevenLabs voice generation and management
- **Technology**: Node.js with TypeScript
- **Integration**: AWS S3, ElevenLabs API
- **CLI Interface**: Kiro CLI compatible

## Key Components

### Main Application
- `src/App.tsx` - Main application component with 6 protected routes
- `src/components/` - Reusable UI components (BaseWordSelection, Challenge, WordChip, Header, ProtectedRoute)
- `src/pages/` - Page-level components (ChallengesPage, WordSelection, CommonWordsSelection, SpellingListASelection, SpellingListBSelection, SpellingTest, ProfilePage)
- `src/contexts/` - React contexts (ProgressProvider for API-backed progress tracking)
- `src/hooks/` - Custom hooks (useWord with dynamic mastery thresholds)
- `src/config/` - Configuration (masteryThresholds, wordSelectionConfigs)
- `src/services/` - Service layer (VoiceService for MP3/TTS audio)
- `src/data/` - Data models (~470 words across 5 lists)
- `src/utils/` - Utility functions

### Voice Tool
- `src/` - TypeScript source code
- `kiro-cli.js` - AI agent interface
- `real-words.ts` - Production word list (220+ words)
- `generate-manifest.js` - Builds voice manifest from S3
- `deploy-manifest.js` - Deploys manifest to S3
- `check-missing-files.js` - Validates manifest consistency
- `upload-approved-only.js` - Selective S3 upload for approved audio
- `progress/` - State persistence for voice generation
- `audio-cache/` - Generated audio files

### Static Assets
- `public/voices/voice-manifest.json` - Maps ~220 word IDs to CDN audio URLs

### Infrastructure
- `infrastructure/` - Private git submodule for infrastructure configuration
- `.github/workflows/` - CI/CD workflows (create-pr.yml with auto reviewer assignment)

## Dependencies

### Main Application
- **Core**: React 19, React DOM 19
- **Routing**: react-router-dom ^7.6.0
- **Authentication**: oidc-client-ts, react-oidc-context
- **UI Effects**: canvas-confetti
- **Development**: Vite, ESLint, Vitest

### Voice Tool
- **API Integration**: ElevenLabs API
- **Cloud Storage**: AWS S3
- **CLI Framework**: Kiro CLI compatible
- **Audio Processing**: Node.js native modules

## Architecture Patterns
- **Frontend**: Component-based React architecture
- **State Management**: React Context API
- **Authentication**: OIDC flow
- **Voice Generation**: Batch processing with human-in-the-loop review
- **File Organization**: Feature-based directory structure

## Recent Focus Areas
- Voice integration into frontend (VoiceService, voice manifest)
- Word database expansion (~470 words across 5 lists including Spelling List A & B)
- DRY refactoring (centralized mastery thresholds, configuration-driven word selection pages)
- Voice manifest pipeline (generate, deploy, validate scripts)
- CI/CD improvements (auto PR creation with reviewer assignment)
- Infrastructure as git submodule
