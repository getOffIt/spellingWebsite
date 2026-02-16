# Recent Changes Summary

## Update Overview
Documentation updated to include changes through February 2026. Latest: Word ID simplification (id === text, no list-a-/list-b- prefixes; progress shared across lists).

## Key Changes Identified

### 1. Voice Integration (Jan 2) - Major Feature
The largest change set, introducing full voice playback in the frontend and infrastructure submodule support.

- **VoiceService** (`src/services/VoiceService.ts`): New singleton service for audio playback
  - Lazy-loads voice manifest from `/voices/voice-manifest.json`
  - MP3-first playback with browser TTS fallback
  - Manages single `HTMLAudioElement` instance
  - Promise-based async API (`speak()`, `playMP3()`, `stop()`)
- **Voice Manifest** (`public/voices/voice-manifest.json`): Maps ~220 word IDs to CDN audio URLs
  - Format: `{ "wordId": "https://spellingninjas.com/voices/{voice}/{wordId}.mp3" }`
  - Primarily uses "dorothy" voice
- **Infrastructure Submodule**: Added as private git submodule (`.gitmodules`)
- **SpellingTest Integration**: Now uses VoiceService for speech instead of raw browser TTS

### 2. Voice Tool Utilities (Jan 2-9) - New Scripts
New operational scripts for voice pipeline management:

- **generate-manifest.js**: Scans S3 bucket, builds manifest JSON from existing audio files
- **deploy-manifest.js**: Deploys voice manifest to S3 with proper cache headers (AWS SDK v3)
- **check-missing-files.js**: Validates consistency between voice manifest and progress tracking
- **upload-approved-only.js**: Uploads only `completed`-status voice files to S3 via AWS CLI

### 3. CI/CD Workflow Improvements (Jan 3)
- **create-pr.yml**: GitHub Actions workflow for automatic PR creation on branch push
  - Prevents duplicate PRs
  - Adds labels (`auto-generated`, `needs-review`)
  - Assigns reviewer (`getOffIt`)

### 4. Word Database Expansion (Jan 8 - Feb 14)
Major expansion of the word database:

- **Spelling List A** (~90 words): tion/sion patterns, double consonants, homophones
- **Spelling List B** (~76 words): oor patterns, unstressed vowels
- **Word Removals**: Removed "I", "Mr", "Mrs" from word database
- **Total Words**: `ALL_WORDS` now contains ~470 words (up from ~220)
- **Word Types**: `Word` type with `{ id, text, year: 1|2, category }`
- **Word IDs**: All words use `id === text` (no list-a-/list-b- prefixes); progress keyed by word text and shared across lists

### 5. DRY Mastery Thresholds (Feb 14) - Architecture Improvement
Centralized mastery threshold configuration:

- **masteryThresholds.ts** (`src/config/`): Single source of truth for thresholds
  - Single `MASTERY_THRESHOLD = 10` (consecutive correct answers) for all words
  - `getMasteryThreshold(wordId)` function
- **ProgressProvider** updated to use `getMasteryThreshold()` instead of hardcoded values
- **useWord hook** updated to use dynamic thresholds for mastery detection

### 8. Word ID Simplification (Feb 2026)
Unified word identity so progress and UI stay in sync across all lists:

- **words.ts**: Removed `list-a-` and `list-b-` prefixes; for all words `id` equals display text (e.g. `id: 'door', text: 'door'`). Special cases kept where display differs (e.g. `id: "they're"`, `id: 'February'`).
- **Selection flow**: `selectNextWords()` (wordSelection.ts) and Challenge return `w.text`; SpellingTest receives and uses word strings throughout (no ID-to-text resolution).
- **Progress**: Stored and looked up by word text; progress for the same word is shared across lists (e.g. "people" in Common Words shows amber on List B too).
- **Fix**: Resolved Spelling List B (and List A) words staying gray after spelling by aligning identity to word text everywhere.

