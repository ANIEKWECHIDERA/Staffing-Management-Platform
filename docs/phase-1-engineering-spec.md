# SkillBridge OS Phase 1 Engineering Spec

## 1. Purpose

This document converts the SkillBridge OS PRD into a buildable Phase 1 engineering specification.

Phase 1 goal:

Build the internal operating system that allows SkillBridge to run daily agency operations inside one platform instead of relying on WhatsApp, phone calls, notebooks, and founder memory.

Phase 1 scope:

- Authentication and access control
- Worker management
- Employer management
- Job request management
- Verification workflow
- Rule-based matching
- Placement pipeline
- Admin dashboard
- Public website / entry point

This phase must be usable in production by internal staff, even before later automation and payment features are added.

## 2. Selected Stack

### Frontend

- React
- TypeScript
- shadcn/ui
- Netlify deployment

Recommended frontend framework:

- `Next.js` is preferred for the frontend because it supports both the public website and the internal app cleanly.
- If the team wants a lighter setup, `Vite + React Router` is acceptable.
- Because the app includes a public website and an authenticated internal console, `Next.js` is the better default.

### Backend

- Node.js
- Express
- Render deployment

### Database and Auth

- Supabase Postgres
- Supabase Authentication
- Prisma ORM

### Storage

- Cloudinary for worker document and profile image uploads

## 3. Product Model

SkillBridge OS is not a public marketplace. It is an internal agency operating system.

The product replaces a manual staffing workflow:

1. Capture a worker
2. Verify the worker
3. Capture an employer
4. Capture a job request
5. Match suitable workers
6. Confirm a placement
7. Give leadership visibility into open work and recent activity

The app should feel like an operations console for a high-trust staffing business:

- fast
- clear
- phone-friendly for staff
- structured but not heavy
- optimized for search, filtering, and action-taking

## 4. Architecture

## 4.1 High-Level Architecture

- Public website and internal app on the frontend
- Express API for business logic
- Supabase Postgres as the database
- Prisma as ORM and schema manager
- Supabase Auth for user identity
- Cloudinary for file storage

## 4.2 Deployment Layout

### Frontend on Netlify

- Public marketing pages
- Login page
- Authenticated internal operations app

### Backend on Render

- Express REST API
- Prisma client
- Background-safe service endpoints for matching and verification updates

### Supabase

- Postgres database
- Auth users and session validation

### Cloudinary

- Worker profile photos
- NIN document uploads
- BVN support document uploads if captured as files
- ID cards
- guarantor files
- reference/supporting documents

## 4.3 Integration Pattern

Frontend should never talk directly to Prisma.

Recommended request flow:

1. User authenticates with Supabase Auth
2. Frontend stores session
3. Frontend calls Express API with bearer token
4. Express verifies Supabase JWT
5. Express applies business rules and talks to Postgres through Prisma
6. File upload flow uses signed upload pattern or API-mediated Cloudinary upload

## 5. User Roles

Phase 1 roles:

- `owner`
- `staff`

### Owner permissions

- full platform access
- create and deactivate staff accounts
- view all workers, employers, requests, placements, and audit history
- view sensitive worker verification data
- manage role assignment

### Staff permissions

- create and edit workers
- create and edit employers
- create and update job requests
- run matching
- create placements
- update verification workflows
- view dashboard
- no ability to manage users
- sensitive document access may be restricted by route or field depending on final policy

## 6. Core Entities

Phase 1 data entities:

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

## 7. Status Enums

### Worker availability status

- `available`
- `placed`
- `unavailable`

### Worker verification status

- `draft`
- `pending_verification`
- `verified`
- `rejected`
- `incomplete`

### Job request status

- `new`
- `matching`
- `interviewing`
- `placed`
- `closed`
- `cancelled`

### Placement status

- `active`
- `ended`
- `under_replacement`

### Document status

- `uploaded`
- `approved`
- `rejected`
- `missing`

## 8. Database Design

## 8.1 Prisma Model Outline

The exact Prisma schema can be implemented from this shape.

### User

- `id`
- `supabaseUserId`
- `fullName`
- `email`
- `role`
- `isActive`
- `createdAt`
- `updatedAt`

Notes:

- `supabaseUserId` links internal app users to Supabase Auth identities.
- Authorization should rely on app-side role plus validated Supabase identity.

### Worker

