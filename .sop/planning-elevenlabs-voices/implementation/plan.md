# ElevenLabs Voices - Implementation Plan

## Checklist

- [ ] Step 1: Set up environment configuration
- [ ] Step 2: Create textToSpeech utility module
- [ ] Step 3: Implement IndexedDB caching
- [ ] Step 4: Integrate with SpellingTest component
- [ ] Step 5: Add loading states and error handling
- [ ] Step 6: Test and refine

---

## Step 1: Set up Environment Configuration

**Goal:** Configure environment variables for ElevenLabs API key

**Tasks:**
1. Create `.env.example` file with template
2. Verify `.env` is in `.gitignore`
3. Document environment variables in README
4. Set up TypeScript types for environment variables

**Files to Create/Modify:**
- `.env.example` (new)
- `README.md` (modify)
- `src/vite-env.d.ts` (modify if needed)

**Implementation:**

```bash
# .env.example
VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

**Verification:**
- [ ] `.env.example` exists
- [ ] `.env` is in `.gitignore`
- [ ] Can access `import.meta.env.VITE_ELEVENLABS_API_KEY` in code

**Estimated Time:** 15 minutes

---

## Step 2: Create textToSpeech Utility Module

**Goal:** Create the core TTS utility with ElevenLabs API integration

**Tasks:**
1. Create `src/utils/textToSpeech.ts`
2. Implement ElevenLabs API client function
3. Implement Web Speech API fallback function
4. Implement main `speak()` function with fallback logic
5. Add TypeScript types and interfaces

**Files to Create:**
- `src/utils/textToSpeech.ts` (new)

**Implementation Outline:**

```typescript
// Constants
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

// Types
interface TextToSpeechOptions {
  voiceId?: string;
  useCache?: boolean;
  onLoading?: (loading: boolean) => void;
}

// API client
async function fetchElevenLabsAudio(...): Promise<Blob>

// Fallback
function speakWithWebSpeech(text: string): void

// Main function
export async function speak(text: string, options?: TextToSpeechOptions): Promise<void>
```

**Key Features:**
- Fetch audio from ElevenLabs API
- Handle errors and retry logic
- Fallback to Web Speech API
- Basic error logging

**Verification:**
- [ ] Utility file created
- [ ] Can import `speak` function
- [ ] API client function works (test with real API key)
- [ ] Fallback works when API fails
- [ ] No TypeScript errors

**Estimated Time:** 1-2 hours

---

## Step 3: Implement IndexedDB Caching

**Goal:** Add persistent audio caching to reduce API calls

**Tasks:**
1. Add IndexedDB database setup function
2. Implement cache retrieval function
3. Implement cache storage function
4. Integrate caching into main `speak()` function
5. Add cache key generation (word + voiceId)

**Files to Modify:**
- `src/utils/textToSpeech.ts` (add caching functions)

**Implementation Outline:**

```typescript
// Database setup
async function openCacheDB(): Promise<IDBDatabase>

// Cache operations
export async function getCachedAudio(
  word: string,
  voiceId: string
): Promise<Blob | null>

export async function cacheAudio(
  word: string,
  voiceId: string,
  audioBlob: Blob
): Promise<void>

// Update main speak() function to:
// 1. Check cache first
// 2. Use cached audio if available
// 3. Store new audio in cache
```

**Key Features:**
- IndexedDB database creation
- Cache hit/miss logic
- Composite key (word + voiceId)
- Error handling for IndexedDB operations

**Verification:**
- [ ] Database creates successfully
- [ ] Can store audio in cache
- [ ] Can retrieve cached audio
- [ ] Cache key generation works correctly
- [ ] Cached audio plays correctly
- [ ] No IndexedDB errors in console

**Estimated Time:** 1-2 hours

---

## Step 4: Integrate with SpellingTest Component

**Goal:** Replace existing `speak()` function with new utility

**Tasks:**
1. Import new utility in `SpellingTest.tsx`
2. Remove inline `speak()` function
3. Update automatic playback useEffect
4. Update manual playback button handler
5. Test integration

**Files to Modify:**
- `src/pages/SpellingTest.tsx`

**Implementation:**

```typescript
// Remove old function
// function speak(text: string) { ... }

// Add import
import { speak as speakWord } from '../utils/textToSpeech';

// Update automatic playback
useEffect(() => {
  if (wordToUtter) {
    speakWord(wordToUtter);
    setWordToUtter(null);
  }
}, [wordToUtter]);

