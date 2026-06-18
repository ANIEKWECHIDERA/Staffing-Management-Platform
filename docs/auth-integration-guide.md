# SkillBridge OS Auth Integration Guide

This guide describes how authentication should work between the frontend and backend for Phase 1.

## Core Model

SkillBridge OS uses:

- `Supabase Auth` for identity, session handling, password recovery, and invite links
- the local `User` table for operational roles and app access

This means a person must satisfy both:

1. have a valid Supabase session
2. exist as an active user in the SkillBridge OS `User` table

## Frontend Stack Expectation

The frontend should use the Supabase client directly for:

- sign in
- sign out
- session refresh
- forgot password
- password update after recovery
- invite acceptance session handling

The backend should be called with the Supabase access token after authentication succeeds.

## Recommended Frontend Routes

- `/login`
- `/forgot-password`
- `/auth/reset-password`
- `/auth/accept-invite`
- protected internal app routes under `/app/*`

## Login Flow

1. User signs in with Supabase on the frontend using email and password.
2. Frontend receives the session from Supabase.
3. Frontend sends the access token to `POST /api/v1/auth/sync-user`.
4. Frontend calls `GET /api/v1/auth/me`.
5. If the backend returns an active app user, the user enters the internal app.

## Session Bootstrap Flow

On app load:

1. call `supabase.auth.getSession()`
2. if no session exists, send the user to `/login`
3. if a session exists, call `GET /api/v1/auth/me` with the bearer token
4. if the backend returns `403`, the user is authenticated in Supabase but not active in SkillBridge OS
5. if the backend returns `200`, hydrate the app shell with the returned user

## Token Refresh Flow

The frontend owns session refresh.

Use `supabase.auth.onAuthStateChange` to handle:

- `INITIAL_SESSION`
- `SIGNED_IN`
- `SIGNED_OUT`
- `TOKEN_REFRESHED`
- `PASSWORD_RECOVERY`
- `USER_UPDATED`

When `TOKEN_REFRESHED` fires, continue sending the latest access token to the backend.

## Forgot Password Flow

### Request reset

Option A:

- call backend `POST /api/v1/auth/forgot-password` with `{ email }`

Option B:

- call `supabase.auth.resetPasswordForEmail(email, { redirectTo })` directly from the frontend

For this project, Option A is now available on the backend and uses a fixed redirect target:

- `${FRONTEND_URL}/auth/reset-password`

### Complete reset

1. user clicks the email link
2. Supabase redirects them to `/auth/reset-password`
3. frontend listens for `PASSWORD_RECOVERY`
4. frontend shows a new-password form
5. frontend calls `supabase.auth.updateUser({ password: newPassword })`
6. after success, frontend can send the user to `/login` or straight into the app

## Invite Acceptance Flow

Owner-created staff invites should redirect to:

- `${FRONTEND_URL}/auth/accept-invite`

Frontend behavior:

1. user clicks the invite link from email
2. Supabase creates the recovery-style session in the browser
3. frontend loads `/auth/accept-invite`
4. frontend prompts the invited user to set a password if needed
5. frontend calls `supabase.auth.updateUser({ password })`
6. frontend calls `POST /api/v1/auth/sync-user`
7. frontend calls `GET /api/v1/auth/me`
8. user enters the app

## Backend Endpoints Related To Auth

Public:

- `POST /api/v1/auth/forgot-password`

Authenticated:

- `POST /api/v1/auth/sync-user`
- `GET /api/v1/auth/me`

Owner-only staff management:

- `POST /api/v1/users`
- `POST /api/v1/users/:id/resend-invite`
- `PATCH /api/v1/users/:id/deactivate`

## Error Handling Expectations

Frontend should handle:

- `401`: missing or invalid token
- `403`: authenticated but not active in SkillBridge OS
- `429`: rate-limited request
- `400`: validation or auth flow issue

## Security Notes

- never expose the Supabase service role key in the frontend
- never use editable `user_metadata` for authorization decisions
- rely on backend `User.role` and protected backend routes for operational permissions
- use the local app user returned by `GET /api/v1/auth/me` as the trusted role source in the UI
