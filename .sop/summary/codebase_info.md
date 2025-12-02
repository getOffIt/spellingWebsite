# Codebase Information

## Project Overview

**Project Name:** Spelling Website (Spelling Mate)  
**Type:** React + TypeScript Web Application  
**Purpose:** Educational spelling practice application for children with progress tracking, authentication, and gamified challenges

## Technology Stack

### Frontend
- **Framework:** React 19.0.0
- **Language:** TypeScript
- **Build Tool:** Vite 6.3.1
- **Routing:** React Router DOM 7.6.0
- **Authentication:** react-oidc-context 3.3.0 (OIDC/OAuth2 with AWS Cognito)
- **UI Libraries:** 
  - canvas-confetti 1.9.3 (celebration effects)

### Backend/Infrastructure
- **API:** REST API hosted at `https://api.spellingninjas.com/api/progress`
- **Database:** AWS DynamoDB (table: `spellingProgress`)
- **Authentication Provider:** AWS Cognito (eu-west-2 region)
- **Serverless Functions:** AWS Lambda (Node.js 22, ES modules)

### Development Tools
- **Testing:** Vitest 3.1.4, @testing-library/react 16.3.0, jsdom 27.0.0
- **Linting:** ESLint 9.22.0 with React plugins
- **Type Checking:** TypeScript with @types packages

## Project Structure

```
spellingWebsite/
├── src/
│   ├── components/          # Reusable React components
│   ├── contexts/            # React Context providers (Auth, Progress)
│   ├── pages/               # Page-level components (routes)
│   ├── hooks/               # Custom React hooks
│   ├── config/              # Configuration files
│   ├── data/                # Static data (word lists)
│   ├── utils/               # Utility functions
│   ├── test/                # Test setup
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── *.css                # Component styles
├── lambdas/                 # AWS Lambda functions
├── public/                  # Static assets
├── dist/                    # Build output
└── *.config.ts              # Configuration files (Vite, Vitest, ESLint)
```

## Supported Programming Languages

- **TypeScript/JavaScript:** Primary language (100% of codebase)
- **CSS:** Styling
- **HTML:** Template files

## Key Features

1. **Spelling Tests:** Interactive spelling practice with text-to-speech
2. **Progress Tracking:** Per-word progress tracking with mastery system (3 consecutive correct = mastered)
3. **Challenges:** Gamified challenges with progress visualization
4. **Authentication:** OIDC-based authentication with AWS Cognito
5. **Word Lists:** Organized by phonics categories and difficulty levels
6. **Two Test Modes:** Practice mode and full test mode with pass thresholds

## Dependencies Summary

### Production Dependencies
- React ecosystem (react, react-dom, react-router-dom)
- Authentication (react-oidc-context, oidc-client-ts)
- UI effects (canvas-confetti)

### Development Dependencies
- Build tools (vite, @vitejs/plugin-react)
- Testing (vitest, @testing-library/react, jsdom)
- Code quality (eslint, typescript types)

## Build and Run

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run linter
```

## Environment

- **Node.js:** ES modules (type: "module" in package.json)
- **Target:** Modern browsers (ES2020+)
- **Deployment:** Static site hosting (Vite build output)

