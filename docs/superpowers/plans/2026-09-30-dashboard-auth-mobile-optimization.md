# Dashboard Auth and Mobile Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site more professional on mobile and add dashboard login flows for admin and user profiles.

**Architecture:** The public site remains a Vite React app. Admin login uses Vercel-compatible `/api/auth/*` routes with an HTTP-only signed cookie. User profiles are self-created in browser storage until a real database is added.

**Tech Stack:** React 19, Vite, TypeScript, Express local backend, Vercel serverless API routes, Vitest.

**Spec:** User request on 2026-09-30: optimize mobile site, remove vibecoded aspects, add dashboard logins for admin and user profiles.

## Global Constraints

- Do not commit Farhan's password to GitHub; use `ADMIN_PASSWORD` in Vercel environment variables.
- Admin username is `Farhan` via `ADMIN_USERNAME` default/config.
- Dashboard must support admin and user profiles.
- Keep Vercel deployment working with `npm run build` and `vercel.json`.
- Preserve public restaurant consultancy content and brand assets.

## Review Focus

- Missing `ADMIN_PASSWORD` should show a clear setup error, not silently allow admin login.
- User self-profile is local-only and must be labeled accordingly.
- Mobile nav and dashboard controls must be usable at 320px width.
- Public pages must remain readable if API routes fail.
- No password should appear in committed source.

---

### Task 1: Admin Auth API

**Files:**
- Modify: `api/[...path].ts`
- Modify: `tests/vercel.api.test.ts`

**Interfaces:**
- Produces `/api/auth/login`, `/api/auth/session`, `/api/auth/logout`.
- Produces session payload `{ authenticated: boolean; role?: "admin"; name?: string }`.

- [ ] Add failing tests for missing admin password setup, rejected login, accepted login when env is provided, session cookie, logout cookie clear.
- [ ] Implement signed cookie helpers in `api/[...path].ts` using `node:crypto`.
- [ ] Verify focused API tests pass.

### Task 2: Dashboard Login UI and Profiles

**Files:**
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/api/client.ts`
- Modify: `src/types.ts`
- Create: `src/content/dashboardUsers.ts`
- Test: `tests/frontend.client.test.ts`

**Interfaces:**
- Consumes auth endpoints from Task 1.
- Produces admin login form, user self-profile form, admin dashboard, user dashboard.

- [ ] Add failing client tests for auth request helpers and local profile defaults.
- [ ] Implement auth client helpers and dashboard user profile content.
- [ ] Replace dashboard page with tabbed admin/user login and role-specific views.
- [ ] Verify focused frontend tests pass.

### Task 3: Mobile and Professional UI Cleanup

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/Layout.tsx` if needed

**Interfaces:**
- Produces cleaner mobile layout and dashboard auth styles.

- [ ] Add/adjust CSS for compact mobile typography, cleaner nav, dashboard auth panels, role profiles, touch-friendly buttons.
- [ ] Add final CSS overrides that neutralize noisy repeated hero/mobile rules without breaking imagery.
- [ ] Verify `npm test`, `npm run typecheck`, and `npm run build` pass.
