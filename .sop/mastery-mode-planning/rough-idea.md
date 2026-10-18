# Rough Idea: Mastery Mode for Spelling Practice

## Original Issue
GitHub Issue #63: Add a new test style 10 words repeated

## Detailed Description - Simplified Approach
I want to create a focused mastery mode where Leo practices a specific word list (like "common words 3") repeatedly until we're ready to move on to the next list.

Key requirements:
- Hardcode focus on one specific category (e.g., "common words 3")
- Leo practices the same 6-7 words from that category repeatedly
- He might get them correct (green) 15-20 times in a row before moving to the next set
- All other word categories remain visible but become unclickable
- No admin interface needed initially - just hardcode the target category
- Current system only requires 3 correct answers before moving on, which feels superficial
- This is an additional feature - existing functionality should remain unchanged

## Simplified Implementation Strategy
- Hardcode the target category in the code
- Make non-target categories visually disabled/unclickable
- Modify test logic to repeat the same words until manual code change
- No complex admin controls or session management needed initially

## Goal
Deeper learning through repetition and mastery before progression, with a simple hardcoded approach that can be easily modified when ready to advance Leo to the next word set.
