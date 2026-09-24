# Word List Management and Authentication Research

## Word List Structure

### Data Model
```typescript
type Word = {
  id: string;      // unique identifier (e.g. "ff-off")
  text: string;    // the actual word to spell
  year: 1 | 2;     // curriculum year level
  category: string; // phonics grouping ("ff", "ll", "common words 1")
}
```

### Current Word Collections
- **YEAR1_WORDS**: Phonics-based categories (ff, ll, ss, zz, ck, etc.)
- **COMMON_WORDS**: High-frequency words grouped by sets
- **YEAR2_WORDS**: Advanced phonics patterns
- **ALL_WORDS**: Combined collection of all word lists

### Category Organization
Words are organized by phonics patterns and learning objectives:
- **Phonics categories**: "ff", "ll", "ss", "ck", "sh", "ch", "th", etc.
- **Common word sets**: "common words 1", "common words 2", etc.
- **Advanced patterns**: "adding -s", "adding -ed", "adding -ing"

### Word Selection for Mastery Mode
Current system selects 3 words per category using priority algorithm. For mastery mode:
- **Fixed set size**: 6-7 words instead of 3
- **Cross-category selection**: Could select from multiple categories
- **Admin-curated sets**: Manual selection vs algorithmic

## Authentication System

### Current Implementation
- **Provider**: AWS Cognito via OIDC (react-oidc-context)
- **Flow**: Authorization Code Flow with PKCE
- **Token management**: Automatic refresh handled by library
- **User identification**: `cognito:username`, email, or sub as fallback

### User Profile Structure
```typescript
// Available user profile fields
profile = {
  'cognito:username': string,
  email: string,
  sub: string, // unique user ID
  // Other Cognito standard claims
}
```

### Current Limitations for Admin Functionality
- **No role detection**: No admin/student role differentiation
- **No group membership**: No way to identify admin users
- **Single user type**: All authenticated users have same permissions

## Admin Role Integration Strategy

### Option 1: Cognito Groups
Add users to admin group in Cognito:
```typescript
// Enhanced profile with groups
profile = {
  'cognito:username': string,
  'cognito:groups': string[], // ['admin', 'student']
  email: string,
  sub: string
}
```

### Option 2: Custom Claims
Add admin flag as custom claim:
```typescript
profile = {
  'cognito:username': string,
  'custom:role': 'admin' | 'student',
  email: string,
  sub: string
}
```

### Option 3: Hardcoded Admin List
Simple approach for small user base:
```typescript
const ADMIN_USERS = ['parent@email.com', 'teacher@email.com'];
const isAdmin = ADMIN_USERS.includes(profile.email);
```

## Progress Tracking Integration

### Current Progress Structure
```typescript
type WordAttempt = {
  date: string;
  correct: boolean;
  attempt: string;
};

type ProgressData = Record<string, WordAttempt[]>;
```

### Mastery Mode Progress Extension
Need to track additional data:
```typescript
type MasterySession = {
  sessionId: string;
  words: string[];
  startDate: string;
  requiredCorrectAttempts: number;
  currentAttempts: Record<string, number>;
  adminControlled: boolean;
  completed: boolean;
  completedDate?: string;
};

type EnhancedProgressData = {
  wordAttempts: Record<string, WordAttempt[]>;
  masterySessions: MasterySession[];
  currentMasterySession?: string; // sessionId
};
```

## API Integration Points

### Current Progress API
- **getAllProgress(token)**: Fetch all user progress
- **putWordProgress(token, wordId, attempts)**: Record new attempts

### Required Mastery API Extensions
- **createMasterySession(token, config)**: Start new mastery session
- **updateMasterySession(token, sessionId, updates)**: Update session progress
- **completeMasterySession(token, sessionId)**: Mark session complete
- **getMasterySessions(token)**: Get user's mastery sessions
- **adminAdvanceSession(token, userId, sessionId)**: Admin override (admin only)

## User Experience Considerations

### Student Experience
- **Seamless integration**: Mastery mode feels natural within existing flow
- **Progress visibility**: Clear indication of mastery progress
- **Motivation**: Visual feedback for repetition achievements

### Admin Experience
- **Easy activation**: Simple toggle to enable mastery mode
- **Clear controls**: Obvious buttons for advancement decisions
- **Progress monitoring**: Real-time view of student performance

### Multi-User Scenarios
- **Family accounts**: Parent as admin, children as students
- **Classroom use**: Teacher as admin, students practice independently
- **Self-directed**: Student can use regular mode, parent can enable mastery mode

## Implementation Strategy for Word Selection

### Current Category-Based Selection
```typescript
// BaseWordSelection.tsx - current approach
const selectNextWordsForCategory = (category: string) => {
  const wordList = categoryToWordStatuses[category] || [];
  return selectNextWords(wordList, 3); // Always 3 words
};
```

### Mastery Mode Word Selection
```typescript
// Enhanced selection for mastery mode
const selectMasteryWords = (
  category: string, 
  wordCount: number = 7,
  adminSelected?: string[]
) => {
  if (adminSelected) return adminSelected;
  
  const wordList = categoryToWordStatuses[category] || [];
  return selectNextWords(wordList, wordCount);
};
```

### Cross-Category Selection
For advanced mastery sessions:
```typescript
const selectMixedMasteryWords = (
  categories: string[],
  wordCount: number = 7
) => {
  const allWords = categories.flatMap(cat => 
    categoryToWordStatuses[cat] || []
  );
  return selectNextWords(allWords, wordCount);
};
```

## Configuration Management

### Mastery Mode Settings
```typescript
type MasteryConfig = {
  enabled: boolean;
  defaultWordCount: number; // 6-7
  defaultRequiredAttempts: number; // 15-20
  adminControlled: boolean;
  allowCrossCategory: boolean;
  categories: string[]; // which categories support mastery mode
};
```

### User Preferences
Store in user profile or separate preferences:
```typescript
type UserPreferences = {
  masteryMode: MasteryConfig;
  notifications: boolean;
  autoPlay: boolean;
};
```

## Security Considerations

### Admin Action Authorization
- **Token validation**: Ensure admin tokens are valid
- **Role verification**: Double-check admin status on sensitive operations
- **Audit logging**: Track admin actions for accountability

### Student Data Protection
- **Progress isolation**: Students can only see their own progress
- **Admin oversight**: Admins can view/modify student progress appropriately
- **Data retention**: Clear policies on progress data storage

## Migration Strategy

### Backward Compatibility
- **Existing progress**: Preserve all current word attempt data
- **Gradual rollout**: Mastery mode as opt-in feature initially
- **Fallback support**: Regular mode always available

### Data Migration
- **Progress structure**: Extend existing progress without breaking changes
- **API versioning**: Support both old and new progress formats
- **User migration**: Smooth transition for existing users

## Conclusion

The current word list and authentication systems provide a solid foundation for mastery mode implementation. Key integration points:

1. **Extend word selection** to support configurable word counts and admin curation
2. **Add admin role detection** through Cognito groups or custom claims
3. **Enhance progress tracking** to support mastery session persistence
4. **Extend API** with mastery-specific endpoints
5. **Maintain backward compatibility** with existing progress data

The modular structure of the current system allows for additive changes without disrupting existing functionality.
