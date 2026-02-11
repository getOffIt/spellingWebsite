# UI/UX Patterns Research - Current Interface and Admin Controls

## Current System Architecture

### Test Mode Selection
The current system supports two test modes:
- **Practice Mode** (`'practice'`): Default mode with retry/practice options
- **Full Test Mode** (`'full_test'`): Assessment mode with pass/fail thresholds

### Word Selection Flow
1. **ChallengesPage** → Main dashboard with progress tracking
2. **WordSelection/CommonWordsSelection** → Category-based word selection
3. **SpellingTest** → Core test interface
4. **Results Pages** → SpellingResults, FullTestResults, or CongratulationsPage

### Current Admin Controls
Based on code analysis, admin controls are limited:
- No explicit admin role detection found
- Authentication handled via OIDC (react-oidc-context)
- Progress tracking via DynamoDB but no admin override capabilities
- Test parameters (passThreshold) passed through props but no UI for admin configuration

## Current Test Flow Patterns

### Word Selection Logic
- **Category-based selection**: Words grouped by categories (e.g., "adding -s", "KS1-1")
- **Automatic selection**: `selectNextWords()` utility selects 3 words per category
- **Progress-based**: Prioritizes words that need practice (not mastered)

### Test Progression
1. **Single Stage**: Direct spelling test of selected words
2. **Two-Stage** (for 'less_family'): Base words → Full words
3. **Completion Criteria**: All words correct → advance/complete

### Current Limitations for Mastery Mode
- **Fixed word count**: Always selects 3 words
- **Automatic progression**: No admin control over when to advance
- **Limited repetition**: Words only repeated if incorrect
- **No persistence**: No way to "lock" a student on specific words

## UI Components Analysis

### Key Components for Mastery Mode Integration

#### 1. App.tsx - State Management
```typescript
const [selectedList, setSelectedList] = useState<{ 
  words: string[]; 
  type: 'single' | 'less_family';
  testMode?: 'practice' | 'full_test';
  passThreshold?: number;
} | null>(null)
```
**Opportunity**: Add `masteryMode?: boolean` and `masteryConfig?` to selectedList state

#### 2. BaseWordSelection.tsx - Word Selection Interface
- **Current**: Category-based selection with automatic 3-word selection
- **Pattern**: Click category → auto-select words → navigate to test
- **Opportunity**: Add "Mastery Mode" toggle/option per category

#### 3. SpellingTest.tsx - Core Test Logic
- **Current**: Linear progression through words with results at end
- **Pattern**: Word → Input → Next → Results
- **Opportunity**: Add mastery mode logic with admin controls

#### 4. ChallengesPage.tsx - Main Dashboard
- **Current**: Progress tracking with percentage completion
- **Pattern**: Challenge cards with progress bars
- **Opportunity**: Add mastery mode status/controls

## Admin Control Patterns Needed

### Missing Admin Functionality
1. **Role Detection**: No current admin role identification
2. **Override Controls**: No way to manually advance students
3. **Mastery Configuration**: No UI for setting word count, repetition requirements
4. **Progress Override**: No admin ability to reset/modify student progress

### Recommended Admin UI Patterns

#### 1. Admin Mode Toggle
- **Location**: Header component or profile page
- **Pattern**: Simple toggle switch "Admin Mode: ON/OFF"
- **Effect**: Shows additional controls throughout interface

#### 2. Mastery Mode Configuration
- **Location**: Word selection pages
- **Pattern**: Expandable settings panel
- **Controls**: 
  - Word count selector (5-10 words)
  - Repetition requirement (10-25 correct attempts)
  - Auto-advance toggle (admin control vs automatic)

#### 3. Student Progress Override
- **Location**: During active mastery session
- **Pattern**: Admin panel overlay with controls
- **Controls**:
  - "Advance to Next Set" button
  - Current repetition count display
  - Reset progress option

## Integration Points for Mastery Mode

### 1. Word Selection Enhancement
```typescript
// Add to BaseWordSelection props
masteryModeEnabled?: boolean;
masteryConfig?: {
  wordCount: number;
  requiredCorrectAttempts: number;
  adminControlled: boolean;
}
```

### 2. Test Mode Extension
```typescript
// Extend selectedList type in App.tsx
type: 'single' | 'less_family' | 'mastery';
masteryConfig?: {
  wordCount: number;
  requiredCorrectAttempts: number;
  currentSet: number;
  totalSets: number;
  adminControlled: boolean;
}
```

### 3. SpellingTest Mastery Logic
- **New state**: Track correct attempts per word
- **Modified progression**: Don't advance until mastery criteria met
- **Admin controls**: Override buttons for manual advancement

## Visual Design Patterns

### Current Design Language
- **Color scheme**: Gold/yellow for KS1 challenge, orange/black for common words
- **Progress indicators**: Horizontal bars with percentage
- **Status indicators**: Colored dots (• green for mastered, etc.)
- **Card-based layout**: Challenge cards, category cards

### Mastery Mode Visual Indicators
- **Repetition counter**: "Word 'cat': 12/20 correct attempts"
- **Set progress**: "Set 1 of 5: Words 1-7"
- **Admin controls**: Distinct styling (perhaps red/admin theme)
- **Mastery status**: Enhanced visual feedback for deep learning

## Technical Implementation Notes

### State Management Considerations
- **Persistence**: Mastery progress needs to persist across sessions
- **Real-time updates**: Admin controls need immediate UI updates
- **Progress tracking**: Enhanced tracking for repetition counts

### Authentication Integration
- **Admin detection**: Extend OIDC context to include admin role
- **Route protection**: Admin-only routes/components
- **Conditional rendering**: Show/hide admin controls based on role

### API Integration
- **Progress API**: Enhanced endpoints for mastery tracking
- **Admin API**: New endpoints for progress override
- **Real-time sync**: Ensure admin changes reflect immediately

## Conclusion

The current system provides a solid foundation for adding mastery mode functionality. Key integration points include:

1. **Extend existing state management** to support mastery configuration
2. **Add admin role detection** and conditional UI rendering
3. **Enhance word selection** with mastery mode options
4. **Modify test progression logic** to support repetition requirements
5. **Add admin override controls** for manual advancement

The existing UI patterns (cards, progress bars, status indicators) can be extended to support mastery mode without major design changes.