### 6. New Pages & Configuration (Feb 14)
- **SpellingListASelection** (`src/pages/`): Thin wrapper around `BaseWordSelection` for List A
- **SpellingListBSelection** (`src/pages/`): Same pattern for List B
- **wordSelectionConfigs.ts**: Centralized configuration for all 4 word selection pages
  - Each config includes: words, title, theme, filters, challenge config, mastery threshold
  - Challenge configs define title, description, reward text, motivation messages

### 7. ChallengesPage Enhancement (Feb 14)
- Now displays 4 challenge types: KS1-1, Common Words, List A, List B
- Per-challenge progress bars with mastered/total counts
- Status tiers: `completed`, `close`, `good`, `steady`, `starting`, `beginning`
- Navigation to corresponding word selection pages
- Motivation messages based on progress thresholds

## Recent Commits Analysis
1. **2b11e7b** (Feb 14): DRY: single source of truth for mastery thresholds
2. **8884f91** (Feb 14): Rename spelling sections to 'The Big Test 27th Feb'
3. **a195b49** (Feb 14): Add Spelling Test Lists A & B (half-term homework, £40 each)
4. **5c52218** (Feb 6): Remove I, Mr, and Mrs from word database
5. **db1aa6a** (Jan 9): Fixed missing files issues after last upload
6. **05bc3da** (Jan 9): Updating words - upload-approved-only script
7. **e9e1e53** (Jan 8): Updating words - manifest and progress updates
8. **6ac1232** (Jan 3): Revert "test workflow pr"
9. **8dfa959** (Jan 3): Test workflow PR
10. **cf5ab27** (Jan 3): Add automatic reviewer assignment to createPR workflow
11. **196f455** (Jan 3): Fix createPR workflow head parameter format
12. **739f931** (Jan 2): Update create-manifest script to output to public directory
13. **8a72147** (Jan 2): Resolve submodule conflict and update infrastructure
14. **635b150** (Jan 2): Update infrastructure submodule with voice serving options
15. **9590769** (Jan 2): Voice integration (major PR #57)
16. **93ddafb** (Jan 2): Integrate VoiceService for improved speech functionality
17. **dcdf4c9** (Jan 2): Add infrastructure as private git submodule

## Files Modified (36 files, +1633/-81 lines)

### New Files
- `src/services/VoiceService.ts` - Frontend voice playback service
- `src/config/masteryThresholds.ts` - Centralized mastery thresholds
- `src/pages/SpellingListASelection.tsx` - Spelling List A page
- `src/pages/SpellingListBSelection.tsx` - Spelling List B page
- `public/voices/voice-manifest.json` - Voice manifest data
- `voice-tool/check-missing-files.js` - Manifest validation script
- `voice-tool/upload-approved-only.js` - Selective S3 upload script
- `voice-tool/deploy-manifest.js` - Manifest S3 deployment
- `voice-tool/generate-manifest.js` - Manifest generation from S3
- `PROGRESS_API.md` - Progress API documentation
- `.sop/voice-manifest-planning/` - Voice manifest planning docs

### Significantly Modified Files
- `src/data/words.ts` (+177 lines) - Added Spelling Lists A & B
- `src/config/wordSelectionConfigs.ts` - Added List A/B configs
- `src/pages/ChallengesPage.tsx` - Enhanced dashboard with 4 challenges
- `src/App.tsx` - Added routes for List A & B
- `src/contexts/ProgressProvider.tsx` - Dynamic mastery thresholds
- `src/hooks/useWord.ts` - Dynamic threshold support
- `.github/workflows/create-pr.yml` - Auto reviewer assignment

## Impact Assessment
The changes represent two major development phases:
1. **Voice Integration (Jan)**: Complete audio pipeline from generation to frontend playback
2. **Curriculum Expansion (Feb)**: Doubled word database, added configurable challenges, improved architecture

Key architectural improvements:
- **Configuration-driven UI**: Word selection pages driven by centralized configs
- **DRY Principle**: Mastery thresholds extracted to single source of truth
- **Component Composition**: Thin wrapper pages delegating to BaseWordSelection
- **Service Layer**: VoiceService isolates audio concerns from UI components
