# Rough Idea: ElevenLabs Voices for Spelling Website

## GitHub Issue
**Title:** elevenLabs voices for words  
**URL:** https://github.com/getOffIt/spellingWebsite/issues/4  
**Status:** Open  
**Created:** 2025-05-24T20:21:17Z  

## Context from Conversation

### Current Implementation
- Spelling website uses browser's built-in `speechSynthesis` API for text-to-speech
- Located in `src/pages/SpellingTest.tsx` with a `speak(text: string)` function
- Provides instant speech but limited voice quality and consistency

### Proposed Approach (from discussion)
- Replace/enhance current speech with ElevenLabs AI voices for higher quality
- Pre-generate all word audio files and store in AWS S3 for zero-latency playback
- Implement quality review workflow where each generated voice can be approved or regenerated with alternative voices

### Key Requirements Identified
- **Word Dataset:** ~230 words total from `src/data/words.ts` (YEAR1_WORDS, COMMON_WORDS, YEAR2_WORDS)
- **Voice Options:** Multiple ElevenLabs voices (Rachel, Adam, Bella) for quality alternatives
- **Storage Strategy:** S3 bucket with structure `{voice_name}/{word_id}.mp3`
- **Quality Control:** Interactive review process to approve/reject generated audio
- **Fallback:** Maintain browser speech as backup for errors/offline scenarios

### Technical Considerations
- **API Costs:** ElevenLabs charges per character/request - pre-generation controls costs
- **Latency:** S3 download vs instant browser speech
- **Voice Models:** `eleven_turbo_v2_5` (balanced) or `eleven_flash_v2_5` (speed)
- **Security:** API key management and secure storage
- **Integration:** Replace existing `speak()` function with S3 audio playback

### Generated Artifacts
- Interactive voice generation script (`scripts/generate-voices.js`)
- Quality review workflow with multi-voice fallback
- Progress tracking and resumable generation process

## Goal
Enhance the spelling website's text-to-speech functionality with high-quality AI voices while maintaining performance and providing a quality assurance process for audio generation.
