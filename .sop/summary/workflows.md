# Key Workflows and Processes #workflow

## User-Facing Workflows #react

### Spelling Practice Workflow
```mermaid
flowchart TD
    A[User Login] --> B[Authentication Check]
    B --> C[Challenges Dashboard]
    C --> D[Select Word List]
    D --> E[Configure Test Settings]
    E --> F[Start Spelling Test]
    F --> G[Play Audio]
    G --> H[User Input]
    H --> I{Correct?}
    I -->|Yes| J[Next Word]
    I -->|No| K[Show Feedback]
    K --> L{Retry Available?}
    L -->|Yes| G
    L -->|No| J
    J --> M{More Words?}
    M -->|Yes| G
    M -->|No| N[Show Results]
    N --> O[Save Progress]
    O --> P[Return to Dashboard]
```

### Authentication Workflow
```mermaid
sequenceDiagram
    participant U as User
    participant R as React App
    participant O as OIDC Provider
    participant P as Protected Route
    
    U->>R: Access Protected Route
    R->>P: Check Authentication
    P->>O: Validate Token
    
    alt Token Valid
        O-->>P: User Info
        P-->>R: Render Protected Content
        R-->>U: Show Content
    else Token Invalid/Missing
        P->>O: Redirect to Login
        O->>U: Show Login Form
        U->>O: Enter Credentials
        O->>R: Return Auth Code
        R->>O: Exchange for Tokens
        O-->>R: Access Token
        R->>P: Retry Route Access
        P-->>R: Render Protected Content
        R-->>U: Show Content
    end
```

## Voice Generation Workflows #voice-tool

### Batch Audio Generation Workflow
```mermaid
flowchart TD
    A[Load Word List] --> B[Check Existing Progress]
    B --> C{Resume Session?}
    C -->|Yes| D[Load Previous State]
    C -->|No| E[Initialize New Session]
    D --> F[Filter Pending Words]
    E --> F
    F --> G[Process Batch]
    G --> H[Generate Audio via ElevenLabs]
    H --> I{Generation Success?}
    I -->|Yes| J[Save to Local Cache]
    I -->|No| K[Log Error & Retry]
    K --> L{Max Retries?}
    L -->|No| H
    L -->|Yes| M[Mark as Failed]
    J --> N[Update Progress]
    M --> N
    N --> O{More Words?}
    O -->|Yes| G
    O -->|No| P[Generation Complete]
    P --> Q[Generate Summary Report]
```

### Human Review Workflow
```mermaid
flowchart TD
    A[Start Review Session] --> B[Load Generated Audio]
    B --> C[Play Current Audio]
    C --> D[Human Decision]
    D --> E{Accept?}
    E -->|Yes| F[Mark as Approved]
    E -->|No| G[Mark as Rejected]
    G --> H{Try Alternative Voice?}
    H -->|Yes| I[Generate with Next Voice]
    H -->|No| J[Mark as Failed]
    I --> K{Generation Success?}
    K -->|Yes| C
    K -->|No| L[Try Next Voice]
    L --> M{More Voices?}
    M -->|Yes| I
    M -->|No| J
    F --> N[Update Review State]
    J --> N
    N --> O{More Words?}
    O -->|Yes| B
    O -->|No| P[Review Complete]
    P --> Q[Generate Review Report]
```

### S3 Deployment Workflow
```mermaid
flowchart TD
    A[Start Upload Process] --> B[Scan Approved Audio]
    B --> C[Validate File Integrity]
    C --> D{File Valid?}
    D -->|No| E[Log Error & Skip]
    D -->|Yes| F[Prepare S3 Upload]
    F --> G[Set Metadata & Headers]
    G --> H[Upload to S3]
    H --> I{Upload Success?}
    I -->|No| J[Retry Upload]
    I -->|Yes| K[Verify Upload]
    K --> L{Verification Success?}
    L -->|No| J
    L -->|Yes| M[Update Upload State]
    J --> N{Max Retries?}
    N -->|No| H
    N -->|Yes| O[Mark as Failed]
    E --> P{More Files?}
    O --> P
    M --> P
    P -->|Yes| B
    P -->|No| Q[Upload Complete]
    Q --> R[Generate Upload Report]
    R --> S[Cleanup Temp Files]
```

