# S3 Pre-Generation vs. On-Demand API Calls - Decision Analysis

## Context

**Word Count Analysis:**
- YEAR1_WORDS: ~60 words
- COMMON_WORDS: ~60 words  
- YEAR2_WORDS: ~100 words
- **Total: 230 words** (confirmed via codebase analysis)

**Usage Pattern:**
- Words are fixed (don't change frequently)
- Words are repeated frequently (same words used in multiple tests)
- Children practice the same words multiple times
- User experience is critical (instant playback preferred)

---

## Option 1: On-Demand API Calls (Current PDD Design)

### How It Works
- Frontend calls ElevenLabs API when word needs to be spoken
- Cache in IndexedDB for subsequent plays
- Fallback to Web Speech API on errors

### Pros ✅

1. **Simple Initial Setup**
   - No upfront work required
   - Start using immediately
   - No batch processing needed

2. **Dynamic Word Lists**
   - Easy to add new words (just use them)
   - No regeneration needed
   - Works for any word, even user-generated

3. **Always Fresh**
   - If voice quality improves, automatically gets better
   - Can switch voices easily
   - No stale audio files

4. **Lower Storage Costs**
   - No S3 storage needed
   - Only caches what's actually used
   - IndexedDB is free (browser storage)

5. **Simpler Architecture**
   - No S3 setup required
   - No batch job needed
   - No CDN configuration
   - Fewer moving parts

### Cons ❌

1. **Network Latency**
   - First play: ~200-500ms delay
   - Requires loading states
   - User sees "Loading..." button

2. **API Costs**
   - Pay per request (even with caching)
   - Rate limits apply
   - Costs scale with usage

3. **Reliability Dependency**
   - Depends on ElevenLabs API availability
   - Network failures require fallback
   - Rate limits can cause issues

4. **Ongoing Costs**
   - Free tier: 10,000 characters/month (~2,000 words)
   - Paid: ~$5/month for 30,000 characters (~6,000 words)
   - Costs accumulate over time

### Cost Estimate (On-Demand)

**Scenario: 230 words, average 5 chars = 1,150 characters**

**One-time generation:**
- Free tier covers it (10,000 chars/month)
- **Cost: $0**

**Ongoing usage (per month):**
- Assume each word played 10 times on average
- 230 words × 10 plays = 2,300 plays
- But cached after first play, so only 230 API calls
- 230 × 5 chars = 1,150 characters
- **Cost: $0 (within free tier)**

**If usage grows (1,000 users/month, 5 words each):**
- 1,000 users × 5 words = 5,000 unique word plays
- 5,000 × 5 chars = 25,000 characters
- **Cost: ~$5/month (paid tier)**

---

## Option 2: S3 Pre-Generation (Alternative Design)

### How It Works
- Batch generate all 220 words upfront
- Store MP3 files in S3 bucket
- Frontend fetches from S3 (or CDN)
- Cache in IndexedDB for offline use

### Pros ✅

1. **Instant Playback**
   - No API latency
   - No loading states needed
   - Better user experience

2. **Lower Ongoing Costs**
   - S3 storage: ~$0.023/GB/month
   - 220 files × ~50KB each = ~11MB
   - **Storage cost: ~$0.00025/month (essentially free)**
   - Data transfer: First 100GB free, then $0.09/GB
   - **Transfer cost: Minimal (CDN caching)**

3. **No Rate Limits**
   - No API rate limit concerns
   - No dependency on ElevenLabs availability
   - More reliable

4. **Better Performance**
   - CDN delivery (fast worldwide)
   - No API call overhead
   - Predictable latency

5. **Cost Predictability**
   - One-time generation cost
   - Fixed storage costs
   - No variable API costs

### Cons ❌

1. **Upfront Work**
   - Need to generate all 220 words
   - Set up S3 bucket
   - Configure CDN (optional but recommended)
   - Batch processing script

2. **Regeneration Needed**
   - If words change, need to regenerate
   - If voice changes, need to regenerate
   - Manual process

3. **Storage Setup**
   - S3 bucket configuration
   - CORS setup for browser access
   - CDN configuration (CloudFront)
   - Access control

4. **Initial Cost**
   - Generate 220 words = 1,100 characters
   - **Cost: $0 (free tier covers it)**
   - But need to do it upfront

5. **More Complex Architecture**
   - S3 bucket
   - CDN (optional)
   - Batch generation script
   - More moving parts

### Cost Estimate (S3)

**One-time generation:**
- 230 words × 5 chars = 1,150 characters
- **Cost: $0 (free tier)**

**Storage:**
- 230 files × ~50KB = ~11.5MB
- S3 storage: $0.023/GB/month
- **Cost: ~$0.00025/month (negligible)**

**Data transfer:**
- First 100GB free (AWS free tier)
- With CDN caching, minimal transfer
- **Cost: ~$0/month (within free tier)**

**Total ongoing cost: ~$0/month**

---

## Comparison Matrix

| Factor | On-Demand API | S3 Pre-Generation |
|--------|---------------|-------------------|
| **Initial Setup** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐ Moderate |
| **First Play Latency** | ⭐⭐ 200-500ms | ⭐⭐⭐⭐⭐ Instant |
| **User Experience** | ⭐⭐⭐ Good (with loading) | ⭐⭐⭐⭐⭐ Excellent |
| **Ongoing Costs** | ⭐⭐⭐ Variable ($0-5/month) | ⭐⭐⭐⭐⭐ ~$0/month |
| **Reliability** | ⭐⭐⭐ Good (with fallback) | ⭐⭐⭐⭐⭐ Excellent |
| **Maintenance** | ⭐⭐⭐⭐ Low | ⭐⭐⭐ Moderate |
| **Scalability** | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| **Flexibility** | ⭐⭐⭐⭐⭐ High | ⭐⭐ Low |

---

## Recommendation: **S3 Pre-Generation** 🎯

### Why S3 is Better for This Use Case

1. **Fixed Word List**
   - You have a fixed set of ~220 words
   - Words don't change frequently
   - Perfect for pre-generation

2. **Better User Experience**
   - Instant playback (no loading states)
   - No network delays
   - Smoother experience for children

3. **Cost Effective**
   - One-time generation (free tier covers it)
   - Ongoing costs: ~$0/month
   - No variable API costs

4. **More Reliable**
   - No dependency on ElevenLabs API during use
   - No rate limit concerns
   - CDN delivery is fast and reliable

5. **Scalable**
   - Handles any number of users
   - No API rate limits
   - CDN scales automatically

### When On-Demand Makes Sense

On-demand would be better if:
- Words change frequently
- Dynamic word lists
- User-generated content
- Very small word list (< 50 words)
- Prototyping/MVP phase

---

## Implementation Plan for S3 Approach

### Step 1: Generate Audio Files (One-Time)

**Script:** `scripts/generate-audio.js`
```javascript
// Batch generate all words
// Store in local directory
// Upload to S3
```

**Process:**
1. Loop through ALL_WORDS (230 words)
2. Call ElevenLabs API for each word
3. Save MP3 files locally
4. Upload to S3 bucket

**Time:** ~30-45 minutes (230 API calls with rate limiting)

### Step 2: S3 Setup

**Configuration:**
- Bucket name: `spelling-website-audio` (or similar)
- Region: Same as your app (eu-west-2)
- CORS: Allow browser access
- Public read access (or signed URLs)

**File Structure:**
```
s3://spelling-website-audio/
  ├── words/
  │   ├── off.mp3
  │   ├── well.mp3
  │   └── ...
```

### Step 3: Frontend Integration

**Modified Utility:**
```typescript
// src/utils/textToSpeech.ts

const S3_BASE_URL = 'https://spelling-website-audio.s3.eu-west-2.amazonaws.com/words';

async function speak(word: string) {
  // 1. Check IndexedDB cache
  // 2. If not cached, fetch from S3
  // 3. Cache in IndexedDB
  // 4. Play audio
  // 5. Fallback to Web Speech if S3 fails
}
```

**Benefits:**
- S3 fetch is fast (CDN)
- IndexedDB cache for offline
- Fallback to Web Speech if needed

### Step 4: CDN (Optional but Recommended)

**CloudFront Setup:**
- Point to S3 bucket
- Global edge locations
- Even faster delivery
- Better caching

---

## Hybrid Approach (Best of Both Worlds)

**Consider:** Start with S3, fallback to API

```typescript
async function speak(word: string) {
  // 1. Check IndexedDB cache
  // 2. If not cached, try S3
  // 3. If S3 fails, try ElevenLabs API (for new words)
  // 4. Cache result
  // 5. Fallback to Web Speech if all fail
}
```

**Benefits:**
- Pre-generated words: Instant from S3
- New words: On-demand from API
- Best of both worlds

---

## Final Recommendation

**Go with S3 Pre-Generation** because:
1. ✅ Fixed word list (230 words - perfect fit)
2. ✅ Better UX (instant playback, no loading states)
3. ✅ Lower costs (~$0/month vs variable API costs)
4. ✅ More reliable (no API dependency during use)
5. ✅ Better scalability (CDN handles any load)

**One-time effort:** ~1-2 hours setup
**Ongoing benefit:** Better UX, lower costs, more reliable

**Storage estimate:** ~11.5MB total (negligible S3 cost)

---

## Next Steps

If you choose S3:

1. **Update PDD** to reflect S3 approach
2. **Create batch generation script**
3. **Set up S3 bucket**
4. **Generate and upload audio files**
5. **Update frontend utility** to fetch from S3
6. **Test and deploy**

Would you like me to:
- Update the PDD for S3 approach?
- Create the batch generation script?
- Design the S3 architecture?

