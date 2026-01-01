# Guide: Adding a New Word List

This guide walks you through adding a new list of words to learn, including creating the word list, configuration, component, route, and challenge card.

---

## Overview

When you add a new word list, you need to:
1. ✅ Add the word list to `src/data/words.ts`
2. ✅ Create a configuration in `src/config/wordSelectionConfigs.ts`
3. ✅ Create a new component in `src/pages/`
4. ✅ Add a route in `src/App.tsx`
5. ✅ Add a challenge card in `src/pages/ChallengesPage.tsx`

**Estimated Time:** 10-15 minutes

---

## Step 1: Add Word List to `src/data/words.ts`

### 1.1 Define Your Word Array

Add a new exported constant for your word list. Follow the existing pattern:

```typescript
export const YOUR_LIST_NAME_WORDS: Word[] = [
  // Category 1
  { id: 'unique-id-1', text: 'word1', year: 1, category: 'category-name' },
  { id: 'unique-id-2', text: 'word2', year: 1, category: 'category-name' },
  
  // Category 2
  { id: 'unique-id-3', text: 'word3', year: 1, category: 'another-category' },
  // ... more words
];
```

### 1.2 Word Object Structure

Each word must have:
- **`id`**: Unique identifier (e.g., `'word-text'` or `'category-word'`)
- **`text`**: The actual word to spell (e.g., `'hello'`)
- **`year`**: Either `1` or `2` (for Year 1 or Year 2)
- **`category`**: Grouping name (e.g., `'ff'`, `'common words 1'`, `'this-week'`)

### 1.3 Example

```typescript
// In src/data/words.ts
export const YEAR2_WORDS: Word[] = [
  // -less words
  { id: 'careless', text: 'careless', year: 2, category: '-less' },
  { id: 'harmless', text: 'harmless', year: 2, category: '-less' },
  // ... more words
];
```

### 1.4 Export the List

Make sure to export it at the top level of the file (it should already be exported if you use `export const`).

---

## Step 2: Create Configuration in `src/config/wordSelectionConfigs.ts`

### 2.1 Add Your Configuration

Open `src/config/wordSelectionConfigs.ts` and add a new entry to the `wordSelectionConfigs` object:

```typescript
export const wordSelectionConfigs: Record<string, WordSelectionConfig> = {
  // ... existing configs (year1, common)
  
  yourListKey: {
    words: YOUR_LIST_NAME_WORDS,  // Import from words.ts
    title: 'Your Challenge Title',
    themeClass: 'optional-theme-class',  // Optional: for custom styling
    wordFilter: (word: Word) => {
      // Optional: filter out certain words
      // Return true to include, false to exclude
      return true;  // Include all words by default
    },
    challengeConfig: {
      title: '🏆 Your Challenge Title! 🏆',
      description: 'Master all {total} words to earn your reward!',
      rewardText: '',  // Optional: additional reward text
      themeClass: 'optional-challenge-theme',  // Optional: for challenge styling
      motivationMessages: {
        complete: '🎉 CONGRATULATIONS! 🎉\nYou\'ve completed the challenge! 🎉',
        close: '🔥 So close! Just {remaining} more words! 🔥',
        good: '💪 Great progress! Keep going! 💪',
        steady: '🚀 Steady progress! You\'re doing amazing! 🚀',
        starting: '🌟 Off to a great start! Keep it up! 🌟',
        beginning: '🎯 Ready to start? Let\'s go! 🎯',
      },
      thresholds: {  // Optional: customize progress thresholds
        close: 80,   // >= 80% shows "close" message
        good: 60,    // >= 60% shows "good" message
        steady: 40,  // >= 40% shows "steady" message
        starting: 20, // >= 20% shows "starting" message
      },
    },
  },
};
```

### 2.2 Import Your Word List

At the top of the file, add your word list to the imports:

```typescript
import { Word, YEAR1_WORDS, COMMON_WORDS, YOUR_LIST_NAME_WORDS } from '../data/words';
```

### 2.3 Configuration Options Explained