## Development Workflows

### Voice Tool Development Workflow
```mermaid
flowchart TD
    A[Code Changes] --> B[Build TypeScript]
    B --> C[Run Unit Tests]
    C --> D{Tests Pass?}
    D -->|No| E[Fix Issues]
    E --> A
    D -->|Yes| F[Test with 5-Word List]
    F --> G[Run Quick Integration Test]
    G --> H{Integration Success?}
    H -->|No| I[Debug Issues]
    I --> A
    H -->|Yes| J[Test Full Workflow]
    J --> K[Manual Review Testing]
    K --> L[Deploy to Production]
```

### Frontend Development Workflow
```mermaid
flowchart TD
    A[Component Changes] --> B[Run Dev Server]
    B --> C[Test in Browser]
    C --> D[Run Unit Tests]
    D --> E{Tests Pass?}
    E -->|No| F[Fix Issues]
    F --> A
    E -->|Yes| G[Build for Production]
    G --> H[Test Production Build]
    H --> I{Build Success?}
    I -->|No| F
    I -->|Yes| J[Deploy to Staging]
    J --> K[User Acceptance Testing]
    K --> L[Deploy to Production]
```

## Error Handling Workflows

### API Error Recovery Workflow
```mermaid
flowchart TD
    A[API Call Fails] --> B[Identify Error Type]
    B --> C{Rate Limit?}
    C -->|Yes| D[Wait & Retry]
    C -->|No| E{Auth Error?}
    E -->|Yes| F[Refresh Token]
    E -->|No| G{Network Error?}
    G -->|Yes| H[Exponential Backoff]
    G -->|No| I{Quota Exceeded?}
    I -->|Yes| J[Switch to Alternative]
    I -->|No| K[Log Error & Fail]
    D --> L{Retry Success?}
    F --> L
    H --> L
    J --> L
    L -->|Yes| M[Continue Processing]
    L -->|No| N{Max Retries?}
    N -->|No| O[Increment Retry Count]
    O --> D
    N -->|Yes| K
    K --> P[Update Error State]
    M --> Q[Update Success State]
```

### File System Error Recovery
```mermaid
flowchart TD
    A[File Operation Fails] --> B[Check Error Type]
    B --> C{Permission Error?}
    C -->|Yes| D[Request Elevated Access]
    C -->|No| E{Disk Full?}
    E -->|Yes| F[Cleanup Temp Files]
    E -->|No| G{File Locked?}
    G -->|Yes| H[Wait & Retry]
    G -->|No| I[Log Error & Fail]
    D --> J{Access Granted?}
    F --> K{Space Available?}
    H --> L{File Available?}
    J -->|Yes| M[Retry Operation]
    J -->|No| I
    K -->|Yes| M
    K -->|No| I
    L -->|Yes| M
    L -->|No| I
    M --> N{Operation Success?}
    N -->|Yes| O[Continue Processing]
    N -->|No| P{Max Retries?}
    P -->|No| Q[Increment Retry Count]
    Q --> A
    P -->|Yes| I
```

## Data Flow Workflows

### Audio Playback Data Flow (Updated with VoiceService)
```mermaid
sequenceDiagram
    participant U as User
    participant ST as SpellingTest
    participant VS as VoiceService
    participant M as Voice Manifest
    participant CDN as CDN/S3
    participant TTS as Browser TTS
    
    U->>ST: Start Test / Next Word
    ST->>VS: speak(word)
    VS->>M: Load manifest (lazy, once)
    M-->>VS: Word → URL mapping
    VS->>VS: Look up word in manifest
    
    alt MP3 Available
        VS->>CDN: Fetch audio file
        CDN-->>VS: MP3 data
        VS->>U: Play audio
    else MP3 Not Found
        VS->>TTS: speechSynthesis.speak(word)
        TTS->>U: TTS audio output
    end
```

