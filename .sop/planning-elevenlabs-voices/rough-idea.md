# Rough Idea: ElevenLabs Voices for Words

## Initial Concept

Replace the browser's built-in Web Speech API with ElevenLabs text-to-speech API to provide higher quality, more natural-sounding voices for word pronunciation in the spelling tests.

## Context

This feature is for the Spelling Website application, which helps children practice spelling through interactive tests with text-to-speech functionality. Currently, the app uses `window.speechSynthesis` (Web Speech API) which provides basic, robotic-sounding voices that vary in quality across browsers and devices.

## Motivation

- **Better voice quality:** ElevenLabs provides more natural, human-like voices
- **Consistency:** Same voice quality across all browsers and devices
- **Child-friendly:** More engaging and pleasant voices for educational content
- **Professional sound:** Higher production quality for the learning experience

## Current Implementation

The app currently uses a simple `speak()` function in `SpellingTest.tsx`:

```typescript
function speak(text: string) {
  window.speechSynthesis.cancel();
  const utterance = new window.SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
```

This function is called:
1. Automatically when a new word is shown (via useEffect)
2. When the user clicks the "Listen to the word" button

## Open Questions

- Should we completely replace Web Speech API or provide a fallback?
- How should we handle API keys (environment variables)?
- Should we cache audio to reduce API calls?
- Which ElevenLabs voice should we use?
- How should we handle API errors/rate limits?
- Should this be configurable or always use ElevenLabs?