- `id`
- `fullName`
- `phone`
- `email`
- `location`
- `address`
- `dateOfBirth`
- `gender`
- `profilePhotoUrl`
- `experienceYears`
- `availabilityStatus`
- `verificationStatus`
- `nin`
- `bvn`
- `notes`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Notes:

- `NIN` and `BVN` are included as requested.
- `BVN` may need stricter visibility rules because of sensitivity.

### WorkerRole

- `id`
- `workerId`
- `roleType`
- `experienceLevel`
- `yearsExperience`

Example `roleType` values:

- `nanny`
- `driver`
- `caregiver`
- `housekeeper`
- `cleaner`
- `private_cook`
- `office_support`

### WorkerDocument

- `id`
- `workerId`
- `documentType`
- `fileUrl`
- `cloudinaryPublicId`
- `status`
- `reviewNotes`
- `uploadedAt`
- `reviewedAt`
- `reviewedByUserId`

Suggested `documentType` values:

- `profile_photo`
- `nin_slip`
- `bvn_proof`
- `government_id`
- `guarantor_id`
- `reference_letter`
- `medical_report`
- `character_reference`
- `other`

### WorkerReference

- `id`
- `workerId`
- `fullName`
- `phone`
- `relationship`
- `notes`

### Guarantor

- `id`
- `workerId`
- `fullName`
- `phone`
- `address`
- `relationship`
- `idDocumentUrl`
- `notes`

### Employer

- `id`
- `name`
- `type`
- `primaryContactName`
- `phone`
- `email`
- `location`
- `address`
- `notes`
- `createdAt`
- `updatedAt`

Employer `type` values:

- `household`
- `business`
- `organization`

### JobRequest

- `id`
- `employerId`
- `roleType`
- `location`
- `workArrangement`
- `employmentType`
- `salaryMin`
- `salaryMax`
- `startDate`
- `status`
- `requirements`
- `notes`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Suggested values:

- `workArrangement`: `live_in`, `live_out`
- `employmentType`: `full_time`, `part_time`

### Match

- `id`
- `jobRequestId`
- `workerId`
- `score`
- `matchReasonsJson`
- `createdAt`

Notes:

- This table stores generated shortlist results.
- `matchReasonsJson` should capture explainability such as `["role_match","verified","same_location","available"]`.

### Placement

- `id`
- `jobRequestId`
- `workerId`
- `employerId`
- `placementDate`
- `guaranteeEndDate`
- `status`
- `notes`
- `createdByUserId`
- `createdAt`
- `updatedAt`

### AuditLog

- `id`
- `userId`
- `entityType`
- `entityId`
- `action`
- `changesJson`
- `createdAt`

## 8.2 Minimum Indexing

Add indexes on:

- `workers.phone`
- `workers.nin`
- `workers.bvn`
- `workers.availabilityStatus`
- `workers.verificationStatus`
- `employers.name`
- `jobRequests.status`
- `placements.status`
- `matches.jobRequestId`

## 8.3 Duplicate Detection

Workers should trigger duplicate warnings by:

- exact phone match
- exact NIN match
- exact BVN match if present

System behavior:

- warn user before create
- do not auto-merge in Phase 1

## 9. API Specification

Base URL:

- `/api/v1`

All authenticated routes require a valid Supabase JWT.

## 9.1 Auth and User Management

### `POST /auth/sync-user`

Purpose:

- create or update internal `User` record from authenticated Supabase user

### `GET /users/me`

Purpose:

- return current app user, role, and permissions

### `GET /users`

Role:

- owner only

### `POST /users`

Role:

- owner only

Purpose:

- create a staff member record after Supabase invite/signup flow

### `PATCH /users/:id/deactivate`

Role:

- owner only

## 9.2 Workers

### `GET /workers`

Query params:

- `search`
- `roleType`
- `location`
- `availabilityStatus`
- `verificationStatus`
- `page`
- `limit`

### `POST /workers`

Creates a worker.

Required fields:

- `fullName`
- `phone`
- `location`
- at least one `roleType`

Optional but supported:

- `email`
- `address`
- `dateOfBirth`
- `gender`
- `experienceYears`
- `nin`
- `bvn`
- `notes`

### `GET /workers/:id`

Returns:

- worker profile
- roles
- documents
- references
- guarantor
- placement history

### `PATCH /workers/:id`

Updates worker fields.

### `POST /workers/:id/documents`

Creates a worker document record after Cloudinary upload.

### `POST /workers/:id/references`

