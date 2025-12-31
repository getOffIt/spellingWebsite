# Requirements Clarification

This document captures the detailed requirements gathered through interactive discussion.

## Q1: Primary Voice Selection

**Question:** Which voice should be the primary/default voice for generating the spelling words?

**Answer:** Rachel (`21m00Tcm4TlvDq8ikWAM`) - Clear, neutral female voice, child-friendly

## Q2: Quality Review Process

**Question:** How should the quality review process work when you listen to each generated word?

**Answer:** 
- Audio should play automatically after generation
- Options should be:
  - `y` = Accept and save this audio
  - `n` = Reject and try next voice (Adam, then Bella)
  - `l` = Listen again (replay same audio without regenerating)

## Q3: Fallback Voice Order

**Question:** What should be the order of fallback voices if Rachel's audio is rejected?

**Answer:** Include 4 additional voices in the fallback sequence. Also need ability to return to Rachel's voice if it's still available on disk after trying other voices.

**Available child-friendly voices from research:**
- **Dorothy** (`ThT5KcBeYPX3keUQqHPh`) - Pleasant, young female, British accent, ideal for children's stories
- **Emily** (`LcfcDJNUP1GQjkzn1xUU`) - Calm, young female, American accent, perfect for meditation/relaxation
- **Sarah** (`EXAVITQu4vr4xnSDxMaL`) - Soft, young female, American accent (this is Bella)
- **Thomas** (`GBv7mTt0atIp3Br8iCZE`) - Calm, young male, American accent, ideal for meditation/relaxation
- **Adam** (`pNInz6obpgDQGcFmaJgB`) - Deep, male voice, American accent, ideal for narration
- **Antoni** (`ErXwobaYiN019PkySvjV`) - Well-rounded, young male, American accent

**Proposed fallback order:** Rachel → Dorothy → Emily → Thomas → Antoni → Adam → Return to Rachel option

## Q4: Voice Selection Confirmation

**Question:** Do you approve this 6-voice fallback sequence, or would you prefer different voices?

**Answer:** Yes, approved. Final voice sequence:
1. **Rachel** (`21m00Tcm4TlvDq8ikWAM`) - Primary voice
2. **Dorothy** (`ThT5KcBeYPX3keUQqHPh`) - Pleasant, young female, British accent
3. **Emily** (`LcfcDJNUP1GQjkzn1xUU`) - Calm, young female, American accent
4. **Thomas** (`GBv7mTt0atIp3Br8iCZE`) - Calm, young male, American accent
5. **Antoni** (`ErXwobaYiN019PkySvjV`) - Well-rounded, young male, American accent
6. **Adam** (`pNInz6obpgDQGcFmaJgB`) - Deep, male voice, American accent
7. **Return to Rachel option** - Available after trying other voices

## Q5: Audio File Management

**Question:** How should the tool handle temporary audio files during the review process?

**Answer:** Keep all generated voices for each word until you make a final decision (allows comparison)

## Q6: Upload Strategy

**Question:** Should approved audio files be saved locally first then uploaded to S3 in batches, or uploaded to S3 immediately after approval?

**Answer:** Save all approved files locally, then upload everything to S3 at the end

## Q7: Progress Tracking and Resume

**Question:** How should the tool handle interruptions and resuming the generation process?

**Answer:** 
- Track which words have been approved with which voice
- Show current overall progress (e.g., "45/230 words completed")
- Support multiple use cases:
  - **Resume incomplete session** - Continue from where left off
  - **Add new words** - Only process newly added words from words.ts
  - **Re-generate specific words** - Allow Leo to request voice changes for existing words
- Automatically detect completion status and offer appropriate options

## Q8: Word Management Strategy

**Question:** How should the tool handle different scenarios when running?

**Answer:** Always show me the menu to choose from

**Menu options:**
1. **Process all words** - Start from scratch (ignore existing progress)
2. **Resume incomplete session** - Continue from where left off
3. **Process new words only** - Only words not in progress file
4. **Re-generate specific word** - Enter word ID to regenerate
5. **Show progress summary** - View current completion status

