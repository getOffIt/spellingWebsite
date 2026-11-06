# Idea Honing - Requirements Clarification

This document captures the detailed requirements clarification process for the Mastery Mode feature.

## Question 1: Target Category Selection
Which specific word category should Leo focus on first for the mastery mode? For example, should it be "common words 3", or would you prefer a different category from the existing word lists?

**Answer:** "common words 3" - This will be the hardcoded target category that Leo must focus on.

## Question 2: Word Count in Mastery Set
How many words from "common words 3" should Leo practice in each mastery session? You mentioned 6-7 words in the original idea - do you want to stick with that range, or do you have a specific number in mind?

**Answer:** All words in "common words 3" - Leo should practice every single word in that category, not just a subset.

## Question 3: Repetition Requirements
How many times should Leo get each word correct before you consider moving him to the next category? You mentioned 15-20 times in the original idea - do you want a specific number, or should this be flexible?

**Answer:** 15 correct attempts per word - Each word in "common words 3" needs to be spelled correctly 15 times before the category is considered mastered.

## Question 4: Test Session Behavior
When Leo takes a spelling test in mastery mode, should he cycle through all the words in "common words 3" in each session, or should the system focus on the words that need the most practice first?

**Answer:** Option A - Always test all words in the category, in order. Leo will go through every word in "common words 3" during each test session.

## Question 5: Visual Feedback for Other Categories
You mentioned making other categories visible but unclickable. How should these disabled categories look? Should they be grayed out, have a different visual treatment, or show some kind of "locked" indicator?

**Answer:** Locked indicator - Show a lock icon or similar visual indicator. Once a category has been completed (all words done 15 times in a row with no mistakes), unlock the next category automatically.

## Question 6: Progression Logic
When you say "15 times in a row with no mistakes" - do you mean:
- Each individual word needs 15 consecutive correct attempts, OR
- All words in the category need to be spelled correctly 15 times each (but mistakes on one word don't reset the count for other words)?

**Answer:** Option B - All words need 15 correct attempts each, but mistakes on one word don't reset the count for other words. Each word has its own independent counter.

## Question 7: Next Category Selection
Once "common words 3" is completed, which category should automatically unlock next? Should it be "common words 4", or would you prefer a different progression order?

**Answer:** "common words 4" - The progression should follow the natural sequence: common words 3 → common words 4 → common words 5, etc.

## Question 8: Progress Display
Should Leo be able to see his progress toward the 15 correct attempts for each word? For example, showing "cat: 8/15" or similar progress indicators?

**Answer:** Yes - Show progress indicators like "cat: 8/15" so Leo can see how close he is to mastering each word.

## Question 9: Mastery Mode Activation
How should mastery mode be activated? Should it be:
- Always on (replace the normal mode entirely)
- A toggle/setting that can be turned on/off
- Automatically detected based on Leo's current progress

**Answer:** Always on - Replace the normal mode entirely with mastery mode. This becomes the new default behavior for the spelling website.

## Question 10: Results Page Behavior
When Leo completes a test session in mastery mode, what should the results page show? Should it display:
- Individual word progress (e.g., "cat: 9/15, dog: 12/15")
- Overall category progress
- Just continue to the next session automatically

**Answer:** Nothing different than before - Keep the existing results page behavior unchanged. The mastery logic works behind the scenes but doesn't change the post-test experience.

## Summary
I think we have enough detail to move forward with the design. The requirements are clear:

- Mastery mode always on, replacing normal mode
- Focus on "common words 3" initially, then progress to "common words 4"
- All words in category tested each session, in order
- 15 correct attempts per word (independent counters)
- Other categories locked with visual indicators
- Progress display shows "word: X/15" format
- Results page unchanged from current system

Should we proceed to create the detailed design document?
