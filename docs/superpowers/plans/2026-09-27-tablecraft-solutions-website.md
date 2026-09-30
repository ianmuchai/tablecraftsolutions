# Table Craft Solutions Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, modern, multipage and multilayered full-stack website for Table Craft Solutions, a restaurant consultancy.

**Architecture:** A React/Vite frontend uses client-side routes for multipage behavior and calls an Express backend for services, case studies, insights, testimonials, and contact form submission. The app is split into page, section, component, and API layers on the frontend, with route, controller, validation, and local data-store layers on the backend.

**Tech Stack:** React, TypeScript, Vite, React Router, lucide-react, Node.js, Express, TypeScript, plain CSS.

**Spec:** `docs/superpowers/specs/2026-09-27-tablecraft-solutions-website-design.md`

## Global Constraints

- The logo is used only as brand reference.
- Use deep teal, white, and warm amber/gold as the brand color foundation.
- Build Home, About, Services, Service Detail, Case Studies, Insights, Insight Detail, Contact, and Not Found pages.
- Backend endpoints must include health, services, service detail, case studies, insights, insight detail, testimonials, and contact.
- Contact submissions must validate required fields and persist locally to JSON during development.
- The first viewport must make Table Craft Solutions and restaurant consultancy positioning visible immediately.
- Mobile navigation must be clear, compact, and touch-friendly.
- Text and buttons must not overflow on small screens.

## Review Focus

- Empty or malformed contact input should return useful validation errors and should not create a submission.
- Unknown service and insight slugs should produce a clear 404 response and a branded frontend fallback.
- Backend API downtime should not make core pages blank; frontend should show graceful fallback content.
- Mobile navigation should open, close, and not trap or overlap page content.
- Long service names, article titles, and button text should wrap cleanly on small screens.

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `backend/tsconfig.json`

**Interfaces:**
- Produces: npm scripts `dev`, `dev:frontend`, `dev:backend`, `build`, `typecheck`, `start`.
- Produces: frontend dev server on port `5173` and backend API on port `4000`.

- [ ] **Step 1: Create package and TypeScript configuration**

Define scripts, dependencies, and compiler options for React/Vite and Express/TypeScript.

- [ ] **Step 2: Add Vite entry HTML and config**

Use React plugin and proxy `/api` requests to `http://localhost:4000`.

- [ ] **Step 3: Run install**

Run: `npm install`
Expected: dependencies install without errors.

- [ ] **Step 4: Verify TypeScript config loads**

Run: `npm run typecheck`
Expected: initial failures only because source files are not yet present, or success after later tasks.

### Task 2: Backend Data And API

**Files:**
- Create: `backend/server.ts`
- Create: `backend/data/content.ts`
- Create: `backend/lib/contactStore.ts`
- Create: `backend/lib/validation.ts`
- Create: `data/contact-submissions.json`

**Interfaces:**
- Produces: `ContactPayload` type with `name`, `email`, `phone`, `company`, `service`, `message`.
- Produces: `validateContactPayload(payload: unknown): { valid: true; value: ContactPayload } | { valid: false; errors: string[] }`.
- Produces: Express endpoints listed in the spec.

- [ ] **Step 1: Add backend content data**

Create services, case studies, insights, and testimonials arrays with stable `slug` fields.

- [ ] **Step 2: Add contact validation**

Require `name`, valid `email`, `service`, and `message`; allow optional `phone` and `company`.

- [ ] **Step 3: Add local JSON persistence**

Append valid contact submissions to `data/contact-submissions.json` with `id` and `createdAt`.

- [ ] **Step 4: Implement Express routes**

Return JSON for all content endpoints, 404 for unknown slugs, and validation errors for bad contact requests.

- [ ] **Step 5: Verify API**

Run backend and check `GET /api/health`, `GET /api/services`, and valid/invalid `POST /api/contact`.

### Task 3: Frontend App Shell And API Client

**Files:**
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/api/client.ts`
- Create: `src/types.ts`
- Create: `src/components/Layout.tsx`
- Create: `src/components/LogoMark.tsx`
- Create: `src/components/ScrollToTop.tsx`

**Interfaces:**
- Consumes: backend API response shapes from Task 2.
- Produces: route shell with navigation and footer.
- Produces: API functions `getServices`, `getService`, `getCaseStudies`, `getInsights`, `getInsight`, `getTestimonials`, `submitContact`.

- [ ] **Step 1: Add shared frontend types**

Mirror the public fields used by backend content data.

- [ ] **Step 2: Add API client**

Fetch from `/api/*`, throw typed errors with status where possible, and provide fallback-friendly behavior.

- [ ] **Step 3: Add layout, navigation, footer, and logo**

Use responsive desktop/mobile navigation and brand colors from the logo.

- [ ] **Step 4: Add router**

Define routes for all pages required by the spec.

### Task 4: Pages And Reusable Sections

**Files:**
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/AboutPage.tsx`
- Create: `src/pages/ServicesPage.tsx`
- Create: `src/pages/ServiceDetailPage.tsx`
- Create: `src/pages/CaseStudiesPage.tsx`
- Create: `src/pages/InsightsPage.tsx`
- Create: `src/pages/InsightDetailPage.tsx`
- Create: `src/pages/ContactPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/components/sections.tsx`

**Interfaces:**
- Consumes: API client functions from Task 3.
- Produces: multipage, multilayered frontend experience.

- [ ] **Step 1: Build home page sections**

Include hero, services preview, process, metrics, testimonials, and CTA.

- [ ] **Step 2: Build about, services, and service detail pages**

Services overview links to detail pages; unknown slugs show the branded not-found route.

- [ ] **Step 3: Build case studies and insights pages**

Load list/detail data from backend APIs and show graceful fallbacks.

- [ ] **Step 4: Build contact page**

Submit to backend, show pending, success, and validation error states.

### Task 5: Visual System And Verification

**Files:**
- Create: `src/styles.css`
- Modify: route/page files from Tasks 3 and 4 as needed for class names.

**Interfaces:**
- Consumes: components and pages from earlier tasks.
- Produces: responsive, polished UI matching the approved visual direction.

- [ ] **Step 1: Implement CSS design system**

Define deep teal, amber, white, neutrals, typography, spacing, grids, buttons, forms, and mobile rules.

- [ ] **Step 2: Run build and typecheck**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run typecheck`
Expected: typecheck succeeds.

- [ ] **Step 3: Start dev servers**

Run: `npm run dev`
Expected: frontend available at `http://localhost:5173` and backend at `http://localhost:4000`.

- [ ] **Step 4: Verify backend health and contact submission**

Check `http://localhost:4000/api/health` and a valid `POST /api/contact`.

- [ ] **Step 5: Browser-check the frontend**

Confirm pages load, mobile navigation works, and the first viewport clearly presents Table Craft Solutions as a restaurant consultancy.
