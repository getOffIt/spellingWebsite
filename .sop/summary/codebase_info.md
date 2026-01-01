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
- `src/App.tsx` - Main application component
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/contexts/` - React contexts for state management
- `src/hooks/` - Custom React hooks
- `src/config/` - Configuration management
- `src/data/` - Data models and constants
- `src/utils/` - Utility functions

### Voice Tool
- `src/` - TypeScript source code
- `kiro-cli.js` - AI agent interface
- `real-words.ts` - Production word list (220+ words)
- `progress/` - State persistence for voice generation
- `audio-cache/` - Generated audio files

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
- Voice tool development and integration
- ElevenLabs API integration
- AWS S3 deployment automation
- AI agent compatibility (Kiro CLI)
