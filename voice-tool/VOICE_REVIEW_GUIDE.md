# 🎧 Voice Review Session - Quick Start Guide

## Getting Started

### Check Current Status
```bash
cd /Users/ant/git/perso/spellingwebsite/spellingWebsite/voice-tool
node kiro-cli.js --status
```

### Resume Review Process
```bash
# Find next word to review from status output
node kiro-cli.js --play <word>
```

## Review Workflow

### 1. Listen to Audio
```bash
node kiro-cli.js --play <word>
```

### 2. Make Decision
- **Accept**: `node kiro-cli.js --accept <word>` or type `a`
- **Reject**: `node kiro-cli.js --reject <word>` or type `r`
- **Listen again**: Re-run the play command

### 3. Alternative Voices
- System auto-generates next voice when rejected
- Cycles through: rachel → dorothy → emily → thomas → antoni → adam
- Manual selection: `node kiro-cli.js --choose <word> <voice>`

## Available Commands

### Core Review Commands
```bash
node kiro-cli.js --play <word>           # Listen to current voice
node kiro-cli.js --accept <word>         # Accept current voice
node kiro-cli.js --reject <word>         # Try next voice
node kiro-cli.js --choose <word> <voice> # Select specific voice
```

### Information Commands
```bash
node kiro-cli.js --status               # Check progress
node kiro-cli.js --list-voices <word>   # See available voices for word
```

### Completion Commands
```bash
node kiro-cli.js --upload               # Upload approved words to S3
```

## Available Voices

- **rachel** (primary voice)
- **dorothy** (alternative)
- **emily** (alternative)
- **thomas** (alternative)
- **antoni** (alternative)
- **adam** (alternative)

## Progress Tracking

- All progress auto-saved to `progress/voice-generation-progress.json`
- Safe to interrupt and resume anytime
- Each word tracks: status, voice used, audio path, completion time
- Alternative voices generated on-demand during review

## Tips

1. **Quick responses**: Use single letters `a` (accept) or `r` (reject)
2. **Listen multiple times**: Re-run play command as needed
3. **Voice comparison**: Use `--list-voices` to see all options for a word
4. **Resume anytime**: Check `--status` to see where you left off
5. **Batch upload**: Use `--upload` when you've completed a batch of words

## Troubleshooting

- **No audio found**: Word may not be in cache, check status for available words
- **Wrong voice playing**: Use `--choose <word> <voice>` to force specific voice
- **Progress not saving**: Check file permissions on `progress/` directory