## Q9: ElevenLabs API Configuration

**Question:** How should the tool handle ElevenLabs API settings and voice quality parameters?

**Answer:** Make these settings configurable. Use recommended settings as defaults:
- **Model:** `eleven_turbo_v2_5` 
- **Voice Settings:**
  - Stability: 0.6
  - Similarity Boost: 0.8
  - Style: 0.2
  - Speaker Boost: true
- **Output Format:** `mp3_44100_128`

## Q10: Error Handling and Retry Logic

**Question:** How should the tool handle API failures, network issues, or other errors during generation?

**Answer:** Based on research, implement robust but simple error handling:
- **3 automatic retries** with exponential backoff (1s, 2s, 4s) for transient errors
- **No retry for authentication errors:** Invalid API key → immediate user intervention
- **Rate limit respect:** Throttle requests to stay under API limits
- **Manual intervention:** Ask user after 3 failed attempts whether to retry or skip
- **Progress preservation:** Save progress after each successful generation
- **Simple status messages:** Show "Retrying..." instead of technical errors
- **Failed word tracking:** Mark failed words for later retry

**Non-retriable errors:** Invalid API key, malformed requests, permanent failures
**Retriable errors:** Rate limits (429), server errors (5XX), timeouts, network issues

Expected failure rate: 1-5 words out of 230 will need manual intervention.

## Q11: Batch Generation Strategy

**Question:** Should the tool generate all words with the primary voice first, or generate and review one word at a time?

**Answer:** Generate all 230 words with Rachel (primary voice) upfront in batch (~5 minutes), then review each one. This makes the review workflow smoother since audio is already available.

**Workflow:**
1. **Batch Generation Phase:** Generate all words with Rachel voice first
2. **Review Phase:** Play each word, accept or request alternative voice
3. **Alternative Generation:** Only generate alternatives when needed during review
4. **New Words:** For future word additions, only generate the new words

**Benefits:**
- Faster review process (no waiting for generation)
- Can review offline after batch generation
- Progress through review more smoothly
- Only generate alternatives when actually needed

## Q12: Final Workflow Confirmation

**Question:** Does this complete workflow with batch generation meet your requirements?

**Answer:** Yes, that seems pretty good.

**Final approved workflow:**
1. **Startup menu** → Choose mode (all words, resume, new only, specific word, progress summary)
2. **Batch generation** → Generate all words with Rachel first (~5 minutes)
3. **Smooth review** → Pre-generated audio ready to play instantly
4. **Alternative voices** → Only generate when Rachel is rejected (Dorothy → Emily → Thomas → Antoni → Adam → Return to Rachel)
5. **Review options** → y (accept), n (try next voice), l (listen again)
6. **Progress tracking** → Comprehensive state with resume capability
7. **Error handling** → Smart retry logic (3 retries for transient errors, immediate intervention for auth errors)
8. **File management** → Keep all generated voices until final decision
9. **S3 upload** → Batch upload approved files at the end
10. **Configurable settings** → API parameters with optimized defaults

Requirements clarification is complete.

## Q13: Kiro CLI Integration

**Question:** How should the tool integrate with Kiro CLI for AI agent-driven operation?

**Answer:** AI agent should NOT make quality decisions about audio - human will do that.

## Q14: Human-AI Collaboration Model

**Question:** How should the AI agent and human collaborate in the workflow?

**Answer:** Option B: AI as Assistant
- AI agent: Monitors progress, provides status updates, handles retries
- Human: Controls the entire workflow but gets AI assistance  
- AI agent: Executes commands but asks human for all decisions

## Q15: AI Agent Interface Design

**Question:** How should the tool interface with the AI agent to provide assistance?

**Answer:** 
- Text interface is fine for communication
- Use computer speakers for audio playback of generated voices
- Question: Should this be an MCP server or a prompt-based tool?

## Q16: Implementation Architecture Choice

**Question:** Should this be implemented as an MCP server or a prompt-based tool?

