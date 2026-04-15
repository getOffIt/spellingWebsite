# ElevenLabs Voice Generation Tool

A comprehensive tool for generating, reviewing, and deploying audio files for the Spelling Website using ElevenLabs API.

## Features

- **Batch Audio Generation**: Generate audio for all spelling words using ElevenLabs API
- **Human-in-the-Loop Review**: Interactive workflow for voice selection and quality control
- **Multiple Voice Support**: Rachel, Dorothy, Emily, Thomas, Antoni, and Adam voices
- **Interactive CLI**: Fast local workflow for batch generation, review, status, and upload
- **AI Agent Integration**: Legacy `kiro-cli.js` interface for agent-driven workflows
- **S3 Deployment**: Direct upload to AWS S3 with proper structure
- **Progress Tracking**: Resume capability for interrupted sessions
- **Error Handling**: Robust retry logic and graceful failure management

## Quick Start

1. **Setup Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your ElevenLabs API key
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build Project**:
   ```bash
   npm run build
   ```

4. **Quick Test (5 words)**:
   ```bash
   WORDS_FILE=./test-5-words.ts node --env-file=.env dist/index.js --batch
   node --env-file=.env dist/index.js --interactive
   ```

5. **Full Production Run**:
   ```bash
   # Uses ./real-words.ts by default
   node --env-file=.env dist/index.js --batch
   ```

## Usage

### Primary CLI Workflow
```bash
# Open the interactive menu
node --env-file=.env dist/index.js --interactive

# Generate all missing audio
node --env-file=.env dist/index.js --batch

# Upload approved audio only
node --env-file=.env dist/index.js --upload

# Check status
node --env-file=.env dist/index.js --status
```

### Manifest Workflow
```bash
# 1. Upload approved audio only
node --env-file=.env dist/index.js --upload

# 2. Generate manifest from approved review state
npm run create-manifest

# 3. Deploy manifest to S3
npm run deploy-manifest
```

### Legacy AI-Agent Interface
```bash
# `kiro-cli.js` is still available for agent-driven workflows, but
# `dist/index.js` / `CLIInterface` is the primary path for manual use.
node --env-file=.env kiro-cli.js --status
```

## Configuration

Environment variables in `.env`:

```bash
# Required
ELEVENLABS_API_KEY=your_api_key_here

# AWS S3 (for upload)
S3_BUCKET=spellmatereact
S3_REGION=eu-west-2
S3_KEY_PREFIX=voices

# Optional
AUDIO_PLATFORM=macos
AUTO_PLAY_AUDIO=true
VERBOSE_LOGGING=false
WORDS_FILE=./real-words.ts  # Default: ./real-words.ts (use ./test-5-words.ts for testing)
```

## Architecture

- **TypeScript**: Full type safety and modern ES modules
- **Modular Design**: Separate services for each concern
- **Dual Interface**: Interactive CLI for manual use, plus a legacy agent-focused interface
- **State Persistence**: JSON-based progress tracking with resume capability
- **AWS Integration**: Direct S3 upload with proper caching headers

## Voice Selection Workflow

1. **Generate** audio with primary voice (Rachel)
2. **Play** and review audio quality
3. **Reject** to try alternative voices (Dorothy → Emily → Thomas → Antoni → Adam)
4. **Choose** your preferred voice from any generated options
5. **Upload** approved audio files to S3
6. **Generate and deploy** the manifest from approved review state

## File Structure

```
voice-tool/
├── src/                    # TypeScript source code
│   ├── services/          # Core business logic
│   ├── types/             # TypeScript interfaces
│   ├── config/            # Configuration management
│   └── cli/               # CLI interfaces
├── kiro-cli.js            # Legacy AI agent interface
├── real-words.ts          # Production word list (220 unique words, flat structure)
├── test-5-words.ts        # Quick test word list (5 words)
└── test-words.ts          # Development word list
```

## Development

```bash
# Build and watch
npm run build

# Quick test with 5 words (fast development cycle)
WORDS_FILE=./test-5-words.ts node --env-file=.env dist/index.js --batch
node --env-file=.env dist/index.js --status
node --env-file=.env dist/index.js --interactive

# Interactive development
node --env-file=.env dist/index.js --interactive

# Legacy AI agent testing
node --env-file=.env kiro-cli.js --status
```

## Integration

This tool integrates with:
- **ElevenLabs API**: Voice generation
- **AWS S3**: Audio file storage
- **Spelling Website**: React application consuming the audio files
- **Kiro CLI**: AI agent automation platform

Generated audio files are available at:
`https://spellmatereact.s3.eu-west-2.amazonaws.com/voices/{voice_name}/{word_id}.mp3`
