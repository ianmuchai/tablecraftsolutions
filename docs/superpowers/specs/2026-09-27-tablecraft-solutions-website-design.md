# Table Craft Solutions Website Design

## Purpose

Build a polished, modern, multipage and multilayered website for Table Craft Solutions, a restaurant consultancy. The site should present the brand as credible, practical, and premium while giving restaurant owners a clear path from discovery to inquiry.

The logo is used only as brand reference. Its visual cues are deep teal, white, warm amber, bold typography, and a food-service identity.

## Audience

Primary users are restaurant owners, managers, and hospitality entrepreneurs who need help opening, improving, or scaling a food business. The site should feel professional enough for established operators and approachable enough for first-time founders.

## Site Structure

The frontend will be a React/Vite single-page app with client-side routing so it behaves like a multipage website.

Pages:

- Home: brand statement, core value proposition, services preview, process overview, metrics, testimonials, and calls to action.
- About: company positioning, operating philosophy, values, and consultant profile content.
- Services: overview of all consultancy services.
- Service Detail: deeper pages for individual services such as restaurant launch, menu engineering, operations audits, staff training, branding, and cost control.
- Case Studies: result-focused examples that show measurable improvements.
- Insights: article listing powered by backend content data.
- Insight Detail: full article pages.
- Contact: inquiry form with backend submission.
- Not Found: branded fallback route.

## Layers

Frontend layers:

- App shell: navigation, footer, route layout, responsive page transitions.
- Page layer: route-level compositions.
- Section layer: reusable hero, service grids, process bands, testimonials, metrics, and contact sections.
- Component layer: buttons, cards, forms, badges, icons, and status messages.
- Data access layer: API client for backend content and contact submission.

Backend layers:

- Express server entry point.
- Route modules for services, case studies, insights, testimonials, and contact submissions.
- Controller handlers for request/response behavior.
- Validation helpers for contact form payloads.
- Local data store files for initial content and captured inquiries.

## Backend API

Initial endpoints:

- `GET /api/health`
- `GET /api/services`
- `GET /api/services/:slug`
- `GET /api/case-studies`
- `GET /api/insights`
- `GET /api/insights/:slug`
- `GET /api/testimonials`
- `POST /api/contact`

Contact submissions will validate required fields and persist locally to a JSON file during development.

## Visual Direction

Use a restaurant-consultancy look rather than a generic SaaS landing page. The interface should use:

- Deep teal as the dominant brand color.
- Warm amber/gold as the accent.
- White and soft neutral backgrounds for readability.
- Strong editorial photography or photo-like background treatment related to restaurant operations, kitchens, dining rooms, teams, menus, and service.
- Clean typography with confident headings and compact, readable body text.
- Responsive layouts that remain polished on mobile.

The first viewport must make Table Craft Solutions obvious, with brand name and restaurant consultancy positioning visible immediately.

## UX Requirements

- Navigation exposes the main pages and highlights services.
- Service pages give enough detail to support buying intent.
- Calls to action appear at key decision points without feeling noisy.
- Contact form provides inline success and error states.
- Content loads from backend APIs where appropriate.
- Mobile navigation is clear, compact, and touch-friendly.
- Text and buttons must not overflow on small screens.

## Technical Choices

- Frontend: React, TypeScript, Vite, React Router, lucide-react icons.
- Backend: Node.js, Express, TypeScript.
- Styling: plain CSS with custom properties and responsive layout rules.
- Development: concurrently run frontend and backend.

## Verification

Before completion:

- Install dependencies if needed.
- Run typecheck or build.
- Start backend and frontend locally.
- Check health endpoint.
- Verify the app loads in browser at desktop and mobile widths.
- Submit the contact form through the UI or API.

## Out of Scope For First Build

- Real CMS integration.
- Authentication.
- Payment flows.
- Production email delivery.
- Database hosting.

The implementation should leave clean extension points for those later.
