# Current Spelling Test Implementation Research

## Core Test Mechanics

### Progress Tracking System
The system uses a sophisticated progress tracking mechanism:

#### WordAttempt Structure
```typescript
type WordAttempt = {
  date: string;
  correct: boolean;
  attempt: string; // What the user actually typed
};
```

#### Word Status Calculation
- **not-started**: No attempts recorded
- **in-progress**: Has attempts but streak < 3
- **mastered**: Current streak ≥ 3 consecutive correct
- **unmastered**: Previously mastered but lost streak (special case)

#### Mastery Criteria
- **Current requirement**: 3 consecutive correct answers
- **Streak calculation**: Counts backwards from most recent attempt
- **Mastery loss**: If a mastered word gets incorrect, becomes "unmastered"

### Word Selection Algorithm

#### Priority System
```typescript
const WORD_PRIORITY: Record<WordStatus, number> = {
  'unmastered': 0,    // Highest priority - lost mastery
  'in-progress': 1,   // Second priority - building streak
  'not-started': 2,   // Third priority - new learning
  'mastered': 3       // Lowest priority - already achieved
};
```

#### Selection Logic
1. **Sort by priority**: Unmastered → In-progress → Not-started → Mastered
2. **Limit selection**: Default 3 words per session
3. **Category-based**: Selection happens within categories

### Test Flow Architecture

#### Two-Stage System (for 'less_family' words)
1. **Base Stage**: Practice base words (e.g., "care" from "careless")
2. **Full Stage**: Practice full words (e.g., "careless")
3. **Progression**: Must complete base stage before full stage

#### Single-Stage System (for regular words)
- Direct spelling test of selected words
- Results → Practice incorrect words → Complete

### Current Limitations for Mastery Mode

#### Fixed Parameters
- **Word count**: Always 3 words per session
- **Mastery threshold**: Fixed at 3 consecutive correct
- **Session-based**: No persistence of "current learning set"

#### No Admin Override
- **Automatic progression**: System decides when to advance
- **No manual control**: Can't force student to continue with mastered words
- **No extended repetition**: Once mastered (3 correct), word is deprioritized

#### Limited Repetition Logic
- **Single session**: Words only repeated if incorrect in same session
- **Cross-session**: Mastered words rarely selected again
- **No deep practice**: No mechanism for 15-20 repetitions of same words

## Integration Points for Mastery Mode

### 1. Enhanced Progress Tracking
Need to track:
```typescript
type MasteryProgress = {
  currentSet: string[]; // Words in current mastery set
  setStartDate: string;
  correctAttempts: Record<string, number>; // Count per word
  requiredAttempts: number; // Admin-configurable
  adminControlled: boolean;
};
```

### 2. Modified Word Selection
Instead of priority-based selection:
- **Fixed set selection**: Admin/system selects 6-7 words
- **Set persistence**: Same words until mastery criteria met
- **No automatic advancement**: Admin controls progression

### 3. Enhanced Test Logic
Current SpellingTest.tsx needs:
- **Mastery mode detection**: Different flow for mastery vs regular
- **Repetition tracking**: Count correct attempts per word in set
- **Admin controls**: UI for manual advancement
- **Extended sessions**: Continue until admin says stop

### 4. New State Management
App.tsx selectedList needs extension:
```typescript
type SelectedList = {
  words: string[];
  type: 'single' | 'less_family' | 'mastery';
  testMode?: 'practice' | 'full_test';
  passThreshold?: number;
  masteryConfig?: {
    requiredCorrectAttempts: number;
    adminControlled: boolean;
    currentAttempts: Record<string, number>;
  };
};
```

## Technical Implementation Strategy

### 1. Backward Compatibility
- **Preserve existing flows**: Regular practice/test modes unchanged
- **Additive approach**: Mastery mode as additional option
- **Shared components**: Reuse existing UI components where possible

### 2. Data Persistence
- **API extension**: New endpoints for mastery progress
- **Local state**: Enhanced ProgressProvider for mastery tracking
- **Session continuity**: Persist mastery sets across browser sessions

### 3. Admin Detection
Current system lacks admin role detection:
- **OIDC integration**: Extend auth context with admin role
- **Conditional rendering**: Show admin controls only to admins
- **Route protection**: Admin-only configuration pages

## Key Differences from Current System

### Current: Session-Based Learning
- Select 3 words → Test → Results → New selection
- Mastery = 3 correct → Move to next words
- Category-driven selection

### Proposed: Set-Based Mastery
- Select 6-7 words → Extended practice → Admin advancement
- Mastery = 15-20 correct attempts → Admin decides when to advance
- Fixed set until manual progression

### Current: Automatic Progression
- System decides when student is ready
- Priority algorithm selects next words
- No human oversight of learning pace

### Proposed: Admin-Controlled Progression
- Admin observes student performance
- Manual decision to advance to next set
- Human judgment over algorithmic selection

## Implementation Complexity Assessment

### Low Complexity
- **UI modifications**: Add mastery mode toggle, admin controls
- **State extensions**: Add mastery config to existing state
- **Progress display**: Show repetition counts

### Medium Complexity
- **Test flow modification**: New logic for mastery mode in SpellingTest
- **Admin role integration**: Extend authentication system
- **API extensions**: New endpoints for mastery progress

### High Complexity
- **Cross-session persistence**: Maintain mastery sets across sessions
- **Real-time admin controls**: Live updates during student sessions
- **Migration strategy**: Handle existing progress data

## Conclusion

The current system provides a solid foundation with its progress tracking and test flow architecture. The main changes needed are:

1. **Extend state management** to support mastery sets
2. **Add admin role detection** and controls
3. **Modify test progression logic** for extended repetition
4. **Enhance progress tracking** for mastery-specific metrics

The existing components (SpellingTest, BaseWordSelection, ProgressProvider) can be extended rather than replaced, maintaining backward compatibility while adding the new mastery functionality.
