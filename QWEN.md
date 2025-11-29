# Project Context for PMM (Purvanchal Mitra Mahasabha)

## Project Overview

This is a Next.js 16 application bootstrapped with `create-next-app`, designed as a membership management system for "Purvanchal Mitra Mahasabha" - an NGO focused on community development and cultural preservation in eastern India. The project uses modern web development technologies including React 19, TypeScript, Tailwind CSS, and a PostgreSQL database via Neon serverless database.

### Key Technologies & Features

- **Framework**: Next.js 16 with App Router and React Compiler enabled
- **Language**: TypeScript
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Styling**: Tailwind CSS with Radix UI components
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Date handling**: date-fns and internationalized/date
- **Theming**: next-themes for dark/light mode
- **Code quality**: Biome.js for linting and formatting
- **Database migrations**: Drizzle Kit

## Project Architecture

The project follows Next.js App Router conventions with the following main directories:

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable React components
- `contexts/` - React contexts for state management
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and database connection
- `scripts/` - Standalone scripts (e.g., create-admin)

## Database Schema

The application uses a PostgreSQL database with the following tables:

1. **Members table**:
   - id (UUID, primary key)
   - name, address, mobile, email (contact info)
   - dob (date of birth)
   - education
   - permanentAddress
   - image (URL for member photo)
   - donated (integer, default 0)
   - type (member type, default 'member')
   - createdAt, updatedAt timestamps

2. **Admins table**:
   - id (UUID, primary key)
   - username (unique)
   - password (hashed)
   - createdAt timestamp

3. **Blogs table**:
   - id (UUID, primary key)
   - title, content, excerpt
   - author
   - published (0 for draft, 1 for published)
   - publishedAt timestamp
   - image (URL for featured image)
   - createdAt, updatedAt timestamps

## Building and Running

### Prerequisites

- Node.js (with Bun, npm, Yarn, or pnpm)
- PostgreSQL database (Neon serverless recommended)

### Setup Instructions

1. Install dependencies:

   ```bash
   bun install
   # or npm install, yarn install, pnpm install
   ```

2. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your `DATABASE_URL` for the PostgreSQL database

3. Set up the database:

   ```bash
   npx drizzle-kit generate # Generate migration files
   npx drizzle-kit migrate  # Run migrations to create tables
   ```

4. Create an initial admin user:

   ```bash
   bun run create-admin
   # This creates an admin user with username 'admin' and password 'admin123'
   ```

5. Run the development server:

   ```bash
   bun run dev
   # or npm run dev, yarn dev, pnpm dev
   ```

   The application will be available at http://localhost:3000

### Available Scripts

- `dev` - Start the Next.js development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run Biome linter
- `format` - Format code with Biome
- `create-admin` - Create an initial admin user in the database

## Development Conventions

### Code Style

- Code formatting is handled by Biome.js
- Indentation: 2 spaces
- Linting follows Biome's recommended rules with React and Next.js domains enabled
- Import organization is handled automatically

### File Structure

- Components use the `@/*` path alias (e.g., `@/components/ui/button`)
- Database operations are abstracted through Drizzle ORM
- Environment variables are loaded using dotenv

### Database Migrations

- Schema is defined in `src/lib/db/schema.ts`
- Migrations are managed with Drizzle Kit
- Use `npx drizzle-kit generate` to create migration files
- Use `npx drizzle-kit migrate` to apply migrations

## Key Application Features

Based on the schema and code, this appears to be a membership management system with:

- Member profiles with contact information and details
- Admin authentication system
- Blog/publishing functionality
- Support for member images and featured blog images
- Donation tracking per member
- Draft/published state for blog posts
- Responsive UI with Tailwind CSS
- SEO optimization with metadata management
- Mobile-first design approach

## Important Notes

1. The project uses bcryptjs for password hashing in the admin authentication system
2. Remote images are allowed from picsum.photos for the Next.js Image component
3. The React Compiler is enabled for performance optimization
4. UUIDs are used for primary keys across all tables
5. Timestamps for creation and updates are automatically managed

This appears to be a well-structured Next.js application with modern tooling for a membership management system with blogging capabilities, designed specifically for an NGO called "Purvanchal Mitra Mahasabha".