### Progress Persistence Flow
```mermaid
sequenceDiagram
    participant C as CLI Process
    participant F as File System
    participant S as State Manager
    
    C->>S: Update Progress
    S->>F: Write Progress JSON
    F-->>S: Write Confirmation
    S-->>C: Update Complete
    
    Note over C,F: On Process Restart
    C->>S: Load Previous State
    S->>F: Read Progress JSON
    F-->>S: Progress Data
    S-->>C: Restored State
    C->>C: Resume from Last Position
```

## Integration Workflows

### Kiro CLI Integration Workflow
```mermaid
flowchart TD
    A[Kiro CLI Command] --> B[Parse Arguments]
    B --> C{Command Type?}
    C -->|--batch| D[Run Batch Generation]
    C -->|--play| E[Play Audio for Review]
    C -->|--accept| F[Accept Current Voice]
    C -->|--reject| G[Reject & Try Next Voice]
    C -->|--upload| H[Upload to S3]
    C -->|--status| I[Show Progress Status]
    D --> J[Execute Batch Service]
    E --> K[Execute Audio Service]
    F --> L[Execute Review Service]
    G --> L
    H --> M[Execute Upload Service]
    I --> N[Execute Status Service]
    J --> O[Return Results to CLI]
    K --> O
    L --> O
    M --> O
    N --> O
    O --> P[Display Results to User]
```

### CI/CD Workflow (Updated with Auto-PR)
```mermaid
flowchart TD
    A[Code Push to Branch] --> B{Is Main Branch?}
    B -->|Yes| C[Run Tests & Build]
    B -->|No| D[Auto-Create PR]
    D --> E[Assign Reviewer]
    E --> F[Add Labels]
    F --> C
    C --> G{Tests Pass?}
    G -->|No| H[Notify Developer]
    G -->|Yes| I[Build Application]
    I --> J{Build Success?}
    J -->|No| H
    J -->|Yes| K[Deploy]
```

### Voice Manifest Deployment Workflow (NEW)
```mermaid
flowchart TD
    A[Generate Audio via Batch] --> B[Human Review & Approve]
    B --> C[upload-approved-only.js]
    C --> D[Upload MP3s to S3]
    D --> E[generate-manifest.js]
    E --> F[Scan S3 for all audio files]
    F --> G[Build voice-manifest.json]
    G --> H[deploy-manifest.js]
    H --> I[Upload manifest to S3]
    I --> J[check-missing-files.js]
    J --> K[Validate consistency]
    K --> L{All consistent?}
    L -->|Yes| M[Deployment Complete]
    L -->|No| N[Fix mismatches]
    N --> C
```

## Monitoring and Maintenance Workflows

### Health Check Workflow
```mermaid
flowchart TD
    A[Scheduled Health Check] --> B[Check Frontend Status]
    B --> C[Check ElevenLabs API]
    C --> D[Check S3 Connectivity]
    D --> E[Check Auth Provider]
    E --> F[Aggregate Results]
    F --> G{All Services Healthy?}
    G -->|Yes| H[Update Status: Healthy]
    G -->|No| I[Identify Failed Services]
    I --> J[Send Alerts]
    J --> K[Update Status: Degraded]
    H --> L[Log Status]
    K --> L
    L --> M[Schedule Next Check]
```

### Backup and Recovery Workflow
```mermaid
flowchart TD
    A[Scheduled Backup] --> B[Backup Progress Files]
    B --> C[Backup Audio Cache]
    C --> D[Backup Configuration]
    D --> E[Verify Backup Integrity]
    E --> F{Backup Valid?}
    F -->|Yes| G[Store Backup]
    F -->|No| H[Retry Backup]
    H --> I{Max Retries?}
    I -->|No| B
    I -->|Yes| J[Alert Admin]
    G --> K[Cleanup Old Backups]
    K --> L[Update Backup Log]
```