| Field | Required | Description |
|-------|----------|-------------|
| `words` | ✅ Yes | The word array from `words.ts` |
| `title` | ✅ Yes | Title shown at top of word selection page |
| `themeClass` | ❌ No | CSS class for custom page styling |
| `wordFilter` | ❌ No | Function to filter words (e.g., exclude certain categories) |
| `challengeConfig` | ❌ No | Challenge component configuration (if omitted, shows overall progress bar instead) |

**Challenge Config Fields:**
- `title`: Challenge title
- `description`: Challenge description (supports `{total}`, `{remaining}`, `{mastered}` variables)
- `rewardText`: Optional additional reward text
- `themeClass`: Optional CSS class for challenge styling
- `motivationMessages`: Messages shown at different progress levels
- `thresholds`: Optional custom progress thresholds (defaults: 80, 60, 40, 20)

### 2.4 Example Configuration

```typescript
year2: {
  words: YEAR2_WORDS,
  title: 'Year 2 Word Selection',
  challengeConfig: {
    title: '📚 Year 2 Challenge! 📚',
    description: 'Master all {total} Year 2 words!',
    rewardText: '',
    motivationMessages: {
      complete: '🎉 Amazing! You\'ve mastered all Year 2 words! 🎉',
      close: '🔥 Almost there! Just {remaining} more words! 🔥',
      good: '💪 Great progress! Keep going! 💪',
      steady: '🚀 Steady progress! You\'re doing well! 🚀',
      starting: '🌟 Good start! Keep practicing! 🌟',
      beginning: '📚 Ready to start your Year 2 journey? Let\'s go! 📚',
    },
  },
},
```

---

## Step 3: Create Component in `src/pages/`

### 3.1 Create New Component File

Create a new file: `src/pages/YourListNameSelection.tsx`

### 3.2 Component Template

Use this template (replace `YourListName` and `yourListKey`):

```typescript
import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';
// Optional: import custom CSS if you have theme-specific styles
// import './YourListNameSelection.css';

interface YourListNameSelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const YourListNameSelection: React.FC<YourListNameSelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.yourListKey;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      themeClass={config.themeClass}
      wordFilter={config.wordFilter}
      challengeConfig={config.challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default YourListNameSelection;
```

### 3.3 Example: Year2Selection Component

```typescript
import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface Year2SelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const Year2Selection: React.FC<Year2SelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.year2;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      themeClass={config.themeClass}
      wordFilter={config.wordFilter}
      challengeConfig={config.challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default Year2Selection;
```

**Note:** The component is very simple - it just imports the config and passes it to `BaseWordSelection`. This is intentional and makes it easy to add new lists!

---

## Step 4: Add Route in `src/App.tsx`

### 4.1 Import Your Component

Add the import at the top of `src/App.tsx`:

```typescript
import YourListNameSelection from "./pages/YourListNameSelection";
```

### 4.2 Add the Route

Add a new route in the `<Routes>` section:

```typescript
<Route
  path="/your-list-selection"
  element={
    <ProtectedRoute>
      <YourListNameSelection onSelectWords={handleSelectWords} />
    </ProtectedRoute>
  }
/>
```

### 4.3 Example

```typescript
// In src/App.tsx
import Year2Selection from "./pages/Year2Selection";

// ... in Routes section:
<Route
  path="/year2-selection"
  element={
    <ProtectedRoute>
      <Year2Selection onSelectWords={handleSelectWords} />
    </ProtectedRoute>
  }
/>
```

**Route Path Convention:**
- Use kebab-case: `/year2-selection`, `/common-words-selection`
- Keep it descriptive and consistent

---

## Step 5: Add Challenge Card in `src/pages/ChallengesPage.tsx`

### 5.1 Import Your Word List

Add your word list to the imports:

```typescript
import { YEAR1_WORDS, COMMON_WORDS, YOUR_LIST_NAME_WORDS } from '../data/words';
```

### 5.2 Calculate Progress

Add progress calculation logic (similar to existing challenges):

