# Voice Manifest Implementation - Rough Idea

## Context
Currently, the spelling website constructs voice file URLs dynamically in the frontend. We want to simplify this by creating a flat JSON manifest file that maps word IDs directly to their voice file URLs.

## The Idea
Create a simple hash map approach where:
- **Key**: word ID (e.g., "cat", "dog", "house")
- **Value**: full voice file URL (e.g., "https://spellingninjas.com/voices/rachel/cat.mp3")

## Components to Update
1. **Voice Tool**: Add manifest generation functionality
   - New command: `--generate-manifest`
   - Scan existing voices directory structure
   - Output flat JSON mapping
   - Save to `public/voice-manifest.json`

2. **Frontend**: Update to consume manifest
   - Fetch manifest on app startup
   - Cache in localStorage
   - Replace URL construction with manifest lookup
   - Provide simple `getVoiceUrl(wordId)` function

## Benefits
- Dead simple implementation
- Fast frontend access (no API calls per audio file)
- Leverages existing security (WAF, geographic restrictions, CloudFront)
- Cacheable manifest file
- Eliminates URL construction complexity

## Current Security Context
Voice files are already well-protected:
- S3 bucket is private with Origin Access Control
- Only accessible via CloudFront
- Protected by WAF rules and geographic restrictions (GB, SE, FR)
- Rate limiting in place (1000 requests per 5 minutes per IP)

## Goal
Keep the security simple while making the frontend code cleaner and more maintainable.
