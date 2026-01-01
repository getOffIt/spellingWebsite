# Research: Current TTS Implementation

## Overview

This document analyzes the current text-to-speech implementation in the Spelling Website to understand what needs to be replaced or enhanced.

## Current Implementation

### Location
- **File:** `src/pages/SpellingTest.tsx`
- **Function:** `speak(text: string)` (lines 16-20)

### Code Analysis

```typescript
function speak(text: string) {
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
```

### Usage Points

1. **Automatic playback on word change:**
   - Lines 78-83: `useEffect` hook triggers when `wordToUtter` state changes
   - Automatically speaks the word when a new word is presented

2. **Manual playback via button:**
   - Line 247: "Listen to the word" button calls `speak(currentWord)`

### Characteristics

**Pros:**
- ✅ Simple implementation (browser-native API)
- ✅ No external dependencies
- ✅ No API costs
- ✅ Works offline
- ✅ Instant playback (no network delay)

**Cons:**
- ❌ Voice quality varies by browser/OS
- ❌ Robotic, unnatural sound
- ❌ Limited voice options
- ❌ Inconsistent pronunciation
- ❌ Not child-friendly

### Browser Compatibility

Web Speech API support:
- ✅ Chrome/Edge: Good support
- ✅ Safari: Good support (macOS/iOS)
- ✅ Firefox: Good support
- ⚠️ Mobile browsers: Varies

### Current User Experience

1. User sees new word → Word is automatically spoken
2. User can click "Listen" button → Word is spoken again
3. No loading states or error handling
4. Voice quality depends on device/browser

## Integration Points

### State Management
- `wordToUtter` state (line 65) triggers automatic playback
- No loading states currently
- No error handling

### Component Structure
- Function is defined at component level (not reusable)
- No abstraction layer
- Direct dependency on browser API

## What Needs to Change

### Required Changes

1. **Replace `speak()` function:**
   - New implementation using ElevenLabs API
   - Async function (API call required)
   - Error handling and fallback

2. **Add loading states:**
   - Disable "Listen" button while loading
   - Show loading indicator

3. **Add caching:**
   - Store audio in IndexedDB
   - Check cache before API call

4. **Create reusable utility:**
   - Move TTS logic to separate file
   - Make it usable across components

### Architecture Changes

**Current:**
```
SpellingTest.tsx
  └── speak() function (inline)
```

**Proposed:**
```
src/utils/
  └── textToSpeech.ts
      ├── speakWithElevenLabs()
      ├── speakWithFallback()
      └── cache management

SpellingTest.tsx
  └── Uses textToSpeech utility
```

## Dependencies

### Current
- None (browser API only)

### Proposed
- ElevenLabs API client (fetch-based, no npm package needed)
- IndexedDB for caching (browser API)
- Environment variable for API key

## Performance Considerations

### Current
- Instant playback (no network delay)
- No caching needed (browser handles)

### Proposed
- Network latency on first play (~200-500ms)
- Cached plays are instant
- IndexedDB operations are fast

## Error Scenarios

### Current
- Browser API failures are rare
- No explicit error handling

### Proposed
- Network failures → Fallback to Web Speech API
- API key issues → Fallback to Web Speech API
- Rate limits → Fallback to Web Speech API
- Invalid responses → Fallback to Web Speech API

## Testing Implications

### Current
- Hard to test (browser API mocking)
- No test coverage

### Proposed
- Can mock fetch API easily
- Can test error scenarios
- Can test caching logic
- Can test fallback behavior

## Migration Path

1. Create new utility module
2. Implement ElevenLabs integration
3. Add fallback to Web Speech API
4. Replace `speak()` calls with new utility
5. Add loading states
6. Add caching
7. Test thoroughly
8. Deploy

## Key Insights

1. **Simple replacement:** The `speak()` function is self-contained and easy to replace
2. **No state changes needed:** Can keep same state management pattern
3. **Backward compatible:** Fallback ensures existing behavior if API fails
4. **Reusable opportunity:** Extract to utility for use in other components
5. **Performance trade-off:** Network delay vs. better quality (mitigated by caching)