Adds worker reference.

### `POST /workers/:id/guarantors`

Adds guarantor.

### `POST /workers/:id/verification/submit`

Moves worker from `draft` or `incomplete` to `pending_verification`.

### `POST /workers/:id/verification/approve`

Approves verification and sets worker to `verified`.

### `POST /workers/:id/verification/reject`

Rejects verification and records reason.

## 9.3 Employers

### `GET /employers`

Query params:

- `search`
- `type`
- `location`

### `POST /employers`

Required fields:

- `name`
- `type`
- `phone`

### `GET /employers/:id`

Returns employer with:

- requests
- placements
- notes summary

### `PATCH /employers/:id`

Updates employer fields.

## 9.4 Job Requests

### `GET /job-requests`

Query params:

- `status`
- `roleType`
- `location`
- `employerId`

### `POST /job-requests`

Required fields:

- `employerId`
- `roleType`
- `location`
- `workArrangement`
- `employmentType`

Recommended fields:

- `salaryMin`
- `salaryMax`
- `startDate`
- `requirements`
- `notes`

### `GET /job-requests/:id`

Returns request plus linked employer and current shortlist.

### `PATCH /job-requests/:id`

Updates request fields.

### `PATCH /job-requests/:id/status`

Updates job request status.

## 9.5 Matching

### `POST /job-requests/:id/match`

Runs rule-based matching and creates `Match` records.

### `GET /job-requests/:id/matches`

Returns ranked shortlist.

## 9.6 Placements

### `GET /placements`

Query params:

- `status`
- `workerId`
- `employerId`

### `POST /placements`

Required fields:

- `jobRequestId`
- `workerId`
- `employerId`
- `placementDate`

Optional:

- `guaranteeEndDate`
- `notes`

### `GET /placements/:id`

Returns placement detail.

### `PATCH /placements/:id`

Used for status updates and notes.

## 9.7 Dashboard

### `GET /dashboard/summary`

Returns:

- total workers
- available workers
- verified workers
- open job requests
- active placements
- recently created workers
- recently created requests

## 10. Business Rules

Phase 1 will enforce these minimum rules.

### Worker rules

- A worker cannot be marked `verified` unless required verification items are complete.
- A worker whose `availabilityStatus` is `placed` must not appear in available matching results.
- Worker profile creation should warn on duplicate phone, NIN, or BVN.

### Verification rules

- Verification approval must record reviewer and timestamp.
- Rejection must include a reason.
- A worker can remain in `incomplete` if documents or references are missing.

### Job request rules

- A request must always belong to one employer.
- A request cannot move to `placed` unless a placement exists.
- A cancelled request should not accept new matches unless reopened later.

### Placement rules

- Creating a placement should set the worker availability to `placed`.
- Creating a placement should update the job request status to `placed`.
- Ending a placement should allow worker availability to be updated again.

### Audit rules

- All create, update, approve, reject, deactivate, and placement actions should create audit log entries.

## 11. Verification Checklist

Phase 1 should support a checklist-style review UI.

Baseline verification items:

- worker identity record present
- NIN provided
- BVN provided if required by policy
- at least one valid ID document uploaded
- guarantor details captured
- at least one reference captured
- review notes recorded by staff when needed

Recommended behavior:

- checklist is configurable later
- for Phase 1, it can be implemented in code and surfaced as boolean completion indicators

## 12. Matching Logic

Phase 1 matching must be transparent and rule-based.

Suggested scoring:

- role match: `+40`
- verified worker: `+20`
- available worker: `+20`
- same location or nearby match: `+10`
- experience match: `+10`

Disqualifiers:

- worker unavailable
- worker currently placed
- worker verification status not acceptable based on request policy

Response should include:

- score
- reasons
- worker summary

This is intentionally simple and explainable.

## 13. Frontend App Structure

## 13.1 Public Website

Pages:

- Home
- About
- Services
- For Employers
- For Workers
- Contact
- Apply as Worker
- Request Staff
- Login

Purpose:

- explain what SkillBridge does
- create trust
- funnel worker applications and employer requests into the system

Phase 1 website forms may:

- create lead-style records directly if the backend is ready
- or send structured submissions into worker/employer intake queues

## 13.2 Internal App Routes

