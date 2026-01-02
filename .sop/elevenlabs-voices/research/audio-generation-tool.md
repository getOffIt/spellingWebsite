# ElevenLabs Audio Generation Tool Research

## ElevenLabs API Details

### Authentication
- **Header:** `xi-api-key: YOUR_API_KEY`
- **API Key Source:** ElevenLabs dashboard → Profile → API Key

### Text-to-Speech Endpoint
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

### Recommended Voice IDs
- **Rachel (Female):** `21m00Tcm4TlvDq8ikWAM` - Clear, neutral, child-friendly
- **Adam (Male):** `pNInz6obpgDQGcFmaJgB` - Deep, clear male voice  
- **Bella (Female):** `EXAVITQu4vr4xnSDxMaL` - Soft, gentle female voice

### Recommended Model
- **eleven_turbo_v2_5** - Balanced quality/speed (~300ms latency)
- **Alternative:** eleven_flash_v2_5 (75ms latency, slightly lower quality)

### Voice Settings for Children's Content
```json
{
  "stability": 0.6,        // Consistent pronunciation
  "similarity_boost": 0.8, // Close to original voice
  "style": 0.2,           // Minimal style exaggeration
  "use_speaker_boost": true // Enhanced clarity
}
```

### Output Format
- **Recommended:** `mp3_44100_128` (good quality, reasonable file size)
- **Alternative:** `mp3_22050_64` (smaller files, lower quality)

## Current Word Dataset Analysis

### Word Count by Category
- **Total Words:** ~230 words from `src/data/words.ts`
- **YEAR1_WORDS:** Phonics-based (ff, ll, ss, zz, ck, etc.)
- **COMMON_WORDS:** High-frequency words
- **YEAR2_WORDS:** More advanced patterns

### Cost Estimation
- **ElevenLabs Pricing:** ~$0.30 per 1K characters (Starter plan)
- **Average Word Length:** ~5 characters
- **Total Characters:** 230 words × 5 chars = ~1,150 characters
- **Estimated Cost:** ~$0.35 for full generation (very affordable)

## Quality Assurance Workflow Requirements

### Interactive Review Process
1. **Generate** audio with primary voice (Rachel)
2. **Play** audio for human review
3. **Prompt** for approval: Accept (y) / Reject & try next voice (n) / Retry (r)
4. **Fallback** to alternative voices (Adam, Bella) if rejected
5. **Save** approved audio with voice metadata
6. **Track** progress for resumable sessions

### Audio Playback Requirements
- **macOS:** `afplay` command (built-in)
- **Cross-platform alternatives:** `mpv`, `vlc`, or browser-based playback
- **Temporary file handling:** Save to `/tmp/` for playback, cleanup after

### Progress Tracking
- **Save state:** JSON file with completed/failed words
- **Resume capability:** Start from specific word index
- **Metadata tracking:** Which voice was used for each word
- **Error handling:** Retry failed generations

## Tool Architecture

### Core Components

1. **Word Extractor**
   - Parse `src/data/words.ts` to extract word list
   - Handle TypeScript syntax parsing
   - Extract `id` and `text` fields

2. **ElevenLabs Client**
   - API authentication and requests
   - Error handling and retries
   - Rate limiting compliance

3. **Audio Player**
   - Cross-platform audio playback
   - Temporary file management
   - User interaction handling

4. **Quality Reviewer**
   - Interactive approval workflow
   - Multi-voice fallback logic
   - Progress state management

5. **File Manager**
   - Local audio file storage
   - S3 upload preparation
   - Batch operations

### Technology Stack
- **Runtime:** Node.js with ES modules
- **HTTP Client:** Built-in `fetch()` API
- **File System:** Built-in `fs` module
- **User Input:** `readline` module
- **Audio Playback:** System commands (`afplay`, `mpv`)
- **AWS Integration:** AWS CLI for S3 uploads

## Generated Script Analysis

### Current Implementation Strengths
- ✅ Interactive review workflow
- ✅ Multi-voice fallback system
- ✅ Progress tracking and resume capability
- ✅ S3 upload integration
- ✅ Error handling

### Potential Improvements
- **Word Extraction:** More robust TypeScript parsing
- **Audio Playback:** Cross-platform compatibility
- **Batch Operations:** Generate multiple words before review
- **Preview Mode:** Generate samples without S3 upload
- **Voice Comparison:** Side-by-side voice comparison

## Workflow Steps

### Phase 1: Setup and Preparation
1. Configure ElevenLabs API key
2. Set up S3 bucket and permissions
3. Install and test audio playback tools
4. Validate word extraction from source files

### Phase 2: Audio Generation
1. Extract all words from `src/data/words.ts`
2. Generate audio with primary voice (Rachel)
3. Interactive quality review for each word
4. Fallback to alternative voices as needed
5. Save approved audio files locally

### Phase 3: Upload and Integration
1. Upload approved audio files to S3
2. Update deployment scripts to exclude voices directory
3. Implement frontend audio service
4. Test end-to-end integration

## Risk Mitigation

### API Failures
- **Retry Logic:** Exponential backoff for failed requests
- **Rate Limiting:** Respect API rate limits
- **Error Logging:** Detailed error tracking

### Quality Issues
- **Multiple Voice Options:** 3+ voice alternatives
- **Regeneration:** Ability to retry same voice
- **Manual Override:** Skip problematic words

### Data Loss
- **Progress Saving:** Continuous state persistence
- **Backup Strategy:** Local file backup before S3 upload
- **Resume Capability:** Restart from any point

## Next Steps

1. **Validate Tool Requirements** through requirements clarification
2. **Test ElevenLabs API** with sample words
3. **Implement Generation Tool** following the interactive workflow
4. **Conduct Quality Review** of generated audio
5. **Integrate with S3** and frontend systems
