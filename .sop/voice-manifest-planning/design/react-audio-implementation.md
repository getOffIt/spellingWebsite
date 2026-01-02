# React Frontend Audio Implementation Design

## Current Implementation Analysis

The React frontend currently uses **Web Speech API** for text-to-speech:

```typescript
function speak(text: string) {
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
```

**Usage in SpellingTest.tsx:**
- Called when "🔊 Listen to the word" button is clicked
- Automatically speaks word when advancing to next word
- Uses browser's built-in TTS voices (quality varies by platform)

## Proposed Enhancement: Voice Manifest + MP3 Playback

### 1. Voice Service Hook

Create a new hook to handle voice manifest and MP3 playback:

```typescript
// src/hooks/useVoiceService.ts
export function useVoiceService() {
  const [manifest, setManifest] = useState<Record<string, string> | null>(null);
  
  const loadManifest = async () => {
    // Fetch voice manifest from S3 or API
  };
  
  const playWord = async (wordId: string) => {
    // Try MP3 first, fallback to TTS
  };
  
  return { playWord, isLoading: !manifest };
}
```

### 2. Audio Playback Strategy

**Hybrid Approach:**
1. **Primary**: Use MP3 from voice manifest if available
2. **Fallback**: Use existing Web Speech API if MP3 not found
3. **Preloading**: Cache frequently used MP3s for instant playback

### 3. Implementation Options

#### Option A: Replace existing `speak()` function
- Minimal changes to existing code
- Drop-in replacement with same interface
- Automatic fallback handling

#### Option B: New voice service with explicit control
- More control over loading states
- Better error handling
- Can show different UI states (loading, error, etc.)

#### Option C: Progressive enhancement
- Keep existing TTS as default
- Add MP3 playback as opt-in feature
- Allow users to choose voice quality preference

## Recommended Approach

**Option A** with progressive enhancement:

```typescript
// Enhanced speak function
async function speak(text: string, options?: { preferMP3?: boolean }) {
  const voiceService = useVoiceService();
  
  if (options?.preferMP3 && voiceService.hasMP3(text)) {
    await voiceService.playWord(text);
  } else {
    // Fallback to existing TTS
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
}
```

This maintains backward compatibility while adding high-quality voice support.
