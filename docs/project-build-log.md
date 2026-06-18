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

## Supabase MCP and Agent Tooling

### Task: Add Supabase MCP server

Status:

- completed

Command used:

- `codex mcp add supabase --url https://mcp.supabase.com/mcp?project_ref=utvjqdmvjxxeqdaotijw`

Result:

- Supabase MCP server added successfully

### Task: Authenticate Supabase MCP

Status:

- completed

Command used:

- `codex mcp login supabase`

Result:

- OAuth login completed successfully

Verification used:

- `codex mcp list`

Result:

- Supabase MCP appears in configured servers and shows OAuth auth status

### Task: Install Supabase agent skills

Status:

- completed

Command used:

- `npx skills add supabase/agent-skills`

Result:

- installed `supabase`
- installed `supabase-postgres-best-practices`

## Migration and Seed Work

### Task: Create initial migration artifact

Status:

- completed

File:

- `Server/prisma/migrations/0001_init/migration.sql`

Reasoning:

- create a shareable initial SQL migration artifact from the Prisma schema
- make the backend easier to bootstrap on a real Supabase database
- keep schema state visible in version control

Implementation note:

- Prisma 7 CLI uses `--to-schema` instead of the removed `--to-schema-datamodel`

### Task: Add seed workflow

Status:

- completed

Files:

- `Server/prisma/seed.ts`
- `Server/README.md`

What it does:

- seeds or upserts app-side owner and optional staff records
- expects real Supabase Auth user IDs to be provided in environment variables

Reasoning:

- the backend uses Supabase Auth identities, so local app users must map to real Supabase users
- a lightweight seed flow is useful before building broader demo data

### Additional backend setup improvements

Files updated:

- `Server/package.json`
- `Server/.env`
- `Server/.env.example`

Changes:

- added `prisma:validate`
- added `prisma:seed`
- added seed-related environment variables
- added backend bootstrap instructions

## Credentials Population

### Task: Populate available environment credentials

Status:

- partially completed

What was populated automatically or from user-provided values:

- Supabase project URL added to `Server/.env`
- Supabase legacy anon key added to `Server/.env`
- Cloudinary cloud name added to `Server/.env`
- Cloudinary API key added to `Server/.env`
- Cloudinary API secret added to `Server/.env`

Reasoning:

- Supabase MCP can expose safe public project credentials like the project URL and publishable or anon keys
- sensitive backend secrets like the service role key and database connection strings still need to come from the Supabase dashboard or a secure secrets source

Still required manually:

- real owner and staff seed user IDs and emails

### Task: Finalize Supabase environment credentials

Status:

- completed

What was added:

- real `DATABASE_URL`
- real `DIRECT_URL`
- real `SUPABASE_SERVICE_ROLE_KEY`

Reasoning:

- runtime traffic for the Express backend should use the session pooler connection
- migration traffic should prefer the direct connection when reachable
- this split matches the product architecture better than using transaction pooling for a persistent backend

Implementation detail:

- `Server/prisma.config.ts` now prefers `DIRECT_URL` for Prisma migration operations
- runtime Prisma usage still uses `DATABASE_URL`

### Task: Add defensive RLS enablement migration

Status:

- completed locally

File:

- `Server/prisma/migrations/0002_enable_rls/migration.sql`

Reasoning:

- SkillBridge OS stores sensitive staffing and identity data in the `public` schema
- since Supabase projects expose `public` by default, enabling RLS on these tables is a safe default even before detailed policies are added

### Task: Attempt to retrieve seed values from Supabase Auth

Status:

- checked

Result:

- `auth.users` currently returned no rows

Meaning:

- there are no current Supabase Auth users available to use as owner or staff seed records
- real seed values cannot be populated until those auth users exist

## Supabase Database Provisioning

### Task: Apply Phase 1 schema to Supabase project

Status:

- completed

Method used:

- Supabase MCP migration application

Applied migrations:

- initial Phase 1 schema
- RLS enablement migration

Result:

- all core Phase 1 tables now exist in the Supabase `public` schema

Tables confirmed:

- `public.User`
- `public.Worker`
- `public.WorkerRole`
- `public.WorkerDocument`
- `public.WorkerReference`
- `public.Guarantor`
- `public.Employer`
- `public.JobRequest`
- `public.Match`
- `public.Placement`
- `public.AuditLog`

Verification:

