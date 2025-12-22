# Skip Button Feature - Implementation Plan

## Implementation Checklist

- [x] Step 1: Add skipEnabled state and timer logic
- [x] Step 2: Extract advanceToNextWord helper function
- [x] Step 3: Add handleSkip function
- [x] Step 4: Add Skip button to JSX
- [x] Step 5: Add Skip button CSS styling
- [x] Step 6: Test and refine

---

## Implementation Steps

### Step 1: Add skipEnabled state and timer logic

**Objective:** Implement the 3-second delay mechanism for the Skip button.

**Implementation:**
- Add `skipEnabled` state variable initialized to `false`
- Create a `useEffect` hook that:
  - Disables skip button when word changes (step or currentStage changes)
  - Sets a 3-second timer to enable the skip button
  - Returns cleanup function to clear timer on unmount or dependency change
- Dependencies: `[step, currentStage]`

**Test Requirements:**
- Verify skip button starts disabled when word is presented
- Verify skip button enables after 3 seconds
- Verify timer resets when moving to next word

**Integration:**
- Integrates with existing state management
- Uses React's built-in useEffect and setTimeout

**Demo:**
After this step, you can log the `skipEnabled` state to console and verify it changes from false to true after 3 seconds when a word is presented.

---

### Step 2: Extract advanceToNextWord helper function

**Objective:** Refactor common navigation logic into a reusable function.

**Implementation:**
- Create new function `advanceToNextWord(userAttempt: string)`
- Move the following logic from `handleNext` into this function:
  - Get current word
  - Check if answer is correct
  - Get appropriate recordAttempt function (base vs full words)
  - Call recordAttempt with word, correctness, and attempt
  - All navigation logic (stage transitions, results display, step increment)
- Update `handleNext` to call `advanceToNextWord(answers[step])`

**Test Requirements:**
- Verify existing Next button functionality still works
- Verify stage transitions work correctly
- Verify progress tracking records attempts properly

**Integration:**
- Builds on Step 1
- Refactors existing handleNext without changing behavior
- Prepares for Skip button to reuse same logic

**Demo:**
After this step, the spelling test should work exactly as before - no visible changes, but the code is now structured to support the Skip button.

---

### Step 3: Add handleSkip function

**Objective:** Implement the Skip button click handler.

**Implementation:**
- Create `handleSkip` function that:
  - Checks if input field has text: `answers[step]`
  - If empty, uses `'[skipped]'` as the attempt
  - If has text, uses the actual text
  - Calls `advanceToNextWord(userAttempt)`

**Test Requirements:**
- Verify function correctly identifies empty vs non-empty input
- Verify `'[skipped]'` marker is used for empty input
- Verify actual text is used when input has content

**Integration:**
- Builds on Step 2's advanceToNextWord function
- Will be connected to Skip button in next step

**Demo:**
After this step, you can call `handleSkip()` from browser console to test the logic (button not yet visible in UI).

---

### Step 4: Add Skip button to JSX

**Objective:** Add the Skip button to the component's render output.

**Implementation:**
- Add Skip button JSX below the Next button
- Set className to `"spelling-skip-btn"`
- Set onClick to `handleSkip`
- Set disabled to `!skipEnabled`
- Set button text to "Skip"

**Test Requirements:**
- Verify button appears below Next button
- Verify button is disabled initially
- Verify button enables after 3 seconds
- Verify clicking button advances to next word

**Integration:**
- Builds on Steps 1-3
- Wires together state, timer, and handler function
- Button is now functional but unstyled

**Demo:**
After this step, you can see and click the Skip button. It will be functional but will use default button styling (not yet styled as secondary/muted).

---

### Step 5: Add Skip button CSS styling

**Objective:** Style the Skip button with secondary/muted appearance.

**Implementation:**
- Add `.spelling-skip-btn` CSS class to SpellingTest.css
- Style properties:
  - Gray background (#9ca3af)
  - White text
  - Smaller top margin than Next button (0.75rem vs 1.5rem)
  - Slightly smaller font and padding
  - Rounded corners matching Next button
  - Subtle shadow
  - Hover effect (darker gray #6b7280)
- Add `.spelling-skip-btn:disabled` styles:
  - Lighter gray background (#d1d5db)
  - Reduced opacity (0.6)
  - Not-allowed cursor

**Test Requirements:**
- Verify button has muted/secondary appearance
- Verify button is visually distinct from Next button
- Verify disabled state is clearly visible
- Verify hover effect works on enabled button

**Integration:**
- Completes the Skip button feature
- Matches existing button styling patterns

**Demo:**
After this step, the Skip button is fully functional and styled. You can complete a spelling test using the Skip button and verify:
- Button appears below Next button with muted styling
- Button is disabled for 3 seconds, then enables
- Clicking with empty input records '[skipped]' as failed attempt
- Clicking with text records that text and checks correctness
- Navigation works correctly through all words and stages

---

### Step 6: Test and refine

**Objective:** Comprehensive testing and refinement of the Skip button feature.

**Implementation:**
- Test on desktop browser
- Test on iPad/mobile device
- Test in both practice and full_test modes
- Test with 'single' and 'less_family' list types
- Test stage transitions with Skip button
- Verify results display shows skipped words correctly
- Adjust button size if needed based on testing

**Test Requirements:**
- Skip button works in all test modes
- Timer resets correctly between words
- Progress tracking records all attempts
- Button is easily tappable on touch devices
- No console errors or warnings
- Results page displays '[skipped]' appropriately

**Integration:**
- Final validation of complete feature
- Ensures quality and usability

**Demo:**
After this step, the Skip button feature is complete and ready for Leo to use. You can demonstrate:
- Starting a spelling test
- Waiting 3 seconds for Skip to enable
- Skipping a word with empty input (records '[skipped]')
- Typing partial answer and skipping (records and checks that answer)
- Completing test and viewing results with skipped words
- Feature works smoothly on iPad
