# Current S3 Bucket Setup Research

## Existing Infrastructure

### Current S3 Bucket
- **Bucket Name:** `spellmatereact`
- **Region:** `eu-west-2` (London)
- **Purpose:** Static website hosting for the React application
- **Content:** Built application files from `dist/` directory
- **Deployment:** Automated sync with `--delete` flag (removes old files)

### CloudFront Distribution
- **Distribution ID:** `E3BMVB5WHZLJIB`
- **Purpose:** CDN for the static website
- **Invalidation:** Full cache invalidation (`/*`) on each deployment

### Deployment Process
```bash
# Current release command
cd ~/git/perso/spellingWebsite/spellingWebsite
npm run build
aws s3 sync dist/ s3://spellmatereact/ --delete --region eu-west-2
aws cloudfront create-invalidation --distribution-id E3BMVB5WHZLJIB --paths '/*'
```

### GitHub Actions Deployment
- **File:** `.github/workflows/deploy-s3.yml`
- **Trigger:** Push to main branch or manual dispatch
- **Region:** `us-west-1` (configured in workflow)
- **Bucket:** Uses `${{ secrets.AWS_S3_BUCKET }}` secret
- **CloudFront:** Uses `${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}` secret

## Analysis: Same Bucket vs Separate Bucket

### Option 1: Same Bucket (`spellmatereact`)
**Structure:**
```
spellmatereact/
├── index.html              # Website files
├── assets/
│   ├── index-abc123.js
│   └── index-def456.css
└── voices/                 # NEW: Audio files
    ├── rachel/
    │   ├── off.mp3
    │   └── stuff.mp3
    └── adam/
        ├── off.mp3
        └── stuff.mp3
```

**Pros:**
- ✅ Single bucket to manage
- ✅ Same region (eu-west-2) for consistency
- ✅ Leverages existing CloudFront distribution for audio CDN
- ✅ No additional AWS resources needed
- ✅ Audio files get cached by CloudFront automatically

**Cons:**
- ❌ Audio files get deleted on each deployment (`--delete` flag)
- ❌ Mixing static website assets with audio content
- ❌ Potential for accidental deletion of audio files
- ❌ CloudFront invalidation affects audio files unnecessarily

### Option 2: Separate Bucket (`spelling-website-voices`)
**Structure:**
```
spellmatereact/              # Existing website
├── index.html
└── assets/

spelling-website-voices/     # NEW: Audio-only bucket
├── rachel/
│   ├── off.mp3
│   └── stuff.mp3
└── adam/
    ├── off.mp3
    └── stuff.mp3
```

**Pros:**
- ✅ Audio files protected from deployment deletions
- ✅ Clear separation of concerns
- ✅ Independent versioning and management
- ✅ Can optimize bucket settings for audio (storage class, lifecycle)
- ✅ No risk of accidental deletion during website deployments

**Cons:**
- ❌ Additional bucket to manage
- ❌ Need separate CloudFront distribution for optimal performance
- ❌ Cross-origin considerations for audio loading
- ❌ Additional AWS costs (minimal for storage, but separate CloudFront)

## Updated Analysis: Same Bucket with Selective Sync

### Option 3: Same Bucket with Exclude Pattern (RECOMMENDED)

**Modified Deployment:**
```bash
# Updated release command
cd ~/git/perso/spellingWebsite/spellingWebsite
npm run build
aws s3 sync dist/ s3://spellmatereact/ --delete --exclude "voices/*" --region eu-west-2
aws cloudfront create-invalidation --distribution-id E3BMVB5WHZLJIB --paths "/*" --paths "!/voices/*"
```

**Structure:**
```
spellmatereact/
├── index.html              # Website files (synced)
├── assets/                 # Website files (synced)
│   ├── index-abc123.js
│   └── index-def456.css
└── voices/                 # Audio files (EXCLUDED from sync)
    ├── rachel/
    │   ├── off.mp3
    │   └── stuff.mp3
    └── adam/
        └── ...
```

**Pros:**
- ✅ Single bucket to manage
- ✅ Audio files protected from deployment deletions
- ✅ Leverages existing CloudFront distribution
- ✅ No additional AWS resources needed
- ✅ Simple deployment script modification

**Cons:**
- ❌ Need to be careful with exclude patterns
- ❌ Mixing content types in same bucket

## Recommendation (Updated)

**Use the same bucket with exclude patterns** - this is the simplest and most cost-effective approach.

## Implementation Considerations

### Bucket Configuration
- **Region:** `eu-west-2` (same as main bucket for consistency)
- **Public Access:** Configure for public read access to audio files
- **CORS:** Enable CORS for cross-origin audio loading from your website
- **Storage Class:** Standard for frequently accessed audio files

### CloudFront (Optional but Recommended)
- Create separate CloudFront distribution for audio bucket
- Improves global audio loading performance
- Reduces S3 request costs

### Deployment Script Updates

**Updated Release Command:**
```bash
alias release="cd ~/git/perso/spellingWebsite/spellingWebsite; npm run build && aws s3 sync dist/ s3://spellmatereact/ --delete --exclude 'voices/*' --region eu-west-2 && aws cloudfront create-invalidation --distribution-id E3BMVB5WHZLJIB --paths '/*' --exclude '/voices/*'"
```

**GitHub Actions Update:**
```yaml
- name: Deploy to S3
  run: |
    aws s3 sync dist/ s3://${{ secrets.AWS_S3_BUCKET }} --delete --exclude "voices/*"
    
- name: Invalidate CloudFront
  run: |
    if [ -n "${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}" ]; then
      aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*" --exclude "/voices/*"
    fi
```

**Voice Upload Script Update:**
```bash
# For uploading voices (separate from deployment)
aws s3 sync voices/ s3://spellmatereact/voices/ --region eu-west-2
```

## Region Discrepancy Note
Your GitHub Actions workflow uses `us-west-1` but your manual deployment uses `eu-west-2`. This should be aligned for consistency.