```typescript
// Calculate Your List progress
const yourListStatusList = YOUR_LIST_NAME_WORDS.map(word => useWord(word.id));
const yourListMastered = yourListStatusList.filter(status => status.status === 'mastered').length;
const yourListTotal = YOUR_LIST_NAME_WORDS.length;
const yourListProgress = Math.round((yourListMastered / yourListTotal) * 100);
```

**Note:** If you have a `wordFilter` in your config, apply it here too:

```typescript
const filteredWords = YOUR_LIST_NAME_WORDS.filter(yourConfig.wordFilter || (() => true));
const yourListStatusList = filteredWords.map(word => useWord(word.id));
// ... rest of calculation
```

### 5.3 Add Challenge Object

Add a new challenge object to the `challenges` array:

```typescript
const challenges = [
  // ... existing challenges
  
  {
    id: 'your-challenge-id',
    title: "Your Challenge Title",
    description: "Description of your challenge",
    progress: yourListProgress,
    masteredWords: yourListMastered,
    totalWords: yourListTotal,
    status: yourListProgress === 100 ? 'completed' : 
            yourListProgress > 75 ? 'close' : 
            yourListProgress > 50 ? 'good' : 
            yourListProgress > 25 ? 'steady' : 
            yourListProgress > 0 ? 'starting' : 'beginning',
    route: '/your-list-selection',  // Must match route path from Step 4
    bgColor: 'linear-gradient(135deg, #color1 0%, #color2 50%, #color1 100%)',
    borderColor: '#border-color'
  },
];
```

### 5.4 Challenge Object Fields

| Field | Description |
|-------|-------------|
| `id` | Unique identifier (e.g., `'year2-challenge'`) |
| `title` | Challenge title shown on card |
| `description` | Challenge description shown on card |
| `progress` | Progress percentage (0-100) |
| `masteredWords` | Number of mastered words |
| `totalWords` | Total number of words |
| `status` | Status string: `'completed'`, `'close'`, `'good'`, `'steady'`, `'starting'`, or `'beginning'` |
| `route` | Route path (must match route from Step 4) |
| `bgColor` | Background gradient color |
| `borderColor` | Border color |

### 5.5 Example

```typescript
// Calculate Year 2 progress
const year2Words = YEAR2_WORDS;  // Or apply filter if needed
const year2StatusList = year2Words.map(word => useWord(word.id));
const year2Mastered = year2StatusList.filter(status => status.status === 'mastered').length;
const year2Total = year2Words.length;
const year2Progress = Math.round((year2Mastered / year2Total) * 100);

const challenges = [
  // ... existing challenges
  {
    id: 'year2-challenge',
    title: "📚 Year 2 Challenge",
    description: "Master all Year 2 spelling words!",
    progress: year2Progress,
    masteredWords: year2Mastered,
    totalWords: year2Total,
    status: year2Progress === 100 ? 'completed' : 
            year2Progress > 75 ? 'close' : 
            year2Progress > 50 ? 'good' : 
            year2Progress > 25 ? 'steady' : 
            year2Progress > 0 ? 'starting' : 'beginning',
    route: '/year2-selection',
    bgColor: 'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #4a90e2 100%)',
    borderColor: '#2e5c8a'
  },
];
```

---

---

## Step 6: Generate Voice Audio Files

After adding your word list to the main application, you need to generate audio files for the new words using the voice generation tool.

### 6.1 Regenerate real-words.ts (Voice Tool)

When you add new words to `src/data/words.ts`, you need to update the voice tool's word list:

```bash
cd voice-tool
```

**Option A: Manual Update (Recommended)**
1. Open `voice-tool/real-words.ts`
2. Add your new words to the `ALL_WORDS` array
3. Ensure no duplicates exist
4. Maintain the flat structure (single array, no nested arrays)

**Option B: Regenerate from Main App (Advanced)**
If you want to automatically sync from the main app's `words.ts`:
```bash
# Create a script to extract and deduplicate words from ../src/data/words.ts
# This is more complex and requires handling the different array structures
```

### 6.2 Generate Audio Files

