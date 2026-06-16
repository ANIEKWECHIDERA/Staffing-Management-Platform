# SkillBridge OS Server

## Purpose

This is the backend service for SkillBridge OS Phase 1.

It provides:

- authentication-aware API routes
- worker, employer, request, match, placement, and dashboard APIs
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

## Migration Artifact

The initial SQL migration is stored at:

- `prisma/migrations/0001_init/migration.sql`
