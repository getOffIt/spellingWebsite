# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Spelling Website

A React-based spelling practice application for children, featuring interactive spelling tests and practice sessions.

## Features

- Interactive spelling tests with audio pronunciation
- Practice mode for missed words
- Progress tracking
- User authentication
- Responsive design for mobile and desktop

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

## Deployment

This project is automatically deployed to GitHub Pages on every push to the `main` branch.

### Manual Deployment

```bash
# Build and test deployment locally
npm run deploy
```

### GitHub Pages

The site is automatically deployed to: https://getOffIt.github.io/spellingWebsite/

### Deployment Process

1. **Automatic**: Every push to `main` triggers a GitHub Action that:
   - Builds the project
   - Deploys to GitHub Pages
   
2. **Manual**: Use `npm run deploy` to test the build process locally

## Technology Stack

- React 19
- Vite
- TypeScript
- React Router
- Canvas Confetti for celebrations
- GitHub Actions for CI/CD