- table listing confirmed all tables exist
- RLS confirmed enabled on all created tables

### Security advisory check

Status:

- reviewed

Result:

- Supabase security advisor reported `RLS Enabled No Policy` informational findings on the new tables

Interpretation:

- this is expected for now
- the tables are backend-oriented and RLS is enabled as a defensive baseline
- detailed policies can be added later when the final client access model is defined

### Connection strategy decision

Status:

- decided and applied in configuration

Decision:

- use session-mode pooler for `DATABASE_URL`
- use direct connection for `DIRECT_URL`

Why:

- the Express backend is a persistent server, not a serverless function, so session-mode is a better fit than transaction-mode
- transaction mode is better for short-lived, high-churn connections and has prepared statement limitations
- Prisma migration operations should prefer the direct connection where possible
- if direct connectivity fails because of IPv6/network limitations, `DIRECT_URL` can fall back to the session pooler connection

## Upload Engine

### Task: Add Cloudinary upload endpoints

Status:

- completed

Files added:

- `Server/src/validators/upload.validator.ts`
- `Server/src/utils/uploads.ts`
- `Server/src/controllers/uploads.controller.ts`
- `Server/src/routes/uploads.routes.ts`

Files updated:

- `Server/src/routes/index.ts`
- `Server/README.md`

What was implemented:

- signed upload parameter endpoint
- upload result verification endpoint
- asset deletion endpoint

Design reasoning:

- this follows the Lego mindset by treating uploads as a reusable core engine service instead of embedding Cloudinary logic inside worker-specific flows
- other modules can connect to this layer later, including worker onboarding, verification, employer attachments, and future self-service portals
- the upload engine now handles:
  - file-target aware folder naming
  - deterministic public ID generation
  - audit logging
  - backend verification of Cloudinary upload signatures

Current upload targets:

- `worker_profile`
- `worker_document`
- `employer_attachment`
- `generic`

Intended usage pattern:

1. frontend asks the backend for a signed upload payload
2. frontend uploads directly to Cloudinary
3. frontend submits the Cloudinary upload result for verification
4. domain modules attach the verified asset metadata to records like `WorkerDocument`

### Upload folder structure refinement

Status:

- completed

What changed:

- upload root folder now uses `Skillbridge OS`
- worker uploads now consistently sit under worker-specific folders inside that root
- support was added for `staff_credential` uploads

Current folder structure:

- `Skillbridge OS/workers/:workerId/profile`
- `Skillbridge OS/workers/:workerId/documents`
- `Skillbridge OS/employers/:employerId/attachments`
- `Skillbridge OS/staff/:staffId/credentials`

Why:

- this makes it easier to differentiate worker files, employer files, and staff credentials
- it preserves the LEGO mindset by keeping storage organization centralized in the upload engine rather than scattering folder logic across modules

## PRD Re-Alignment

### Task: Re-center backend work on the PRD Phase 1 core system

Status:

- completed

Reasoning:

- the PRD remains the single source of truth
- backend work was re-checked against the Phase 1 core modules:
  - authentication and access control
  - worker management
  - employer management
  - job requests
  - verification workflow
  - rule-based matching
  - placement pipeline
  - admin dashboard

Outcome:

- endpoint work is now being treated as core engine infrastructure for those PRD modules
- modularity is preserved so later modules can connect without reworking the Phase 1 base

## Supabase Authentication Setup

### Task: Make user-management endpoints truly Supabase-backed

Status:

- completed

Files updated:

- `Server/src/controllers/users.controller.ts`
- `Server/src/validators/user.validator.ts`
- `Server/README.md`

What changed:

- owner user creation now provisions a staff account through Supabase Auth
- local app `User` records are now mirrored from the created Supabase Auth user
- user deactivation now also bans the corresponding Supabase Auth user in addition to disabling the local app record

Design reasoning:

- Supabase should remain the identity provider
- SkillBridge OS should remain the operational authorization layer
- this keeps identity and workflow concerns separate while still matching the PRD’s delegation model

## Endpoint Test Coverage

### Task: Test the backend endpoint surface

Status:

- completed

Files added:

- `Server/tests/api.test.ts`
- `Server/vitest.config.ts`

Files updated:

- `Server/package.json`

What was tested:

- health
- auth sync and current-user lookup
- user management
- worker CRUD and verification actions
- employer CRUD
- job request CRUD and status updates
- matching endpoints
- placement endpoints
- dashboard summary
- upload engine endpoints

