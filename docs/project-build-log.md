# SkillBridge OS Project Build Log

## Purpose

This file records the implementation history of the project so other developers and agents can quickly understand:

- what has been built
- what decisions were made
- why those decisions were made
- which frameworks and tools are in use
- what should happen next

This should be updated throughout the project as meaningful work is completed.

## Project Rules

These rules apply throughout the project:

1. Always clear generated `dist` files after generating them and testing them.
2. Record completed work, major decisions, framework choices, and implementation reasoning in this file.

## Product Context

SkillBridge OS is the internal operating system for a domestic staffing agency.

It is designed to replace founder-dependent, WhatsApp-driven operations with a structured platform for:

- worker intake
- worker verification
- employer management
- job request tracking
- candidate matching
- placement tracking
- leadership visibility

The product is not a public marketplace. It is an operations system first, with a public website acting as the trust-building and lead-entry surface.

## Core Frameworks and Infrastructure

### Frontend

- React
- TypeScript
- shadcn/ui
- Netlify deployment target

Recommended frontend direction documented:

- Next.js preferred because the project includes both a public website and an authenticated internal app

### Backend

- Node.js
- Express
- TypeScript
- Render deployment target

### Database and Auth

- Supabase Postgres
- Supabase Authentication
- Prisma ORM

### File Storage

- Cloudinary

## Documentation Added

### 1. Phase 1 engineering specification

File:

- `docs/phase-1-engineering-spec.md`

Purpose:

- converts the PRD into a buildable Phase 1 engineering specification
- defines backend and frontend scope
- defines architecture, data model, routes, statuses, workflows, and delivery milestones

### 2. Frontend builder prompt

File:

- `docs/frontend-builder-prompt.md`

Purpose:

- provides a detailed UI/UX brief for a frontend builder or UI-focused agent
- explains the product idea, trust context, user types, workflows, and design expectations

## Backend Build History

### Task: Create the first backend scaffold

Status:

- completed

Location:

- `Server/`

### What was created

- new backend workspace in `Server`
- npm project initialization
- TypeScript configuration
- Express app structure
- Prisma initialization
- Supabase-aware auth foundation
- Cloudinary config stub
- validators, middleware, controllers, and routes for Phase 1 backend modules

### Key reasoning

The backend needed to move from PRD/spec stage into a buildable service foundation.

The chosen goal was not to create a toy scaffold, but to establish a backend structure that already reflects the actual product model:

- role-based access
- worker lifecycle
- employer records
- job requests
- matching
- placements
- dashboard visibility

### Framework-specific decisions

#### Express

Express was scaffolded as the API server because it matches the selected backend stack and is a strong fit for modular REST endpoints.

#### Prisma

Prisma was used as the ORM because it was explicitly selected for the project and provides a clean schema-driven model for the Phase 1 entities.

Important implementation note:

- Prisma 7 no longer uses datasource connection URLs directly in the Prisma schema file in the old way
- the backend was adjusted to use the current adapter-based pattern with `@prisma/adapter-pg`
- this aligns the project with current Prisma behavior and works well with Supabase Postgres

#### Supabase Auth

The auth middleware verifies bearer tokens using Supabase JWKS/JWT verification principles instead of trusting client-side session claims blindly.

This was chosen because:

- the frontend will authenticate with Supabase
- the Express API still needs its own protected route checks
- the backend must trust verified tokens, not raw client-provided identity state

#### Cloudinary

Cloudinary config was prepared early because worker profile images and verification documents are part of the product’s core operational workflow.

## Backend Files Created

### Configuration and setup

- `Server/package.json`
- `Server/tsconfig.json`
- `Server/prisma.config.ts`
- `Server/.env`
- `Server/.env.example`

### Prisma

- `Server/prisma/schema.prisma`

### Application entry

- `Server/src/app.ts`
- `Server/src/server.ts`

### Config

- `Server/src/config/env.ts`
- `Server/src/config/cloudinary.ts`

### Libraries

- `Server/src/lib/prisma.ts`
- `Server/src/lib/supabase.ts`

### Middleware

- `Server/src/middleware/authenticate.ts`
- `Server/src/middleware/attach-current-user.ts`
- `Server/src/middleware/require-role.ts`
- `Server/src/middleware/error-handler.ts`

### Controllers

- `Server/src/controllers/auth.controller.ts`
- `Server/src/controllers/users.controller.ts`
- `Server/src/controllers/workers.controller.ts`
- `Server/src/controllers/employers.controller.ts`
- `Server/src/controllers/job-requests.controller.ts`
- `Server/src/controllers/matches.controller.ts`
- `Server/src/controllers/placements.controller.ts`
- `Server/src/controllers/dashboard.controller.ts`
- `Server/src/controllers/health.controller.ts`

### Routes

- `Server/src/routes/index.ts`
- `Server/src/routes/auth.routes.ts`
- `Server/src/routes/users.routes.ts`
- `Server/src/routes/workers.routes.ts`
- `Server/src/routes/employers.routes.ts`
- `Server/src/routes/job-requests.routes.ts`
- `Server/src/routes/matches.routes.ts`
- `Server/src/routes/placements.routes.ts`
- `Server/src/routes/dashboard.routes.ts`
- `Server/src/routes/health.routes.ts`

### Validators and utilities

- `Server/src/validators/*.ts`
- `Server/src/utils/*.ts`
- `Server/src/types/express.d.ts`

## Backend Data Model Decisions

Phase 1 entities implemented in Prisma include:

- `User`
- `Worker`
- `WorkerRole`
- `WorkerDocument`
- `WorkerReference`
- `Guarantor`
- `Employer`
- `JobRequest`
- `Match`
- `Placement`
- `AuditLog`

Requested worker fields included:

- `NIN`
- `BVN`

## Business Logic Added

The initial backend scaffold already includes real Phase 1 logic:

- duplicate worker warning conditions based on phone, NIN, and BVN
- worker verification submission, approval, and rejection flow
- minimum verification checks before approval
- rule-based matching with explainable reasons
- placement creation that updates worker availability and request status
- dashboard summary endpoint for key operational counts

## Validation and Build Results

### Completed checks

- Prisma client generation succeeded
- TypeScript build succeeded

### Important cleanup rule applied

Generated build output should not remain committed or left around after test/build checks.

For that reason:

- generated `dist` output should be removed after verification steps

## Current Project State

The project currently has:

- product documentation
- engineering specification
- UI builder brief
- backend scaffold for Phase 1

The backend is ready for:

- real environment variable wiring
- first migration against Supabase Postgres
- seed/setup work
- deeper endpoint implementation
- upload flow integration

## Suggested Next Steps

1. Wire real Supabase and Cloudinary credentials into `Server/.env`
2. Run the first Prisma migration
3. Add seed/setup workflow for owner and staff users
4. Implement document upload endpoints and Cloudinary upload flow
5. Add more refined verification queue and dashboard queries
6. Start frontend app scaffolding and connect to backend APIs

## Maintenance Note

Any future agent or developer should update this file after meaningful work is done.

At minimum, each new entry should capture:

- what was changed
- why it was changed
- any architecture or framework decisions
- what remains unresolved
