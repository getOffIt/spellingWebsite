# AGENTS.md - AI Assistant Guide for Spelling Website

> **Purpose:** This document provides comprehensive context for AI coding assistants working on the Spelling Website codebase. It focuses on development patterns, file organization, coding conventions, and assistant-specific guidance that complements existing documentation.

## Table of Contents

- [Project Overview](#project-overview)
- [Directory Structure & File Organization](#directory-structure--file-organization)
- [Coding Style & Patterns](#coding-style--patterns)
- [Component Development Patterns](#component-development-patterns)
- [State Management Patterns](#state-management-patterns)
- [API Integration Patterns](#api-integration-patterns)
- [Testing Guidelines](#testing-guidelines)
- [Development Workflow](#development-workflow)
- [Common Tasks & How-To](#common-tasks--how-to)
- [Key Files Reference](#key-files-reference)
- [Package-Specific Guidance](#package-specific-guidance)

---

## Project Overview

**Spelling Website** is a React + TypeScript educational application for children to practice spelling. It features:
- Interactive spelling tests with text-to-speech
- Progress tracking with mastery system (3 consecutive correct = mastered)
- Gamified challenges with progress visualization
- OIDC authentication with AWS Cognito
- RESTful API integration for progress persistence

**Tech Stack:**
- Frontend: React 19, TypeScript, Vite, React Router 7
- Authentication: react-oidc-context, AWS Cognito
- Backend: AWS Lambda, DynamoDB, API Gateway
- Testing: Vitest, Testing Library

---

## Directory Structure & File Organization

### Root Level
```
spellingWebsite/
├── src/              # Source code
├── public/            # Static assets
├── dist/              # Build output (gitignored)
├── lambdas/           # AWS Lambda functions
├── .sop/              # Documentation (this summary)
└── *.config.ts        # Configuration files
```

### Source Directory (`src/`)
```
src/
├── components/        # Reusable React components
│   ├── BaseWordSelection.tsx
│   ├── Challenge.tsx
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   └── WordChip.tsx
├── pages/             # Page-level components (routes)
│   ├── ChallengesPage.tsx
│   ├── WordSelection.tsx
│   ├── CommonWordsSelection.tsx
│   ├── SpellingTest.tsx
│   └── *.css          # Component-scoped styles
├── contexts/          # React Context providers
│   ├── AuthContext.tsx (unused - using react-oidc-context)
│   └── ProgressProvider.tsx
├── hooks/             # Custom React hooks
│   ├── useWord.ts
│   └── useProgressApi.ts
├── config/            # Configuration objects
│   └── wordSelectionConfigs.ts
├── data/              # Static data
│   └── words.ts
├── utils/             # Utility functions
│   └── wordSelection.ts
├── test/              # Test setup
│   └── setup.ts
├── App.tsx            # Main app component
├── main.tsx           # Application entry point
└── *.css              # Global styles
```

### File Naming Conventions
- **Components:** PascalCase (e.g., `BaseWordSelection.tsx`)
- **Hooks:** camelCase starting with "use" (e.g., `useWord.ts`)
- **Utilities:** camelCase (e.g., `wordSelection.ts`)
- **Config:** camelCase (e.g., `wordSelectionConfigs.ts`)
- **Data:** camelCase (e.g., `words.ts`)
- **CSS:** Matches component name (e.g., `SpellingTest.css`)

### Import Organization Pattern
```typescript
// 1. React and external libraries
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal components
import BaseWordSelection from '../components/BaseWordSelection';

// 3. Internal hooks
import { useWord } from '../hooks/useWord';

// 4. Internal utilities/config/data
import { wordSelectionConfigs } from '../config/wordSelectionConfigs';
import { Word } from '../data/words';

// 5. Styles (last)
import './ComponentName.css';
```

---

## Coding Style & Patterns

### TypeScript Conventions

**Type Definitions:**
- Use `type` for unions and intersections
- Use `interface` for object shapes that may be extended
- Export types that are used across files

```typescript
// ✅ Good
export type WordStatus = 'mastered' | 'in-progress' | 'not-started';
export interface Word {
  id: string;
  text: string;
  year: 1 | 2;
  category: string;
}
```

**Function Signatures:**
- Explicit return types for exported functions
- Use arrow functions for callbacks
- Prefer function declarations for exported functions

```typescript
// ✅ Good
export function selectNextWords<T extends WordWithStatus>(
  words: T[], 
  maxCount: number = 3
): string[] {
  // implementation
}
```

### React Patterns

**Component Structure:**
```typescript
// 1. Imports
import React from 'react';
// ... other imports

// 2. Types/Interfaces
interface ComponentProps {
  // props
}

// 3. Component
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. Hooks (at top)
  const [state, setState] = useState();
  const hookValue = useCustomHook();
  
  // 5. Derived state / computations
  const computed = useMemo(() => {
    // expensive computation
  }, [dependencies]);
  
  // 6. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 7. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // 8. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 9. Export
export default Component;
```

**Hook Rules:**
- ✅ Always call hooks at the top level
- ✅ Call hooks in the same order every render
- ✅ Use consistent number of hook calls (important for `useWord` in loops)

```typescript
// ✅ Good - consistent hook calls
const allWordsStatusList = words.map(word => useWord(word.id));

// ❌ Bad - conditional hook calls
if (condition) {
  const status = useWord(wordId); // Don't do this
}
```

### State Management Patterns

**Local State:**
- Use `useState` for component-local state
- Use `useRef` for values that don't trigger re-renders
- Use `useMemo` for expensive computations

**Global State:**
- Use React Context for app-wide state
- `ProgressProvider` for progress data
- `AuthProvider` (from react-oidc-context) for authentication

**State Updates:**
- Always use functional updates for state that depends on previous state
- Batch related updates when possible

```typescript
// ✅ Good
setAnswers(prev => [...prev, newAnswer]);

// ❌ Bad
setAnswers([...answers, newAnswer]); // if answers is in closure
```

---

## Component Development Patterns

### Configuration-Driven Components

Many components accept configuration objects for flexibility:

```typescript
// BaseWordSelection accepts config
<BaseWordSelection
  words={config.words}
  title={config.title}
  themeClass={config.themeClass}
  wordFilter={config.wordFilter}
  challengeConfig={config.challengeConfig}
  onSelectWords={handleSelectWords}
/>
```

**Pattern:** Extract configuration to `src/config/` files for reusability.

### Status-Based Rendering

Components often render differently based on word status:

```typescript
const getStatusIcon = (status: WordStatus) => {
  switch (status) {
    case 'mastered': return '✔︎';
    case 'unmastered': return '✗';
    case 'in-progress': return '🔄';
    default: return '❔';
  }
};
```

**Pattern:** Use switch statements or lookup objects for status-based logic.

### Memoization for Performance

Use `useMemo` and `useRef` to optimize expensive operations:

```typescript
// ✅ Good - memoized category grouping
const categories = useMemo(() => {
  // expensive grouping logic
  return groupedCategories;
}, [filteredWords]);

// ✅ Good - ref for values that don't need re-renders
const prevStatusesRef = useRef<string>('');
```

**When to Memoize:**
- Expensive computations (filtering, grouping, sorting)
- Derived data from props/state
- Objects/arrays passed as props to child components

### Callback Prop Pattern

Parent components pass callbacks to children for handling actions:

```typescript
// Parent
const handleSelectWords = (words: string[], type: 'single' | 'less_family') => {
  setSelectedList({ words, type });
  navigate('/spelling-test');
};

// Child
<BaseWordSelection onSelectWords={handleSelectWords} />
```

**Pattern:** Maintain unidirectional data flow with callback props.

---

## State Management Patterns

### Context API Usage

**ProgressProvider Pattern:**
```typescript
// 1. Define context type
interface ProgressContext {
  progress: ProgressData;
  recordAttempt(wordId: string, correct: boolean, attempt: string): Promise<void>;
  getWordStats(wordId: string): WordStats;
}

// 2. Create context
const ProgressContext = createContext<ProgressContext | null>(null);

// 3. Provider component
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>({});
  // ... implementation
  return (
    <ProgressContext.Provider value={{ progress, recordAttempt, getWordStats }}>
      {children}
    </ProgressContext.Provider>
  );
}

// 4. Custom hook for consuming
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
```

### Custom Hooks Pattern

Encapsulate business logic in reusable hooks:

```typescript
// useWord hook combines word data with progress
export function useWord(wordId: string) {
  const { progress, recordAttempt, getWordStats } = useProgress();
  const word = useMemo(() => {
    return ALL_WORDS.find(w => w.id === wordId) || fallbackWord;
  }, [wordId]);
  const stats = getWordStats(wordId);
  return {
    ...word,
    ...stats,
    recordAttempt
  };
}
```

**Benefits:**
- Logic reuse across components
- Separation of concerns
- Easier testing

---

## API Integration Patterns

### API Call Pattern

```typescript
// 1. Define API functions in hooks/useProgressApi.ts
export async function getAllProgress(token: string): Promise<ProgressData> {
  const res = await fetch(API_BASE, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch progress: ${res.status}`);
  }
  return await res.json();
}

// 2. Use in context/provider
const refreshProgress = async () => {
  if (!token) return;
  try {
    const remote = await getAllProgress(token);
    // Transform and update state
  } catch (err) {
    console.error('Failed to load progress:', err);
    // Handle error gracefully
  }
};
```

### Error Handling Pattern

```typescript
// ✅ Good - graceful error handling
try {
  await apiCall();
} catch (err) {
  console.error('Operation failed:', err);
  // Don't block UI, show loading state or fallback
  setProgress({});
}
```

### Token Management

- Tokens stored in localStorage via `WebStorageStateStore`
- Access token extracted from `auth.user?.access_token`
- Token automatically refreshed by react-oidc-context

---

## Testing Guidelines

### Test Setup

**Location:** `src/test/setup.ts`
```typescript
import '@testing-library/jest-dom';
```

**Test File Naming:** `*.test.tsx` or `*.test.ts`

### Testing Patterns

**Component Testing:**
```typescript
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

**Hook Testing:**
- Test hooks using `@testing-library/react-hooks` or render hook in component
- Mock context providers when needed

**Utility Testing:**
```typescript
import { selectNextWords } from './wordSelection';

describe('selectNextWords', () => {
  it('selects words by priority', () => {
    const words = [
      { text: 'word1', status: 'mastered' },
      { text: 'word2', status: 'in-progress' },
    ];
    const result = selectNextWords(words, 1);
    expect(result).toEqual(['word2']); // in-progress has higher priority
  });
});
```

### Running Tests

```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
npm test -- --coverage # With coverage
```

---

## Development Workflow

### Starting Development

```bash
npm install           # Install dependencies
npm run dev           # Start dev server (usually http://localhost:5173)
```

### Making Changes

1. **Create/Modify Component:**
   - Follow component structure pattern
   - Add corresponding CSS file if needed
   - Update imports in parent components

2. **Add New Route:**
   - Add route in `src/App.tsx`
   - Wrap in `<ProtectedRoute>` if authentication required
   - Import page component

3. **Add New Word List:**
   - Follow `ADDING_NEW_WORD_LIST_GUIDE.md`
   - Add words to `src/data/words.ts`
   - Create config in `src/config/wordSelectionConfigs.ts`
   - Create page component
   - Add route and challenge card

### Code Quality

```bash
npm run lint          # Run ESLint
```

**Linting Rules:**
- React hooks rules enforced
- TypeScript strict mode
- React Fast Refresh compatibility

### Building for Production

```bash
npm run build         # Create production build in dist/
npm run preview       # Preview production build locally
```

---

## Common Tasks & How-To

### Adding a New Component

1. Create file in appropriate directory (`components/` or `pages/`)
2. Follow component structure pattern
3. Add TypeScript interface for props
4. Export component
5. Import and use in parent component
6. Add CSS file if needed

### Adding a New Page/Route

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`:
   ```typescript
   <Route
     path="/new-page"
     element={
       <ProtectedRoute>
         <NewPage />
       </ProtectedRoute>
     }
   />
   ```
3. Add navigation link if needed

### Adding a New Word List

**See:** `ADDING_NEW_WORD_LIST_GUIDE.md` for complete guide.

**Quick Steps:**
1. Add words to `src/data/words.ts`
2. Add config to `src/config/wordSelectionConfigs.ts`
3. Create page component using `BaseWordSelection`
4. Add route in `src/App.tsx`
5. Add challenge card in `src/pages/ChallengesPage.tsx`

### Modifying Progress Tracking

1. **Update Data Model:** Modify types in `src/contexts/ProgressProvider.tsx`
2. **Update API:** Modify `src/hooks/useProgressApi.ts` if API changes
3. **Update Lambda:** Modify `lambdas/progress.js` if backend changes
4. **Update Components:** Update components using `useProgress` or `useWord`

### Adding New Challenge Configuration

1. Add config to `src/config/wordSelectionConfigs.ts`
2. Configure `challengeConfig` with:
   - `title`, `description`
   - `motivationMessages` for each progress level
   - `thresholds` (optional, defaults: 80, 60, 40, 20)
   - `passThreshold` (optional, default: 85)

---

## Key Files Reference

### Core Application Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/main.tsx` | Application entry point | React root render |
| `src/App.tsx` | Main app component | Routes, state management |
| `src/App.css` | Global app styles | - |

### Context Providers

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/contexts/ProgressProvider.tsx` | Progress tracking context | `ProgressProvider`, `useProgress` |
| `src/contexts/AuthContext.tsx` | (Unused - using react-oidc-context) | - |

### Custom Hooks

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/hooks/useWord.ts` | Word data + progress stats | `useWord` |
| `src/hooks/useProgressApi.ts` | API communication | `getAllProgress`, `putWordProgress` |

### Configuration

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/config/wordSelectionConfigs.ts` | Word list configurations | `wordSelectionConfigs` |
| `src/data/words.ts` | Word data arrays | `YEAR1_WORDS`, `COMMON_WORDS`, `ALL_WORDS`, `Word` type |

### Utilities

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/utils/wordSelection.ts` | Word selection logic | `selectNextWords`, `sortWordsByPriority` |

### Backend

| File | Purpose |
|------|---------|
| `lambdas/progress.js` | AWS Lambda handler for progress API |

---

## Package-Specific Guidance

### react-oidc-context

**Usage:**
```typescript
import { useAuth } from 'react-oidc-context';

const auth = useAuth();
const token = auth.user?.access_token;
const isAuthenticated = auth.isAuthenticated;
```

**Configuration:** In `src/main.tsx`, `cognitoAuthConfig` object

**Token Access:** `auth.user?.access_token` for API calls

### react-router-dom

**Usage:**
```typescript
import { useNavigate, Navigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/path');

// In component
if (!authenticated) {
  return <Navigate to="/login" replace />;
}
```

**Route Protection:** Use `ProtectedRoute` component wrapper

### canvas-confetti

**Usage:**
```typescript
import confetti from 'canvas-confetti';

confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 }
});
```

**When to Use:** Challenge completion, achievements

---

## Development Patterns Summary

### ✅ Do

- Use TypeScript for type safety
- Follow component structure pattern
- Use custom hooks for reusable logic
- Memoize expensive computations
- Handle errors gracefully
- Use configuration objects for flexibility
- Follow file naming conventions
- Export types/interfaces used across files
- Use React Context for global state
- Call hooks consistently (same order, same count)

### ❌ Don't

- Don't call hooks conditionally
- Don't mutate state directly
- Don't forget to handle loading/error states
- Don't hardcode values that should be configurable
- Don't mix concerns (keep components focused)
- Don't forget to add TypeScript types
- Don't use `any` type (use `unknown` if needed)
- Don't forget to handle edge cases (empty arrays, null values)

---

## Quick Reference: Common Code Patterns

### Word Status Priority
```typescript
// Priority: unmastered > in-progress > not-started > mastered
const sorted = sortWordsByPriority(words);
const next = selectNextWords(words, 3);
```

### Progress Calculation
```typescript
const mastered = words.filter(w => w.status === 'mastered').length;
const total = words.length;
const progress = Math.round((mastered / total) * 100);
```

### API Call with Token
```typescript
const token = auth.user?.access_token;
if (!token) return;
const data = await getAllProgress(token);
```

### Status-Based Rendering
```typescript
const getStatusClass = (status: WordStatus) => {
  return `word-status-${status}`;
};
```

---

## Additional Resources

- **Detailed Documentation:** See `.sop/summary/` directory for comprehensive docs
- **Adding Word Lists:** See `ADDING_NEW_WORD_LIST_GUIDE.md`
- **Architecture:** See `.sop/summary/architecture.md`
- **Components:** See `.sop/summary/components.md`
- **API Reference:** See `.sop/summary/interfaces.md`

---

*This document is optimized for AI coding assistants. For user-facing documentation, see README.md. For detailed technical documentation, see the `.sop/summary/` directory.*