Verification results:

- `npm run prisma:validate` passed
- `npm run build` passed
- `npm test` passed

Important testing note:

- current API tests are route-level tests with mocked infrastructure dependencies
- they verify endpoint shape and backend behavior orchestration
- they are not yet full live integration tests against the real Supabase database or Cloudinary service

## Live Integration Verification

### Task: Run live integration against the real backend and Supabase project

Status:

- completed

What was verified live:

- server booted successfully with the real `.env`
- health endpoint responded successfully
- a real Supabase Auth owner user was created or updated
- a real Supabase password login returned a valid access token
- `POST /api/v1/auth/sync-user` created the local app user record
- `GET /api/v1/auth/me` returned the synced owner user
- `GET /api/v1/users` worked with real auth
- `POST /api/v1/users` created a real staff account through Supabase Auth and mirrored it locally
- `POST /api/v1/employers` created a real employer
- `POST /api/v1/workers` created a real worker
- worker document, reference, and guarantor routes worked live
- worker verification approval worked live
- `POST /api/v1/job-requests` created a real job request
- `POST /api/v1/job-requests/:id/matches` returned a live match result
- `POST /api/v1/placements` created a live placement
- `GET /api/v1/dashboard/summary` reflected the live data changes
- `POST /api/v1/uploads/signature` generated a live Cloudinary upload signature payload

Live entities created during verification:

- one owner auth/app user
- one staff auth/app user
- one employer
- one worker
- one job request
- one placement

Observed integration issue:

- the first live placement request failed because the submitted `placementDate` string did not match the API’s strict ISO datetime validator

Resolution:

- retried with an explicit UTC ISO format
- placement creation then succeeded

Outcome:

- the core PRD-aligned backend flow is now verified both in mocked route tests and in a real live integration pass

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

## 2026-06-18 - Backend Input Hardening And Safer Upload Rules

### What Changed

- Added shared safe input helpers in `Server/src/validators/common.ts`
- Hardened request validators for:
  - users
  - workers
  - employers
  - job requests
  - placements
  - uploads
- Switched core validator objects to strict schemas so unknown fields are rejected
- Added normalization and sanitization for common string inputs:
  - trims and collapses whitespace
  - strips control characters
  - rejects HTML-tag-like content
  - constrains length
- Tightened worker identity fields:
  - `NIN` must be 11 digits
  - `BVN` must be 11 digits
- Added safer bounds to numeric and free-text fields
- Added salary range validation so `salaryMax` cannot be lower than `salaryMin`
- Restricted upload signing to safe, expected file types only

### Upload Rules Now Enforced

Allowed file types:

- `pdf`
- `doc`
- `docx`
- `xls`
- `xlsx`
- `csv`
- `png`
- `jpg`
- `jpeg`

Additional upload restrictions:

- `worker_profile` accepts images only
- image uploads must be `png`, `jpg`, or `jpeg`
- raw uploads must be office-safe documents only
- upload verification now rejects unsupported formats
- upload verification now enforces a 10MB max payload
- delete endpoint now only accepts `image` and `raw` resource types

### Why This Was Done

The backend is meant to be the PRD-aligned core engine for other modules. That means the API must be safe and predictable before the frontend starts plugging into it.

This hardening pass reduces common risks such as:

- malformed payloads
- unexpected fields
- HTML/script-like input in text fields
- unsafe or irrelevant upload types
- inconsistent identity and contact data

### Architecture Notes

- Validation continues to use `zod`
- Sanitization is centralized through reusable helpers to keep rules consistent across modules
- Upload restrictions are enforced before Cloudinary signing so the frontend gets clear, early feedback
- Cloudinary signing now includes `allowed_formats` in the signed payload

### Verification

- `npm run build` passed
- `npm test` passed
- `Server/dist` was cleared after verification to follow project rules

### Remaining Follow-Up

- add rate limiting and request-size protections at the Express middleware layer
- add security headers and CORS tightening for deployment environments
- run another live integration pass for the full upload round-trip from signed request to Cloudinary callback verification

## 2026-06-18 - Express Middleware Security Layer

### What Changed

- Added centralized security middleware in `Server/src/middleware/security.ts`
- Tightened CORS to allow only the configured frontend origin
- Added in-memory rate limiting for:
  - auth routes
  - general API routes
