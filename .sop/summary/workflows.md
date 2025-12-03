# Workflows

## User Workflows

### Authentication Workflow

```mermaid
sequenceDiagram
    User->>App: Access protected route
    App->>AuthProvider: Check authentication
    AuthProvider->>Cognito: Validate session
    Cognito-->>AuthProvider: Not authenticated
    AuthProvider-->>App: Redirect to /login
    App->>User: Show login page
    User->>Cognito: Sign in
    Cognito-->>App: OIDC callback with code
    App->>Cognito: Exchange code for tokens
    Cognito-->>App: Access token, ID token
    App->>localStorage: Store tokens
    App->>User: Redirect to requested route
```

### Spelling Practice Workflow

```mermaid
flowchart TD
    A[User opens app] --> B[ChallengesPage]
    B --> C{Select challenge}
    C -->|KS1-1| D[WordSelection]
    C -->|Common Words| E[CommonWordsSelection]
    D --> F[BaseWordSelection]
    E --> F
    F --> G{Click category or challenge}
    G -->|Category| H[Select 3 words from category]
    G -->|Challenge| I[Select in-progress words]
    H --> J[SpellingTest]
    I --> J
    J --> K[Present word with TTS]
    K --> L[User types spelling]
    L --> M{Correct?}
    M -->|Yes| N[Record correct attempt]
    M -->|No| O[Record incorrect attempt]
    N --> P{More words?}
    O --> P
    P -->|Yes| K
    P -->|No| Q[Show results]
    Q --> R{Test mode?}
    R -->|Practice| S[Show detailed results]
    R -->|Full Test| T{Pass threshold met?}
    T -->|Yes| U[Show success]
    T -->|No| V[Show failure]
    S --> W[Options: Retry/Practice]
    U --> W
    V --> W
    W --> X{Continue?}
    X -->|Yes| B
    X -->|No| Y[End]
```

### Progress Tracking Workflow

```mermaid
sequenceDiagram
    App->>ProgressProvider: Initialize
    ProgressProvider->>API: GET /api/progress
    API->>DynamoDB: Query by userId
    DynamoDB-->>API: Progress records
    API-->>ProgressProvider: All progress data
    ProgressProvider->>ProgressProvider: Transform to ProgressData
    ProgressProvider->>App: Provide context
    
    Note over SpellingTest: User completes spelling
    SpellingTest->>ProgressProvider: recordAttempt(wordId, correct, attempt)
    ProgressProvider->>API: PUT /api/progress/{wordId}
    API->>DynamoDB: Update (append to progress array)
    DynamoDB-->>API: Updated item
    API->>DynamoDB: Query all progress
    DynamoDB-->>API: All progress records
    API-->>ProgressProvider: Complete progress data
    ProgressProvider->>ProgressProvider: Update state
    ProgressProvider->>useWord: Notify hooks
    useWord->>Components: Trigger re-render
```

### Two-Stage Test Workflow (less_family words)

```mermaid
flowchart TD
    A[Start test with less_family words] --> B[Stage 1: Base Words]
    B --> C[Present base word]
    C --> D[User types base word]
    D --> E{All base words done?}
    E -->|No| C
    E -->|Yes| F{All base words correct?}
    F -->|No| G[Show base stage results]
    F -->|Yes| H[Stage 2: Full Words]
    G --> I[Options: Retry/Practice]
    H --> J[Present full word]
    J --> K[User types full word]
    K --> L{All full words done?}
    L -->|No| J
    L -->|Yes| M[Show final results]
    M --> I
```

### Mastery Calculation Workflow

```mermaid
flowchart TD
    A[Get word progress] --> B{Has attempts?}
    B -->|No| C[Status: not-started]
    B -->|Yes| D[Calculate streak from end]
    D --> E{Streak >= 3?}
    E -->|No| F[Status: in-progress]
    E -->|Yes| G{Check for unmastery}
    G -->|Was mastered, now incorrect| H[Status: unmastered]
    G -->|Still correct| I[Status: mastered]
    C --> J[Return stats]
    F --> J
    H --> J
    I --> J
```

## System Workflows

### Application Initialization

```mermaid
sequenceDiagram
    Browser->>main.tsx: Load application
    main.tsx->>AuthProvider: Initialize OIDC
    AuthProvider->>Cognito: Check existing session
    Cognito-->>AuthProvider: Session status
    AuthProvider->>ProgressProvider: Initialize
    ProgressProvider->>API: GET /api/progress (if authenticated)
    API-->>ProgressProvider: Progress data
    ProgressProvider->>App: Render application
    App->>Router: Setup routes
    Router->>User: Display UI
```