Once your words are in `voice-tool/real-words.ts`:

#### Quick Test (5 words)
```bash
# Test with a small subset first
WORDS_FILE=./test-5-words.ts node kiro-cli.js --batch
node kiro-cli.js --status
```

#### Full Generation
```bash
# Generate audio for all words (including new ones)
node kiro-cli.js --batch
```

This will:
- Generate audio files for any new words using the default Rachel voice
- Skip words that already have audio
- Show progress as it generates

### 6.3 Review and Accept New Voices

Use the interactive review process for new words:

#### Check Status
```bash
node kiro-cli.js --status
```

#### Review Individual Words
```bash
# Play a specific word
node kiro-cli.js --play your-new-word

# Accept the voice
node kiro-cli.js --accept your-new-word

# Or reject to try alternative voices
node kiro-cli.js --reject your-new-word
```

#### Interactive Review Mode
```bash
# Use the interactive mode for easier review
node dist/index.js --interactive
```

The interactive mode provides:
- Automatic playback of words needing review
- Simple keyboard shortcuts (a=accept, r=reject, s=skip)
- Progress tracking
- Voice selection options

### 6.4 Voice Selection Options

The voice tool supports 18 different voices:

**Primary Voices:**
- **rachel** - Clear, neutral female voice (default)
- **dorothy** - Pleasant British female voice
- **emily** - Calm American female voice

**Additional Voices:**
- **sarah** - Confident, warm female voice
- **laura** - Enthusiastic female voice
- **alice** - Clear British female voice (educational)
- **matilda** - Professional American female voice
- **jessica** - Playful American female voice
- **lily** - Velvety British female voice
- **george** - Warm British male voice
- **charlie** - Energetic Australian male voice
- **eric** - Smooth American male voice
- **chris** - Natural American male voice
- **daniel** - Professional British male voice
- **will** - Laid-back American male voice
- **thomas** - Calm American male voice
- **antoni** - Well-rounded American male voice
- **adam** - Deep American male voice

#### Voice Selection Process:
1. **Play**: `node kiro-cli.js --play word` - Listen to current voice
2. **Accept**: `node kiro-cli.js --accept word` - Keep current voice
3. **Reject**: `node kiro-cli.js --reject word` - Try next voice in sequence
4. **Choose**: `node kiro-cli.js --choose word voice-name` - Select specific voice
5. **List**: `node kiro-cli.js --list-voices word` - See all available voices for a word

### 6.5 Upload to S3

Once all voices are reviewed and accepted:

```bash
# Upload all approved audio files to S3
node kiro-cli.js --upload
```

**Prerequisites:**
- AWS credentials configured
- S3 bucket access (spellmatereact)
- Proper IAM permissions

The upload will:
- Upload all completed audio files to S3
- Set proper caching headers
- Organize files by voice name
- Make files publicly accessible for the web app

### 6.6 Voice Generation Workflow Summary

```bash
# 1. Add words to voice-tool/real-words.ts
# 2. Generate audio files
node kiro-cli.js --batch

# 3. Check status
node kiro-cli.js --status

# 4. Review new words (interactive mode recommended)
node dist/index.js --interactive

# 5. Upload to S3 when complete
node kiro-cli.js --upload
```

### 6.7 Voice Tool File Structure

```
voice-tool/
├── real-words.ts              # Flat list of all words (220 unique words)
├── test-5-words.ts           # Small test set for development
├── kiro-cli.js               # Command-line interface
├── dist/index.js             # Interactive review interface
├── audio-cache/              # Generated audio files
│   ├── rachel/              # Primary voice files
│   ├── dorothy/             # Alternative voice files
│   └── ...                  # Other voice directories
└── progress/                 # Progress tracking
    └── voice-generation-progress.json
```

### 6.8 Troubleshooting Voice Generation

**Issue: Words not generating**
- ✅ Check words are in `real-words.ts`
- ✅ Verify ElevenLabs API key in `.env`
- ✅ Check internet connection
- ✅ Verify API quota/limits

