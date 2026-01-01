# Research: ElevenLabs API

## Overview

This document researches the ElevenLabs Text-to-Speech API to understand how to integrate it into the Spelling Website.

## API Documentation

**Official Docs:** https://elevenlabs.io/docs/api-reference/text-to-speech

## API Endpoint

```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
```

### Headers Required
```
xi-api-key: YOUR_API_KEY
Content-Type: application/json
```

### Request Body
```json
{
  "text": "Hello, this is a test",
  "model_id": "eleven_monolingual_v1",  // Optional
  "voice_settings": {                    // Optional
    "stability": 0.5,
    "similarity_boost": 0.5
  }
}
```

### Response
- **Content-Type:** `audio/mpeg` (MP3)
- **Body:** Binary audio data

## Voice Selection

### Recommended Voices for Children's Education

1. **Rachel** (British English)
   - Voice ID: `21m00Tcm4TlvDq8ikWAM`
   - Clear, friendly, neutral accent
   - Good for spelling words

2. **Bella** (British English)
   - Voice ID: `EXAVITQu4vr4xnSDxMaL`
   - Warm, engaging voice
   - Child-friendly tone

3. **Antoni** (British English)
   - Voice ID: `ErXwobaYiN019PkySvjV`
   - Clear, professional
   - Good pronunciation

### Voice IDs
- Can be found in ElevenLabs dashboard
- Or via API: `GET /v1/voices`

## API Limits

### Free Tier
- 10,000 characters/month
- Rate limits apply

### Paid Tiers
- Higher character limits
- Better rate limits
- Priority support

### Rate Limits
- Typically: 10 requests/second
- Burst: Up to 20 requests/second
- 429 status code when exceeded

## Implementation Example

### JavaScript/Fetch

```typescript
async function speakWithElevenLabs(text: string, voiceId: string, apiKey: string): Promise<Blob> {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return await response.blob();
}
```

### Playing Audio

```typescript
async function playAudio(blob: Blob) {
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  
  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };
    audio.onerror = reject;
    audio.play();
  });
}
```

## Error Handling

### Common Errors

1. **401 Unauthorized**
   - Invalid or missing API key
   - Solution: Check API key configuration

2. **429 Too Many Requests**
   - Rate limit exceeded
   - Solution: Implement rate limiting or fallback

3. **400 Bad Request**
   - Invalid voice ID or text
   - Solution: Validate input

4. **Network Errors**
   - Connection failures
   - Solution: Retry or fallback

### Error Response Format
```json
{
  "detail": {
    "status": "error",
    "message": "Error description"
  }
}
```

## Cost Considerations

### Character-Based Pricing
- Free tier: 10,000 characters/month
- Paid: ~$5/month for 30,000 characters
- Average word: ~5 characters
- 1,000 words ≈ 5,000 characters

### Cost Optimization
1. **Caching:** Cache all generated audio
2. **Reuse:** Same word = same audio (cached)
3. **Selective use:** Only use for spelling tests

## Best Practices

1. **Always cache responses** - Reduces API calls and costs
2. **Handle errors gracefully** - Fallback to Web Speech API
3. **Use appropriate voice** - Child-friendly, clear pronunciation
4. **Monitor usage** - Track API calls to avoid surprises
5. **Rate limiting** - Implement client-side rate limiting if needed

## Security Considerations

1. **API Key Storage**
   - Never commit API keys to git
   - Use environment variables
   - Frontend exposure: Keys will be visible in bundle (acceptable for TTS)

2. **CORS**
   - ElevenLabs API supports CORS
   - Can be called directly from browser

3. **Rate Limiting**
   - Implement client-side rate limiting
   - Monitor usage in dashboard

## Testing

### Mocking Strategy

```typescript
// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () => Promise.resolve(new Blob(['audio data'], { type: 'audio/mpeg' })),
  })
);
```

### Test Scenarios
1. Successful API call
2. API error (401, 429, 500)
3. Network failure
4. Caching behavior
5. Fallback to Web Speech API

## Integration Checklist

- [ ] Get ElevenLabs API key
- [ ] Choose voice ID
- [ ] Set up environment variable
- [ ] Implement API client function
- [ ] Add error handling
- [ ] Implement caching
- [ ] Add fallback mechanism
- [ ] Test error scenarios
- [ ] Monitor API usage
- [ ] Update documentation