// Update manual playback (Step 5 will add loading state)
const handleSpeak = () => {
  speakWord(currentWord);
};
```

**Verification:**
- [ ] Old `speak()` function removed
- [ ] New utility imported
- [ ] Automatic playback still works
- [ ] Manual playback button still works
- [ ] No console errors
- [ ] Audio plays correctly

**Estimated Time:** 30 minutes

---

## Step 5: Add Loading States and Error Handling

**Goal:** Improve UX with loading indicators and robust error handling

**Tasks:**
1. Add `isLoadingAudio` state
2. Update `handleSpeak` to manage loading state
3. Update button JSX to show loading state
4. Add error handling (already in utility, but verify)
5. Test error scenarios

**Files to Modify:**
- `src/pages/SpellingTest.tsx`
- `src/pages/SpellingTest.css` (if needed for loading state)

**Implementation:**

```typescript
// Add state
const [isLoadingAudio, setIsLoadingAudio] = useState(false);

// Update handler
const handleSpeak = async () => {
  setIsLoadingAudio(true);
  try {
    await speakWord(currentWord, {
      onLoading: setIsLoadingAudio,
    });
  } catch (error) {
    // Error already handled in utility (fallback)
    console.error('TTS error:', error);
  } finally {
    setIsLoadingAudio(false);
  }
};

// Update button
<button 
  className="spelling-listen-btn" 
  onClick={handleSpeak}
  disabled={isLoadingAudio}
>
  {isLoadingAudio ? 'Loading...' : '🔊 Listen to the word'}
</button>
```

**Key Features:**
- Loading state on button
- Button disabled while loading
- Visual feedback ("Loading..." text)
- Error handling (transparent to user)

**Verification:**
- [ ] Loading state shows when fetching
- [ ] Button disabled during loading
- [ ] Loading state clears after audio plays
- [ ] Error scenarios handled gracefully
- [ ] No UI blocking or freezing

**Estimated Time:** 45 minutes

---

## Step 6: Test and Refine

**Goal:** Comprehensive testing and bug fixes

**Tasks:**
1. Test happy path (first play, cached play)
2. Test error scenarios (network failure, API errors)
3. Test on different browsers
4. Test on mobile devices
5. Verify caching works across sessions
6. Check console for errors
7. Performance testing
8. Fix any bugs found

**Test Scenarios:**

1. **Happy Path:**
   - [ ] First word play (API call)
   - [ ] Same word play again (cached)
   - [ ] Different word play (API call)
   - [ ] Audio quality is good
   - [ ] No delays on cached plays

2. **Error Scenarios:**
   - [ ] Network offline → Fallback works
   - [ ] Invalid API key → Fallback works
   - [ ] API rate limit → Fallback works
   - [ ] No console errors shown to user

3. **Browser Testing:**
   - [ ] Chrome/Edge
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

4. **Caching:**
   - [ ] Cache persists across page reloads
   - [ ] Cache works for same word
   - [ ] Cache doesn't interfere with different words

5. **Performance:**
   - [ ] First play: < 500ms delay
   - [ ] Cached play: Instant
   - [ ] No UI blocking
   - [ ] Memory usage reasonable

**Files to Check:**
- All modified files
- Browser console
- Network tab (API calls)
- Application tab (IndexedDB)

**Verification:**
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] User experience is smooth
- [ ] Documentation updated

**Estimated Time:** 1-2 hours

---

## Implementation Order Summary

1. **Step 1** - Environment setup (15 min)
2. **Step 2** - Core utility (1-2 hours)
3. **Step 3** - Caching (1-2 hours)
4. **Step 4** - Integration (30 min)
5. **Step 5** - Loading states (45 min)
6. **Step 6** - Testing (1-2 hours)

**Total Estimated Time:** 4.5-7 hours

---

## Dependencies

### External
- ElevenLabs API account and API key
- Internet connection (for first-time plays)

### Internal
- Existing SpellingTest component
- Browser IndexedDB support
- Browser Audio API support

---

## Rollback Plan

If issues arise:

1. **Quick Rollback:** Comment out new utility import, restore old `speak()` function
2. **Partial Rollback:** Keep utility but disable ElevenLabs, use Web Speech only
3. **Full Rollback:** Revert all changes via git

**Rollback Steps:**
```typescript
// Quick rollback in SpellingTest.tsx
// Comment out:
// import { speak as speakWord } from '../utils/textToSpeech';

// Restore:
function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
```

---

## Post-Implementation

### Monitoring
- Monitor ElevenLabs API usage in dashboard
- Check for any console errors in production
- Monitor cache hit rates

### Documentation Updates
- Update README with environment variable setup
- Document new utility in code comments
- Update AGENTS.md if needed

### Future Enhancements
- Voice selection UI
- Cache management UI
- Analytics dashboard
- Multiple voice support