### Word Selection Workflow

```mermaid
flowchart TD
    A[User on WordSelection page] --> B[BaseWordSelection loads]
    B --> C[Call useWord for all words]
    C --> D[Group words by category]
    D --> E[Calculate category progress]
    E --> F[Display categories with progress]
    F --> G{User action}
    G -->|Click category| H[Select next 3 words from category]
    G -->|Click challenge| I[Select in-progress words]
    H --> J[Call onSelectWords]
    I --> J
    J --> K[Navigate to /spelling-test]
    K --> L[SpellingTest component]
```

### Challenge Progress Calculation

```mermaid
flowchart TD
    A[ChallengesPage loads] --> B[Get all words for challenge]
    B --> C[Call useWord for each word]
    C --> D[Filter by status]
    D --> E[Count mastered words]
    E --> F[Calculate percentage]
    F --> G{Determine status}
    G -->|100%| H[completed]
    G -->|>= 80%| I[close]
    G -->|>= 60%| J[good]
    G -->|>= 40%| K[steady]
    G -->|>= 20%| L[starting]
    G -->|< 20%| M[beginning]
    H --> N[Display challenge card]
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
```

## API Workflows

### GET Progress Workflow

```mermaid
sequenceDiagram
    Client->>API Gateway: GET /api/progress<br/>Authorization: Bearer token
    API Gateway->>Lambda Authorizer: Validate token
    Lambda Authorizer->>Cognito: Verify token
    Cognito-->>Lambda Authorizer: Token valid, user claims
    Lambda Authorizer-->>API Gateway: Authorized
    API Gateway->>Lambda: Invoke handler
    Lambda->>Lambda: Extract userId from claims
    Lambda->>DynamoDB: Query by userId
    DynamoDB-->>Lambda: Progress items
    Lambda->>Lambda: Format response
    Lambda-->>API Gateway: 200 OK with JSON
    API Gateway-->>Client: Progress data
```

### PUT Progress Workflow

```mermaid
sequenceDiagram
    Client->>API Gateway: PUT /api/progress/{wordId}<br/>Body: {progress: [...]}
    API Gateway->>Lambda Authorizer: Validate token
    Lambda Authorizer-->>API Gateway: Authorized
    API Gateway->>Lambda: Invoke handler
    Lambda->>Lambda: Extract userId, wordId, progress
    Lambda->>Lambda: Validate request body
    Lambda->>DynamoDB: Update item<br/>Append to progress array
    DynamoDB-->>Lambda: Updated item
    Lambda->>DynamoDB: Query all progress for user
    DynamoDB-->>Lambda: All progress items
    Lambda->>Lambda: Format response
    Lambda-->>API Gateway: 200 OK with all progress
    API Gateway-->>Client: Complete progress data
```

## Error Handling Workflows

### Authentication Error Flow

```mermaid
flowchart TD
    A[API Request] --> B{Token present?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Token valid?}
    D -->|No| C
    D -->|Yes| E[Continue request]
    C --> F[Client: Redirect to login]
```

### API Error Flow

```mermaid
flowchart TD
    A[API Request] --> B{Request valid?}
    B -->|No| C[400 Bad Request]
    B -->|Yes| D[DynamoDB Operation]
    D --> E{Success?}
    E -->|No| F[500 Server Error]
    E -->|Yes| G[200 OK]
    C --> H[Client: Show error message]
    F --> H
    G --> I[Client: Update UI]
```

## Data Synchronization Workflow

```mermaid
sequenceDiagram
    Note over ProgressProvider: Initial Load
    ProgressProvider->>API: GET /api/progress
    API-->>ProgressProvider: Progress data
    ProgressProvider->>ProgressProvider: Store in state
    
    Note over SpellingTest: User Action
    SpellingTest->>ProgressProvider: recordAttempt()
    ProgressProvider->>API: PUT /api/progress/{wordId}
    API->>DynamoDB: Update
    DynamoDB-->>API: Updated
    API->>DynamoDB: Query all
    DynamoDB-->>API: All progress
    API-->>ProgressProvider: Complete progress
    ProgressProvider->>ProgressProvider: Update state
    ProgressProvider->>Components: Notify via context
    Components->>Components: Re-render with new data
```

## Token Refresh Workflow

```mermaid
sequenceDiagram
    App->>AuthProvider: Monitor token expiration
    AuthProvider->>AuthProvider: Check expiration time
    AuthProvider->>Cognito: Silent token renewal
    Cognito-->>AuthProvider: New tokens
    AuthProvider->>localStorage: Update tokens
    AuthProvider->>App: Continue with new token
```