**Answer:** Hybrid Approach:
- Standalone tool that can be called by AI agent
- Uses file-based progress persistence  
- AI agent uses existing `execute_bash` tool to run it

## Q17: Command Interface Design

**Question:** How should the standalone tool's command interface be designed for AI agent interaction?

**Analysis & Recommendation:**

**Option A: Single Command with Modes**
- **Pros:** Consistent interface, easy to extend with new modes
- **Cons:** Longer command syntax, more complex argument parsing

**Option B: Separate Commands** 
- **Pros:** Simple, clear commands, easier for AI to understand
- **Cons:** Multiple executables or complex routing logic

**Option C: Interactive with Non-Interactive Mode** ⭐ **RECOMMENDED**
- **Pros:** 
  - Preserves original human workflow (`--interactive`)
  - Clean AI workflow with specific commands
  - Best of both worlds - human UX + AI automation
  - Easy to test and debug each mode separately
- **Cons:** Slightly more complex implementation

**Recommended Interface:**
```bash
voice-tool --interactive           # Original menu-driven workflow
voice-tool --batch                 # Generate all Rachel voices
voice-tool --review <word-id>      # Review specific word  
voice-tool --status [--json]       # Check progress (optional JSON)
voice-tool --upload               # Upload approved files to S3
```

**Benefits:**
- AI agent gets simple, focused commands
- Human can still use rich interactive mode
- Clear separation of concerns
- Easy to add `--json` flag for structured output when needed

**Answer:** Option C with the recommended interface above.

## Q18: Audio Playback Integration

**Question:** How should audio playback work when the AI agent triggers review mode?

**Answer:** Option A (Automatic Playback)
- AI runs `voice-tool --review off`
- Audio plays immediately through speakers
- Human hears it and responds y/n/l
- Tool returns result to AI agent

## Q19: Output Format for AI Agent

**Question:** What output format should the tool provide for the AI agent to parse and understand?

**Answer:** Option A (Human-Readable Text)
- Natural language output that AI agents can easily parse
- Simple implementation, easy to debug
- Follows Unix tool conventions
- Example: "Word 'off' approved with Rachel voice. Ready for next word: 'stuff'"

## Q20: Final Kiro CLI Integration Confirmation

**Question:** Does this complete Kiro CLI integration approach meet your requirements?

**Answer:** Yes.

**Final approved Kiro CLI integration:**
- **Collaboration Model:** AI as assistant, human makes quality decisions
- **Architecture:** Hybrid standalone tool called via `execute_bash`
- **Commands:** `--interactive`, `--batch`, `--review <word>`, `--status`, `--upload`
- **Audio Playback:** Automatic playback through speakers when AI triggers review
- **Output Format:** Human-readable text for easy AI parsing
- **Workflow:** AI handles automation, human handles audio quality decisions

Kiro CLI integration requirements are complete.

**Options:**

**Option A: Automatic Playback**
```bash
voice-tool --review off
# Automatically plays audio through speakers
# Waits for human input: y/n/l
# Returns result to AI agent
```
- **Pros:** Simple, matches original workflow
- **Cons:** Audio plays immediately, no control over timing

**Option B: Manual Playback Control**
```bash
voice-tool --review off --no-auto-play
# Shows: "Audio ready for word 'off'. Press 'p' to play, then y/n/l to decide"
# Human controls when audio plays
```
- **Pros:** Human controls timing, can prepare to listen
- **Cons:** Extra step, more complex interaction

**Option C: Separate Play Command**
```bash
voice-tool --play off rachel        # Play specific voice
voice-tool --review off --silent    # Review without auto-play
```
- **Pros:** Maximum flexibility, AI can play audio multiple times
- **Cons:** More commands, more complex workflow

**Option D: Status-Driven Playback**
```bash
voice-tool --review off
# Outputs: "Ready to play audio for 'off'. Type 'play' to hear it."
# Human types: play
# Tool plays audio, then prompts: y/n/l?
```
- **Pros:** Clear workflow, human-paced
- **Cons:** More interaction steps

Which option would work best for your workflow with the AI agent?
