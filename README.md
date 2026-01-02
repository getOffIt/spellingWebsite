# Spelling Website

A React-based spelling practice application with voice generation capabilities.

## Quick Start

1. Clone with submodules: `git clone --recurse-submodules <repo-url>`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Documentation

- **AGENTS.md** - AI assistant guide for development
- **PROGRESS_API.md** - Progress tracking system documentation
- **infrastructure/** - Private infrastructure documentation (git submodule)
- **voice-tool/** - Voice generation tool with ElevenLabs integration

## Features

- Interactive spelling tests and practice
- Progress tracking with DynamoDB
- Voice generation with ElevenLabs API
- AWS Cognito authentication
- Responsive design for all devices

## Infrastructure

Infrastructure documentation and configuration is maintained in a separate private repository and included as a git submodule in the `infrastructure/` directory.

To access infrastructure docs:
```bash
# Initialize submodules if not already done
git submodule update --init --recursive

# Access infrastructure documentation
cd infrastructure/
```
