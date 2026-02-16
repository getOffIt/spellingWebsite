# Debugging Amber Color Bug

## Issue
Words typed correctly (e.g., "all", "are", "ball") are not turning amber (in-progress status).

## Debug Logging Added

I've added console.log statements throughout the progress tracking flow:

### 1. ProgressProvider.recordAttempt
- Logs when attempts are recorded
- Shows API responses
- Tracks progress updates

### 2. ProgressProvider.getWordStats
- Shows calculated status for each word
- Displays streak and attempt count

### 3. BaseWordSelection
- Logs when status map changes
- Shows old vs new status strings

## How to Debug

1. **Open the app in your browser**: http://localhost:5173
2. **Open browser DevTools**: Press F12 or right-click → Inspect
3. **Go to the Console tab**
4. **Navigate to Common Words selection page**
5. **Start a spelling test with "all", "are", "ball"**
6. **Type each word correctly and click Next**
7. **Watch the console logs**

## What to Look For

### Expected Log Sequence (for each word):

```
[ProgressProvider] recordAttempt called: { wordId: 'all', correct: true, attempt: 'all' }
[ProgressProvider] API response: [...]
[ProgressProvider] Setting progress: X words
[ProgressProvider] getWordStats(all): { status: 'in-progress', streak: 1, attempts: 1 }
```

### After completing the test:

1. **Navigate back to word selection page**
2. **Check console for**:
```
[BaseWordSelection] Status changed from: not-started,not-started,not-started,...
[BaseWordSelection] Status changed to: in-progress,in-progress,in-progress,...
```

3. **Check if words are showing amber**

## Possible Issues

1. **API not saving**: If you don't see "API response" logs
2. **Progress not updating**: If you see API response but no "Setting progress"
3. **Status not calculated**: If you don't see getWordStats logs
4. **UI not updating**: If you see status changes but UI doesn't reflect them

## Quick Test

Run this in the browser console on the word selection page:
```javascript
// This will trigger getWordStats for the words
const words = ['all', 'are', 'ball'];
// The logs will show in console automatically as the page renders
```

## To Remove Debug Logs Later

Search for `console.log` in:
- `src/contexts/ProgressProvider.tsx`
- `src/components/BaseWordSelection.tsx`

And remove the debug statements.
