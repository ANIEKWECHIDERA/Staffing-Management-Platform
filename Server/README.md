# SkillBridge OS Server

## Purpose

This is the backend service for SkillBridge OS Phase 1.

It provides:

- authentication-aware API routes
- Supabase-backed staff account provisioning and deactivation
- worker, employer, request, match, placement, and dashboard APIs
- Cloudinary upload signature, verification, and deletion endpoints
- Prisma schema for Supabase Postgres
- Cloudinary-ready file metadata flow

## Stack

- Node.js
- Express
- TypeScript
- Prisma
- Supabase Postgres
- Supabase Auth
- Cloudinary

## Important Project Rule

Generated `dist` files should be cleared after build/test verification.

## Setup

1. Copy environment values into `.env`
2. Set real Supabase and Cloudinary credentials
3. Set real seed values for owner and optional staff records
4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Validate schema:

```bash
npm run prisma:validate
```

6. Run the migration against the target database:

```bash
npm run prisma:migrate
```

Connection note:

- `DATABASE_URL` is used by the running Express app through Prisma's Postgres adapter.
- `DIRECT_URL` is preferred for Prisma migration commands through `prisma.config.ts`.
- If your environment cannot reach the direct host because of IPv6 limitations, use the session pooler for `DIRECT_URL` too.

7. Seed the app user records:

```bash
npm run prisma:seed
```

8. Start the dev server:

```bash
npm run dev
```

## Notes on Seeding

The seed script creates or updates app-side user records in the `User` table.

Because SkillBridge OS uses Supabase Auth, seeded users must correspond to real Supabase Auth users. Supply their real Supabase user IDs through:

- `SEED_OWNER_SUPABASE_USER_ID`
- `SEED_STAFF_SUPABASE_USER_ID`

## Upload Endpoints

These endpoints form the reusable upload engine for the platform:

- `POST /api/v1/uploads/signature`
- `POST /api/v1/uploads/verify`
- `DELETE /api/v1/uploads/asset`

Recommended flow:

1. Frontend requests a signed upload payload from `/uploads/signature`
2. Frontend uploads directly to Cloudinary
3. Frontend sends Cloudinary response data to `/uploads/verify`
4. Frontend then links the resulting asset to a domain record such as `WorkerDocument`

This keeps file handling modular and reusable across Worker, Verification, and future self-service modules.

## Authentication Model

SkillBridge OS uses Supabase Auth for identity and the app database for operational roles.

Current pattern:

1. Frontend authenticates with Supabase Auth
2. Frontend sends the access token to the Express API
3. The API verifies the JWT
4. The API resolves the matching app user from the `User` table
5. The API authorizes actions based on the app role

Useful auth routes:

- `POST /api/v1/auth/sync-user`
- `GET /api/v1/auth/me`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/:id/deactivate`

`POST /api/v1/users` now provisions staff accounts through Supabase Auth and mirrors them into the app database.

## Tests

Run the API suite with:

```bash
npm test
```

Current test coverage includes a route-level pass across the Phase 1 endpoint surface using mocked infrastructure dependencies.

## Cloudinary Folder Structure

Uploads are organized under the Cloudinary root folder:

- `Skillbridge OS`

Current structure:

- `Skillbridge OS/workers/:workerId/profile`
- `Skillbridge OS/workers/:workerId/documents`
- `Skillbridge OS/employers/:employerId/attachments`
- `Skillbridge OS/staff/:staffId/credentials`

This keeps the upload engine aligned with the LEGO mindset by making media storage predictable and reusable across modules.
## Migration Artifact

The initial SQL migration is stored at:

- `prisma/migrations/0001_init/migration.sql`