**Issue: Progress showing wrong count**
- ✅ The system now uses dynamic counting
- ✅ Run `node kiro-cli.js --status` for accurate count
- ✅ Check for duplicate words in `real-words.ts`

**Issue: Upload failing**
- ✅ Check AWS credentials are configured
- ✅ Verify S3 bucket permissions
- ✅ Ensure bucket exists and is accessible

**Issue: Audio quality poor**
- ✅ Try different voices using `--reject` or `--choose`
- ✅ Use interactive mode for easier voice comparison
- ✅ Consider educational-friendly voices (alice, matilda, george)

---

## Step 7: Test Your New Word List

## Step 7: Test Your New Word List

### 7.1 Checklist

- [ ] Word list appears in `ChallengesPage` as a challenge card
- [ ] Clicking the challenge card navigates to your word selection page
- [ ] Word selection page displays all words correctly
- [ ] Categories are grouped properly
- [ ] Challenge component (if configured) displays correctly
- [ ] Clicking a category navigates to spelling test
- [ ] **Audio files play correctly for new words**
- [ ] **Voice quality is acceptable for all new words**
- [ ] Progress tracking works correctly
- [ ] No console errors

### 7.2 Audio Testing

**Test audio playback:**
1. Navigate to your new word list
2. Select a category with new words
3. Start spelling test
4. Verify audio plays when clicking the speaker icon
5. Check audio quality and clarity
6. Test on different devices/browsers

**If audio issues:**
- Check browser console for 404 errors
- Verify S3 upload completed successfully
- Test audio files directly: `https://spellmatereact.s3.eu-west-2.amazonaws.com/voices/rachel/word-id.mp3`

### 7.3 Common Issues

**Issue: Words not showing**
- ✅ Check that word list is exported from `words.ts`
- ✅ Check that word list is imported in `wordSelectionConfigs.ts`
- ✅ Check that config key matches what you use in component

**Issue: Route not working**
- ✅ Check route path matches in both `App.tsx` and `ChallengesPage.tsx`
- ✅ Check component is imported correctly in `App.tsx`

**Issue: Challenge card not showing**
- ✅ Check word list is imported in `ChallengesPage.tsx`
- ✅ Check progress calculation is correct
- ✅ Check challenge object is added to `challenges` array

**Issue: Audio not playing**
- ✅ Check audio files were generated in voice-tool
- ✅ Verify S3 upload completed successfully
- ✅ Check browser console for network errors
- ✅ Test audio URLs directly in browser

**Issue: Styling issues**
- ✅ Check `themeClass` is set correctly in config
- ✅ Check CSS file is imported if using custom styles

---

## Complete Example: Adding Year 2 Word List

Here's a complete walkthrough for adding a Year 2 word list:

### 1. Word List (already exists in `words.ts`)
```typescript
export const YEAR2_WORDS: Word[] = [ /* ... */ ];
```

### 2. Configuration (`wordSelectionConfigs.ts`)
```typescript
import { YEAR2_WORDS } from '../data/words';

export const wordSelectionConfigs = {
  // ... existing configs
  year2: {
    words: YEAR2_WORDS,
    title: 'Year 2 Word Selection',
    challengeConfig: {
      title: '📚 Year 2 Challenge! 📚',
      description: 'Master all {total} Year 2 words!',
      rewardText: '',
      motivationMessages: {
        complete: '🎉 Amazing! You\'ve mastered all Year 2 words! 🎉',
        close: '🔥 Almost there! Just {remaining} more words! 🔥',
        good: '💪 Great progress! Keep going! 💪',
        steady: '🚀 Steady progress! You\'re doing well! 🚀',
        starting: '🌟 Good start! Keep practicing! 🌟',
        beginning: '📚 Ready to start your Year 2 journey? Let\'s go! 📚',
      },
    },
  },
};
```

