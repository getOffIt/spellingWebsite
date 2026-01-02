# Voice Generation Script

Interactive script to generate and review ElevenLabs voices for all spelling words.

## Setup

1. Set environment variables:
```bash
export ELEVENLABS_API_KEY="your_api_key_here"
export S3_BUCKET="your-bucket-name"  # optional, defaults to spelling-website-voices
```

2. Ensure AWS CLI is configured for S3 uploads:
```bash
aws configure
```

3. Run the script:
```bash
cd scripts
npm run generate
```

## How it works

1. **Extracts all words** from `src/data/words.ts`
2. **Generates audio** with Rachel voice first
3. **Plays audio** for you to review
4. **Prompts for approval**: 
   - `y` = accept and upload to S3
   - `n` = try next voice (Adam, then Bella)
   - `r` = retry same voice
5. **Saves progress** to `voice-generation-progress.json`
6. **Uploads to S3** with structure: `{voice_name}/{word_id}.mp3`

## Resume from interruption

The script saves progress and asks which word index to start from, so you can resume if interrupted.

## Output

- S3 files: `s3://your-bucket/rachel/word-id.mp3`
- Progress file: `voice-generation-progress.json`
- Failed words list for manual review
