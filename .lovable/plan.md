
## Goal
Ensure every signup/login (email or Google) results in exactly one `profiles` row keyed by `auth.uid()`, sessions persist, and profile data loads + saves reliably.

## Root cause
The `public.handle_new_user()` function exists but **no trigger is attached to `auth.users`**, so no profile row is ever created. Session persistence and Google OAuth flow are already correct.

## Changes

### 1. Database migration
- Rewrite `public.handle_new_user()` to be idempotent and OAuth-aware: pull `display_name` from `raw_user_meta_data` (`display_name` → `full_name` → `name` → email local-part) and `avatar_url` from (`avatar_url` → `picture`). Use `INSERT ... ON CONFLICT (id) DO UPDATE` so it never creates duplicates and refreshes metadata on re-auth.
- Create `on_auth_user_created` trigger (`AFTER INSERT ON auth.users`).
- Create `on_auth_user_updated` trigger (`AFTER UPDATE OF raw_user_meta_data ON auth.users`) so OAuth metadata updates flow through.
- Backfill missing rows for users that signed up before the trigger existed.

### 2. `src/lib/auth.tsx` — client safety net
- In the `onAuthStateChange` listener, on `SIGNED_IN` / `TOKEN_REFRESHED` / `USER_UPDATED` events, schedule (via `setTimeout(0)` to avoid the Supabase deadlock pattern) an upsert into `profiles` keyed on `id`, derived from `user.user_metadata`. Errors are `console.error`'d, not toasted.

### 3. `src/routes/_app.profile.tsx`
- Fetch the actual `profiles` row with `.maybeSingle()` on mount and seed `display_name` / `avatar_url` from it.
- On avatar/name save, also `UPDATE` the `profiles` row (`display_name`, `avatar_url`); show a toast on error.

### 4. `src/routes/login.tsx`
- Add `console.error` for auth failures (keeps current toast UX, helps debugging). No flow changes.

## Verification
- Run a fresh email signup → `SELECT * FROM profiles WHERE id = <new uid>` returns one row.
- Refresh page → still signed in, profile name/avatar render.
- Sign in with Google → profile row exists with Google display name + picture.
- Sign out and back in → still exactly one row (no duplicates).

## Files
- New SQL migration (function rewrite + 2 triggers + backfill)
- Edited: `src/lib/auth.tsx`, `src/routes/_app.profile.tsx`, `src/routes/login.tsx`
