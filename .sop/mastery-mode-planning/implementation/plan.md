# Mastery Mode Implementation Plan

## Implementation Checklist

- [ ] Step 1: Create mastery progress data structures and utilities
- [ ] Step 2: Extend ProgressProvider with mastery tracking
- [ ] Step 3: Add mastery counter logic to word attempt recording
- [ ] Step 4: Implement category mastery detection
- [ ] Step 5: Add progress display to word selection interface
- [ ] Step 6: Implement category locking visual indicators
- [ ] Step 7: Modify word selection to use active category only
- [ ] Step 8: Add automatic category progression logic
- [ ] Step 9: Update SpellingTest to use all words in category
- [ ] Step 10: Integrate mastery mode with existing test flow
- [ ] Step 11: Add mastery progress persistence to API
- [ ] Step 12: Test and polish the complete mastery system

---

## Step 1: Create mastery progress data structures and utilities

Create the foundational data structures and utility functions for mastery tracking.

**Implementation:**
- Define `MasteryProgress` TypeScript interface
- Create utility functions for mastery detection (`isWordMastered`, `isCategoryMastered`)
- Add category progression logic (`getNextCategory`)
- Define mastery configuration constants

**Tests:**
- Unit tests for mastery detection functions
- Test category progression sequence
- Validate data structure integrity

**Demo:** Console logging shows correct mastery calculations for sample data, category progression works correctly.

## Step 2: Extend ProgressProvider with mastery tracking

Enhance the existing ProgressProvider to include mastery progress state management.

**Implementation:**
- Add `masteryProgress` state to ProgressProvider
- Create `updateMasteryCounter` function
- Add `unlockNextCategory` function
- Initialize with default mastery progress (starting with "common words 3")

**Tests:**
- Test mastery progress state updates
- Verify counter increments work correctly
- Test category unlocking logic

**Demo:** ProgressProvider context includes mastery functions, state updates correctly when functions are called.

## Step 3: Add mastery counter logic to word attempt recording

Integrate mastery counter updates with the existing word attempt recording system.

**Implementation:**
- Modify `recordAttempt` function to update mastery counters on correct attempts
- Ensure mastery counters only increment for correct attempts
- Maintain existing progress tracking functionality

**Tests:**
- Test that correct attempts increment mastery counters
- Verify incorrect attempts don't affect mastery counters
- Ensure existing progress tracking still works

**Demo:** Taking a spelling test updates both existing progress and mastery counters correctly.

## Step 4: Implement category mastery detection

Add logic to detect when a category is fully mastered (ALL words at 15/15) and trigger progression.

**Implementation:**
- Create category completion checking in `recordAttempt`
- Ensure ALL words in category must reach 15 correct attempts before unlocking next category
- Trigger `unlockNextCategory` only when every word is fully mastered
- Add logging/feedback for category completion events

**Tests:**
- Test category completion detection requires ALL words at 15/15
- Verify next category unlocks only when current is 100% complete
- Test edge cases (one word at 14/15 should keep category locked)

**Demo:** Only when ALL words in "common words 3" reach 15/15 does "common words 4" unlock automatically.

## Step 5: Add progress display to word selection interface

Show mastery progress counters in the word selection interface.

**Implementation:**
- Create `WordProgressDisplay` component showing "word: X/15" format
- Integrate progress display into existing word list rendering
- Add visual indicators for mastered words (checkmarks, different colors)

**Tests:**
- Test progress display renders correctly
- Verify counters update in real-time
- Test visual states for different progress levels

**Demo:** Word selection page shows progress counters for each word, updates immediately after tests.

## Step 6: Implement category locking visual indicators

Add visual feedback for locked/unlocked categories.

**Implementation:**
- Create lock icon component
- Add CSS classes for locked category styling
- Modify category rendering to show lock state
- Disable click handlers for locked categories

**Tests:**
- Test locked categories display correctly
- Verify locked categories are unclickable
- Test visual styling for different states

**Demo:** Non-active categories show lock icons and are visually disabled, cannot be clicked.

## Step 7: Modify word selection to use active category only

Update word selection logic to focus on the currently active mastery category.

**Implementation:**
- Modify `BaseWordSelection` to highlight active category
- Override word selection to use all words from active category
- Ensure only active category is clickable

**Tests:**
- Test that only active category can be selected
- Verify all words from active category are included
- Test category switching when progression occurs

**Demo:** Only the active mastery category (initially "common words 3") is clickable and selectable.

## Step 8: Add automatic category progression logic

Implement the automatic unlocking and switching to the next category.

**Implementation:**
- Add category sequence configuration
- Implement smooth transition to next category
- Update UI to reflect new active category
- Handle edge cases (no next category available)

**Tests:**
- Test progression through multiple categories
- Verify UI updates correctly on progression
- Test behavior at end of sequence

**Demo:** Completing "common words 3" automatically makes "common words 4" the new active category.

## Step 9: Update SpellingTest to use all words in category

Modify the spelling test to include all words from the active category instead of just 3 words.

**Implementation:**
- Override word selection in mastery mode to include all category words
- Maintain existing test flow but with expanded word list
- Ensure test cycles through all words in order

**Tests:**
- Test that all words in category are included in test
- Verify test order matches category word order
- Test with categories of different sizes

**Demo:** Starting a spelling test includes all words from the active category, not just 3 words.

## Step 10: Integrate mastery mode with existing test flow

Ensure mastery mode works seamlessly with existing test components and flows.

**Implementation:**
- Verify SpellingTest component works with mastery word lists
- Ensure results pages display correctly
- Maintain existing test features (audio, skip, retry)

**Tests:**
- Full integration test of complete test flow
- Test all existing features work with mastery mode
- Verify results and practice pages function correctly

**Demo:** Complete spelling test flow works identically to before, but with mastery tracking and expanded word lists.

## Step 11: Add mastery progress persistence to API

Extend the existing progress API to save and load mastery progress data.

**Implementation:**
- Extend progress API endpoints to include mastery data
- Add mastery progress to save/load operations
- Ensure backward compatibility with existing progress data

**Tests:**
- Test mastery progress saves correctly
- Verify mastery progress loads on app restart
- Test API error handling and fallbacks

**Demo:** Mastery progress persists across browser sessions, loads correctly on app restart.

## Step 12: Test and polish the complete mastery system

Comprehensive testing and refinement of the entire mastery mode implementation.

**Implementation:**
- End-to-end testing of complete mastery flow
- Performance optimization and code cleanup
- Error handling and edge case resolution
- User experience polish and refinements

**Tests:**
- Complete user journey testing
- Performance and load testing
- Error scenario testing
- Cross-browser compatibility testing

**Demo:** Fully functional mastery mode that provides smooth, engaging learning experience with proper progress tracking and category progression.

---

## Technical Notes

### State Management
- Mastery progress stored alongside existing progress data
- Real-time updates to UI when progress changes
- Proper error handling for state corruption

### API Integration
- Extend existing progress endpoints rather than creating new ones
- Maintain backward compatibility with existing data
- Graceful degradation if mastery features fail

### Performance Considerations
- Efficient progress calculations for large word lists
- Minimal re-renders when progress updates
- Proper cleanup of event listeners and timers

### User Experience
- Smooth transitions between categories
- Clear visual feedback for progress and achievements
- Consistent behavior with existing spelling test flow
