# Agent Configuration for PMM Codebase

## Build/Lint/Test Commands

- **Development**: `bun dev` (starts development server with Turbopack)
- **Build**: `bun run build` (creates production build)
- **Lint**: `bun run lint` (runs Biome linter)
- **Format**: `bun run format` (formats code with Biome)
- **Create Admin**: `bun run create-admin` (creates admin user)
- **Single Test**: No dedicated test command found in package.json

## Code Style Guidelines

### Imports
- Use absolute imports with `@/*` alias for src directory
- Organize imports in groups: React/core, third-party, absolute, relative
- Use named imports when available

### Formatting
- 2 space indentation (spaces, not tabs)
- Biome handles formatting automatically
- Line width: Default (typically 80-100 chars)
- Semicolons required
- Trailing commas in multi-line objects/arrays

### Types
- Strict TypeScript with `strict: true` in tsconfig
- Use interfaces for object shapes
- Use type aliases for unions/primitives
- Prefer explicit typing over inference when beneficial

### Naming Conventions
- PascalCase for components and interfaces
- camelCase for variables, functions, and props
- UPPER_SNAKE_CASE for constants
- kebab-case for file names
- Descriptive variable names, avoid abbreviations

### Error Handling
- Use try/catch for async operations
- Handle errors at the appropriate level
- Display user-friendly error messages
- Log errors for debugging when appropriate

### Component Structure
- Use functional components with TypeScript interfaces
- Place "use client" directive when using client-side features
- Export components as default when they are page components
- Use React.forwardRef for components that need to forward refs

### UI Components
- Use Radix UI and custom components from src/components/ui
- Follow existing patterns in src/components/ui for new components
- Use Tailwind classes for styling
- Use cn() utility for conditional class merging