- `/app/dashboard`
- `/app/workers`
- `/app/workers/new`
- `/app/workers/:id`
- `/app/workers/:id/edit`
- `/app/verification`
- `/app/employers`
- `/app/employers/new`
- `/app/employers/:id`
- `/app/job-requests`
- `/app/job-requests/new`
- `/app/job-requests/:id`
- `/app/job-requests/:id/matches`
- `/app/placements`
- `/app/placements/:id`
- `/app/settings/users`

## 13.3 Screen Requirements

### Dashboard

Must show:

- open requests
- verified workers
- available workers
- active placements
- recent activity
- quick actions

### Workers List

Must support:

- fast search
- filter chips or side filters
- clear verification and availability badges
- add worker action

### Worker Detail

Must show:

- personal profile
- NIN and BVN fields
- roles and experience
- verification status
- documents
- guarantor
- references
- placement history
- audit-sensitive actions

### Verification Queue

Must allow staff to:

- review incomplete or pending workers
- inspect uploaded documents
- approve or reject verification
- see what is missing

### Employers List and Detail

Must show:

- employer profile
- open and historical requests
- placements
- notes

### Job Requests List

Must show:

- open and stalled requests
- status badges
- role and location
- assigned or linked employer

### Match Results

Must show:

- ranked workers
- match reasons
- verification status
- availability
- quick action to proceed to placement

### Placements

Must show:

- active placements
- guarantee end date
- worker and employer links
- status updates

## 14. Frontend UX Principles

- mobile-friendly but desktop-efficient
- high information density without clutter
- searchable first
- action-oriented layouts
- clear status colors and badges
- strong empty states
- founder-friendly visibility
- staff-friendly speed

This should not feel like a generic CRM. It should feel like an agency operations cockpit.

## 15. Backend Service Structure

Suggested Express structure:

- `src/app.ts`
- `src/server.ts`
- `src/config/`
- `src/middleware/auth.ts`
- `src/middleware/requireRole.ts`
- `src/routes/`
- `src/controllers/`
- `src/services/`
- `src/repositories/`
- `src/lib/prisma.ts`
- `src/lib/supabase.ts`
- `src/lib/cloudinary.ts`
- `src/utils/`
- `src/types/`

Suggested route modules:

- `auth.routes.ts`
- `users.routes.ts`
- `workers.routes.ts`
- `employers.routes.ts`
- `jobRequests.routes.ts`
- `matches.routes.ts`
- `placements.routes.ts`
- `dashboard.routes.ts`

## 16. Security and Data Handling

- Validate Supabase JWT on every authenticated API request.
- Do not expose sensitive worker fields unnecessarily in list endpoints.
- Store file URLs and Cloudinary public IDs, not raw file blobs in Postgres.
- Encrypt secrets via Netlify, Render, Supabase, and Cloudinary environment configs.
- Add rate limiting on auth-sensitive or upload-sensitive endpoints.
- Audit all sensitive changes.

## 17. Environment Variables

### Frontend

- `VITE_API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL`
- `VITE_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Backend

- `PORT`
- `DATABASE_URL`
- `DIRECT_URL`
- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FRONTEND_URL`

## 18. Delivery Backlog

## 18.1 Milestone A: Foundations

- project scaffolding
- Supabase setup
- Prisma schema
- role model
- auth integration
- layout shell
- audit log base support

## 18.2 Milestone B: Worker System

- worker CRUD
- worker roles
- worker documents
- guarantor and references
- duplicate warnings
- worker list and detail pages

## 18.3 Milestone C: Employer and Requests

- employer CRUD
- job request CRUD
- job request list and status flow

## 18.4 Milestone D: Verification and Matching

- verification queue
- verification actions
- matching service
- shortlist UI

## 18.5 Milestone E: Placements and Dashboard

- placement creation
- placement list and detail
- dashboard summary API
- dashboard UI

## 19. Definition of Done for Phase 1

Phase 1 is complete when:

- staff can log in with individual accounts
- workers can be created, searched, filtered, and verified
- employers can be created and viewed with history context
- job requests can be created and tracked without losing them
- staff can run matching and see a ranked shortlist
- a placement can be created from a request and worker
- the dashboard gives leadership live operational visibility
- the public website funnels workers and employers into the system
- the team can run real daily operations without using WhatsApp as the system of record

## 20. What Can Wait Until Later

These are intentionally deferred:

- WhatsApp automation
- payment tracking
- analytics beyond dashboard summaries
- employer self-service portal
- worker self-service portal
- advanced outcome-based matching
- ratings and training records

This keeps Phase 1 focused and shippable.
