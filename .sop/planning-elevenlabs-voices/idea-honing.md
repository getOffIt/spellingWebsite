# Requirements Clarification

This document captures the Q&A process to refine the ElevenLabs voices feature requirements.

---

## Q1: Complete Replacement vs. Fallback Strategy

Should we completely replace Web Speech API with ElevenLabs, or provide a fallback mechanism?

**Options:**
1. **Complete replacement** - Always use ElevenLabs, no fallback
2. **ElevenLabs with Web Speech fallback** - Try ElevenLabs first, fall back to Web Speech API if it fails
3. **Configurable** - Allow users/admins to choose which TTS provider to use

**Answer:**
- **ElevenLabs with Web Speech fallback** - This ensures the app always works even if ElevenLabs API is unavailable
- Fallback should be automatic and transparent to the user
- This provides reliability while still offering better quality when available

---

## Q2: API Key Management

How should we handle the ElevenLabs API key securely?

**Options:**
1. **Environment variable** - Store in `.env` file, not committed to git
2. **Build-time configuration** - Inject during build process
3. **Runtime configuration** - Load from secure backend endpoint
4. **User-provided** - Let users enter their own API key (not practical for this use case)

**Answer:**
- **Environment variable** - Use Vite's environment variable system (`VITE_ELEVENLABS_API_KEY`)
- Add `.env` to `.gitignore` (if not already)
- Document required environment variables in README
- Provide `.env.example` template

---

## Q3: Audio Caching Strategy

Should we cache audio responses from ElevenLabs to reduce API calls and improve performance?

**Options:**
1. **No caching** - Always fetch fresh audio (simple, but more API calls)
2. **In-memory cache** - Cache during session only (good balance)
3. **Persistent cache** - Cache in localStorage/IndexedDB (best for repeated words)
4. **Hybrid** - Cache frequently used words persistently, others in-memory

**Answer:**
- **Persistent cache in IndexedDB** - Words are repeated frequently, so caching makes sense
- Reduces API costs and improves performance
- Cache key: word text + voice ID
- Cache invalidation: Optional TTL (time-to-live) or manual clear

---

## Q4: Voice Selection

Which ElevenLabs voice should we use, and should it be configurable?

**Options:**
1. **Single fixed voice** - Choose one child-friendly voice
2. **Multiple voice options** - Let users choose (adds complexity)
3. **Voice per word list** - Different voices for different challenges (adds character)

**Answer:**
- **Single fixed voice initially** - Start simple with one high-quality, child-friendly voice
- Choose a clear, neutral accent (British English preferred for UK spelling context)
- Can be made configurable later if needed
- **Recommended voice:** "Rachel" or "Bella" (clear, friendly, British English)

---

## Q5: Error Handling

How should we handle API errors, rate limits, and network failures?

**Options:**
1. **Silent fallback** - Automatically use Web Speech API without user notification
2. **User notification** - Show error message and fallback
3. **Retry logic** - Retry failed requests before falling back
4. **Combination** - Retry once, then fallback silently

**Answer:**
- **Silent fallback with retry** - Retry once on network errors, then automatically fall back to Web Speech API
- Log errors to console in development mode
- Don't interrupt user experience with error messages
- Rate limits: Fall back immediately (don't retry)

---

## Q6: Loading States

Should we show any loading indicator while fetching audio from ElevenLabs?

**Options:**
1. **No indicator** - Audio loads in background (fast enough)
2. **Button state** - Disable "Listen" button while loading
3. **Loading spinner** - Show spinner on button
4. **Audio icon animation** - Animate the 🔊 icon while loading

**Answer:**
- **Button state change** - Disable "Listen" button and show "Loading..." text while fetching
- Provides feedback without being intrusive
- Re-enable once audio starts playing or on error

---

## Q7: Implementation Scope

Should this feature be implemented for all TTS usage, or just the spelling test?

**Current TTS usage:**
- `SpellingTest.tsx` - Main spelling test (automatic + manual)
- `PracticePage.tsx` - Currently no TTS, but could benefit

**Answer:**
- **Start with SpellingTest.tsx** - Main use case
- Can extend to PracticePage later if needed
- Create reusable utility/hook that can be used anywhere

---

## Q8: Cost Considerations

ElevenLabs API has usage limits and costs. How should we manage this?

**Options:**
1. **Unlimited usage** - Accept costs for better quality
2. **Rate limiting** - Limit API calls per user/session
3. **Hybrid approach** - Use ElevenLabs for first play, Web Speech for repeats
4. **Caching priority** - Aggressive caching to minimize API calls

**Answer:**
- **Aggressive caching** - Primary cost control mechanism
- Cache all words that are played
- Consider rate limiting if costs become an issue (can add later)
- Monitor API usage in ElevenLabs dashboard

---

## Q9: Audio Format and Quality

What audio format and quality settings should we use?

**Options:**
1. **MP3** - Smaller file size, good quality
2. **WAV** - Higher quality, larger files
3. **OGG** - Good balance, web-friendly
4. **Configurable quality** - Let API choose optimal format

**Answer:**
- **Let ElevenLabs API choose** - Use default format (usually MP3)
- Don't specify format unless needed
- Focus on voice clarity over file size (caching handles bandwidth)

---

## Q10: Testing Strategy

How should we test this feature?

**Options:**
1. **Manual testing only** - Test in browser
2. **Unit tests** - Mock API calls
3. **Integration tests** - Test with real API (limited)
4. **Combination** - Unit tests + manual testing

**Answer:**
- **Unit tests with mocks** - Test utility functions, error handling, caching
- **Manual testing** - Test real API integration, fallback behavior
- **Mock ElevenLabs API** - Use MSW (Mock Service Worker) or similar for tests
- Test fallback behavior by simulating API failures

