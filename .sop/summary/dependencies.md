# Dependencies

## Production Dependencies

### React Ecosystem
- **react** (^19.0.0): Core React library
- **react-dom** (^19.0.0): React DOM rendering
- **react-router-dom** (^7.6.0): Client-side routing

**Purpose:** Core framework for building the user interface

**Usage:**
- React components for UI
- React Router for navigation
- React hooks for state management

### Authentication
- **react-oidc-context** (^3.3.0): React context for OIDC/OAuth2
- **oidc-client-ts** (^3.2.1): OIDC client library

**Purpose:** Handle authentication with AWS Cognito

**Usage:**
- `AuthProvider` wraps the application
- `useAuth` hook provides authentication state
- Automatic token refresh and session management

### UI Libraries
- **canvas-confetti** (^1.9.3): Celebration effects

**Purpose:** Visual feedback for achievements

**Usage:**
- Triggered on challenge completion
- Provides engaging user experience

## Development Dependencies

### Build Tools
- **vite** (^6.3.1): Build tool and dev server
- **@vitejs/plugin-react** (^4.3.4): Vite plugin for React

**Purpose:** Fast development and optimized production builds

**Features:**
- Hot Module Replacement (HMR)
- Fast builds
- Optimized production bundles

### Testing
- **vitest** (^3.1.4): Test runner
- **@testing-library/react** (^16.3.0): React testing utilities
- **@testing-library/jest-dom** (^6.6.3): DOM matchers
- **jsdom** (^27.0.0): DOM implementation for testing

**Purpose:** Unit and integration testing

**Usage:**
- Component testing
- Hook testing
- Utility function testing

### Code Quality
- **eslint** (^9.22.0): Linter
- **@eslint/js** (^9.22.0): ESLint JavaScript configuration
- **eslint-plugin-react-hooks** (^5.2.0): React hooks linting rules
- **eslint-plugin-react-refresh** (^0.4.19): React Fast Refresh linting

**Purpose:** Code quality and consistency

**Configuration:**
- React-specific rules
- Hooks rules
- Fast Refresh compatibility

### TypeScript
- **@types/node** (^22.15.3): Node.js type definitions
- **@types/react** (^19.0.10): React type definitions
- **@types/react-dom** (^19.0.4): React DOM type definitions

**Purpose:** TypeScript type support

**Usage:**
- Type checking
- IDE autocomplete
- Compile-time error detection

### Utilities
- **globals** (^16.0.0): Global variables for ESLint

**Purpose:** ESLint configuration support

## Backend Dependencies

### AWS Lambda (lambdas/progress.js)
- **@aws-sdk/client-dynamodb** (^3.x): DynamoDB client
- **@aws-sdk/lib-dynamodb** (^3.x): DynamoDB document client

**Purpose:** Interact with DynamoDB

**Usage:**
- Query user progress
- Update progress records
- Scan for maintenance operations

## External Services

### AWS Cognito
**Service:** User authentication and authorization

**Configuration:**
- Region: eu-west-2
- User Pool: eu-west-2_XeQbQOSjJ
- Client ID: 3ua09or8n2k4cqldeu3u8bv585

**Features Used:**
- OIDC/OAuth2 authentication
- Token management
- Session monitoring

### AWS DynamoDB
**Service:** NoSQL database

**Table:** `spellingProgress`

**Access Pattern:**
- Partition key: userId
- Sort key: wordId
- Query by userId to get all progress

### AWS API Gateway
**Service:** REST API endpoint

**Base URL:** `https://api.spellingninjas.com/api/progress`

**Endpoints:**
- GET /api/progress
- PUT /api/progress/{wordId}

**Features:**
- Lambda integration
- CORS configuration
- JWT authorizer

### AWS Lambda
**Service:** Serverless compute

**Runtime:** Node.js 22

**Function:** `lambdas/progress.js`

**Features:**
- Progress retrieval
- Progress updates
- Data deduplication utility

## Browser APIs

### Web Speech API
**API:** `window.speechSynthesis`

**Purpose:** Text-to-speech for word pronunciation

**Usage:**
```typescript
const utterance = new SpeechSynthesisUtterance(word);
speechSynthesis.speak(utterance);
```

**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

### Web Storage API
**API:** `localStorage`

**Purpose:** Token storage via `WebStorageStateStore`

**Usage:**
- OIDC tokens (access, ID, refresh)
- Session state

## Dependency Relationships

```mermaid
graph TD
    A[React App] --> B[react-router-dom]
    A --> C[react-oidc-context]
    C --> D[oidc-client-ts]
    A --> E[canvas-confetti]
    
    F[Vite Build] --> G[@vitejs/plugin-react]
    F --> H[TypeScript]
    
    I[Testing] --> J[vitest]
    I --> K[@testing-library/react]
    I --> L[jsdom]
    
    M[Lambda] --> N[@aws-sdk/client-dynamodb]
    M --> O[@aws-sdk/lib-dynamodb]
    
    P[External Services] --> Q[AWS Cognito]
    P --> R[AWS DynamoDB]
    P --> S[AWS API Gateway]
    P --> T[AWS Lambda]
```

## Version Constraints

### React 19
- Latest major version
- Breaking changes from React 18
- Improved performance and features

### React Router 7
- Latest major version
- Improved TypeScript support
- Better performance

### Vite 6
- Latest major version
- Improved build performance
- Better plugin system

## Security Considerations

### Authentication Dependencies
- **react-oidc-context**: Handles secure token storage
- **oidc-client-ts**: Implements OIDC security best practices
- Tokens stored in localStorage (consider httpOnly cookies for production)

### API Dependencies
- All API calls require Bearer token authentication
- CORS configured for API endpoints
- No sensitive data in client-side code

## Dependency Management

### Package Manager
- **npm**: Used via `package-lock.json`
- Lock file ensures consistent installs

### Updates
- Regular security updates recommended
- Test thoroughly before major version upgrades
- Monitor for breaking changes in React 19 ecosystem

## Build Dependencies

### Production Build
- Vite bundles all dependencies
- Tree-shaking removes unused code
- Code splitting for optimal loading

### Development
- Vite dev server for fast HMR
- TypeScript compilation on-the-fly
- ESLint runs during development

## Runtime Dependencies

### Browser Requirements
- Modern browser with ES2020+ support
- Web Speech API support (for TTS)
- localStorage support (for token storage)

### Node.js (Lambda)
- Node.js 22 runtime
- ES modules support
- AWS SDK v3

## Optional Dependencies

None currently. All dependencies are required for core functionality.

## Future Dependency Considerations

### Potential Additions
- **React Query / SWR**: For better API state management
- **Zustand / Jotai**: If state management becomes complex
- **React Hook Form**: For form validation if needed
- **Date-fns / Day.js**: For date formatting if needed

### Potential Removals
- None identified