### 3. Component (`Year2Selection.tsx`)
```typescript
import React from 'react';
import BaseWordSelection from '../components/BaseWordSelection';
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import './WordSelection.css';

interface Year2SelectionProps {
  onSelectWords: (words: string[], type: 'single' | 'less_family') => void;
}

const Year2Selection: React.FC<Year2SelectionProps> = ({ onSelectWords }) => {
  const config = wordSelectionConfigs.year2;

  return (
    <BaseWordSelection
      words={config.words}
      title={config.title}
      wordFilter={config.wordFilter}
      challengeConfig={config.challengeConfig}
      onSelectWords={onSelectWords}
    />
  );
};

export default Year2Selection;
```

### 4. Route (`App.tsx`)
```typescript
import Year2Selection from "./pages/Year2Selection";

// In Routes:
<Route
  path="/year2-selection"
  element={
    <ProtectedRoute>
      <Year2Selection onSelectWords={handleSelectWords} />
    </ProtectedRoute>
  }
/>
```

### 5. Challenge Card (`ChallengesPage.tsx`)
```typescript
import { YEAR2_WORDS } from '../data/words';

// Calculate progress:
const year2StatusList = YEAR2_WORDS.map(word => useWord(word.id));
const year2Mastered = year2StatusList.filter(s => s.status === 'mastered').length;
const year2Progress = Math.round((year2Mastered / YEAR2_WORDS.length) * 100);

// Add to challenges array:
{
  id: 'year2-challenge',
  title: "📚 Year 2 Challenge",
  description: "Master all Year 2 spelling words!",
  progress: year2Progress,
  masteredWords: year2Mastered,
  totalWords: YEAR2_WORDS.length,
  status: year2Progress === 100 ? 'completed' : 
          year2Progress > 75 ? 'close' : 
          year2Progress > 50 ? 'good' : 
          year2Progress > 25 ? 'steady' : 
          year2Progress > 0 ? 'starting' : 'beginning',
  route: '/year2-selection',
  bgColor: 'linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #4a90e2 100%)',
  borderColor: '#2e5c8a'
}
```

---

## Quick Reference: Complete Workflow

| Step | Location | Action | Time |
|------|----------|--------|------|
| 1 | `src/data/words.ts` | Add word array export | 2-3 min |
| 2 | `src/config/wordSelectionConfigs.ts` | Add config object | 3-4 min |
| 3 | `src/pages/YourListNameSelection.tsx` | Create component file | 2 min |
| 4 | `src/App.tsx` | Add route | 1 min |
| 5 | `src/pages/ChallengesPage.tsx` | Add challenge card | 3-4 min |
| 6 | `voice-tool/real-words.ts` | Add words to voice tool | 2-3 min |
| 7 | `voice-tool/` | Generate & review audio | 10-30 min |
| 8 | `voice-tool/` | Upload to S3 | 2-5 min |
| 9 | Test | Verify everything works | 5 min |

**Total Time: ~30-60 minutes** (depending on number of words and voice review time)

---

## Tips & Best Practices

1. **Naming Convention:**
   - Word list: `YOUR_LIST_NAME_WORDS` (UPPER_SNAKE_CASE)
   - Config key: `yourListKey` (camelCase)
   - Component: `YourListNameSelection` (PascalCase)
   - Route: `/your-list-selection` (kebab-case)

2. **Word IDs:**
   - Must be unique across all word lists
   - Use format: `'word-text'` or `'category-word'`
   - Avoid special characters

3. **Categories:**
   - Group related words together
   - Use descriptive names (e.g., `'ff'`, `'common words 1'`, `'this-week'`)

4. **Challenge Messages:**
   - Use emojis for visual appeal
   - Use template variables: `{total}`, `{remaining}`, `{mastered}`
   - Keep messages encouraging and age-appropriate

5. **Testing:**
   - Test with a small word list first
   - Verify progress tracking works
   - Check navigation flows correctly

---

## Need Help?

If you run into issues:
1. Check the console for errors
2. Verify all imports are correct
3. Ensure route paths match exactly
4. Check that word IDs are unique
5. Review existing examples (`WordSelection.tsx`, `CommonWordsSelection.tsx`)

---

*Last Updated: 2026-01-01*
*This guide covers the complete process for adding a new word list to the spelling website, including voice generation.*

