# Requirements Clarification

This document captures the Q&A process to refine the skip button feature requirements.

---

## Q1: Button Placement and Visual Design

Where should the Skip button be positioned relative to the Next button, and how should it look visually?

**Options to consider:**
- **Placement:** Side-by-side with Next button, below Next button, or above Next button
- **Visual style:** Secondary button style (gray/muted), warning style (orange/yellow), or other
- **Size:** Same size as Next button, smaller, or different prominence

**Answer:**
- **Visual style:** Secondary & muted (gray background, less prominent than Next button)
- **Placement:** Below the Next button
- **Size:** To be determined during implementation (can test different sizes)

---

## Q2: Skip Button Behavior

Should the Skip button be always enabled, or should it have any conditions?

**Options:**
1. **Always enabled** - Leo can skip at any time, even if he's typed something
2. **Only enabled when input is empty** - Can only skip if he hasn't started typing
3. **Disabled for first few seconds** - Encourages trying first before skipping

**Answer:**
- Disabled for the first few seconds after each word is presented
- This encourages Leo to try before giving up
- **Delay duration:** 3 seconds

---

## Q3: What to Record for Skipped Words

When Leo skips a word, what should be recorded as his attempt?

**Options:**
1. **Empty string** `''` - Simple, indicates no attempt
2. **Special marker** `'[skipped]'` - Explicit indication it was skipped
3. **Null/undefined** - Distinguishes from empty answer

**Answer:**
- Use special marker `'[skipped]'`
- This explicitly indicates the word was skipped vs. left blank

---

## Q4: Skip Button Behavior with Partial Input

If Leo has started typing an answer but then decides to skip, what should happen?

**Options:**
1. **Allow skip and discard input** - Skip works even with partial text, clears the input
2. **Require clearing input first** - Must delete text before skip is enabled
3. **Ask for confirmation** - Show a prompt "Are you sure you want to skip?"

**Answer:**
- If there's text in the input field, record that text as the answer and check if it's correct (just like Next button)
- If the input field is empty, record `'[skipped]'` as the answer and mark as incorrect
- Skip button works exactly like Next button, but is enabled after 3 seconds regardless of input
- Implementation note: Skip and Next can share the same underlying logic