- Reduced request body exposure by setting stricter payload limits
- Disabled the `X-Powered-By` header
- Enabled proxy awareness for deployment behind Render or other proxies
- Tuned security headers with `helmet`

### Middleware Rules Now Active

CORS:

- only the configured `FRONTEND_URL` is allowed as a browser origin
- credentialed requests remain supported
- requests with no browser origin header are still allowed for safe server-to-server and local tooling use

Rate limiting:

- `/api/v1/auth/*` is limited to 30 requests per 15 minutes per IP
- `/api/v1/*` is limited to 300 requests per 15 minutes per IP
- `/api/v1/health` is excluded from the general limiter
- limiter response includes `X-RateLimit-*` headers and `Retry-After`

Request size limits:

- JSON bodies limited to `1mb`
- URL-encoded bodies limited to `250kb`
- URL-encoded parameter count limited to `50`

Security headers:

- `helmet` remains active
- `referrerPolicy` is set to `no-referrer`
- `crossOriginResourcePolicy` is set to `cross-origin`
- `contentSecurityPolicy` is disabled at the API layer to avoid accidental conflicts since this service is not rendering browser HTML

### Why This Was Done

The API is the PRD-aligned core engine, so we need baseline protection at the transport and middleware layer, not just in validators.

This reduces exposure to:

- abusive request bursts
- oversized payloads
- loose browser-origin access
- accidental framework fingerprinting

### Verification

- `npm run build` passed
- `npm test` passed
- `Server/dist` was cleared after verification

### Future Upgrade Path

- move rate limiting to a shared store such as Redis before high-scale production usage
- split rate limits further by route sensitivity if needed
- add deployment-specific CORS origin lists if multiple trusted frontend surfaces are introduced

## 2026-06-18 - Auth Maturity Pass

### What Changed

- Added public forgot-password endpoint:
  - `POST /api/v1/auth/forgot-password`
- Added owner-only invite resend endpoint:
  - `POST /api/v1/users/:id/resend-invite`
- Updated owner-created invite redirect target to:
  - `${FRONTEND_URL}/auth/accept-invite`
- Added explicit RBAC checks across all internal operations routes using `requireRole("owner", "staff")`
- Added frontend auth integration documentation in `docs/auth-integration-guide.md`
- Added live RLS policy migration in:
  - `Server/prisma/migrations/0003_auth_rls_policies/migration.sql`

### Forgot Password Flow

The backend can now initiate password recovery by calling Supabase Auth with the configured frontend reset page:

- redirect target: `${FRONTEND_URL}/auth/reset-password`

Completion of the password reset still belongs to the frontend, which should listen for the Supabase `PASSWORD_RECOVERY` event and then call:

- `supabase.auth.updateUser({ password })`

### Invite Acceptance Flow

Staff invite emails now target a dedicated invite acceptance route rather than the generic login page:

- `${FRONTEND_URL}/auth/accept-invite`

This makes the frontend flow much clearer:

1. receive invite email
2. land on invite acceptance route
3. set password if needed
4. sync app user
5. enter the internal app

### RBAC Audit Outcome

The backend already had authentication and current-user attachment in place, but some route files did not make role requirements explicit.

That was tightened so the internal operational routes now clearly declare role access in code for:

- workers
- employers
- job requests
- matching
- placements
- uploads
- dashboard

User management remains owner-only.

### RLS Modeling

RLS is no longer just enabled. Policies were added for the `authenticated` role across the internal app tables.

Policy direction:

- authenticated owner/staff users can access internal operations tables
- `User` writes are owner-scoped
- `AuditLog` direct writes are owner-scoped
- `anon` table access is revoked

Important implementation note:

- Supabase MCP was not available during this pass because OAuth re-authentication was required
- Prisma `migrate deploy` could not use the configured direct host from this environment due DNS resolution issues
- the SQL migration was therefore applied directly over the reachable pooler connection and then verified by querying `pg_policies`

### Verification

- `npm run build` passed
- `npm test` passed
- live database verification confirmed RLS policies now exist in `pg_policies`

### Remaining Auth Gaps

- frontend login, route guards, and session bootstrap still need to be implemented in the React app
- frontend password reset and invite acceptance screens still need to be built
- if Prisma direct-host connectivity remains unstable in this environment, future schema deploys may need the same fallback until DNS/network is corrected
