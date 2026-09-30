# TableCraft Solutions

Full-stack website for TableCraft Solutions, a restaurant consultancy.

## Stack

- React + TypeScript + Vite frontend
- Node.js + Express backend
- Dynamic JSON APIs for services, insights, case studies, testimonials, contact submissions, and dashboard summaries

## Local Development

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend health: `http://localhost:4000/api/health`

Dynamic dashboard: `http://localhost:5173/dashboard`

## Production Build

```bash
npm run build
npm start
```

`npm run build` creates the frontend bundle in `dist`. In production, the Express server serves the built frontend and keeps API routes under `/api`.

## Vercel Deployment

This repository is ready for Vercel Git deployment.

Recommended Vercel settings:

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js version: 20 or newer

The `api/[...path].ts` file provides Vercel serverless API routes for `/api/services`, `/api/insights`, `/api/contact`, `/api/dashboard`, and related dynamic endpoints. The `vercel.json` file keeps frontend page refreshes working through the Vite single-page app fallback.

After importing this GitHub repository into Vercel, attach your domain in the Vercel project domain settings and point the domain DNS records to Vercel as instructed there.

## cPanel Deployment Summary

Use a Node.js app in cPanel. Upload the project files, run `npm install`, ensure `dist` exists, and set the startup file to `app.cjs`.

Recommended cPanel settings:

- Application root: the uploaded TableCraft project folder
- Application URL: your domain or subdomain
- Application startup file: `app.cjs`
- Node.js version: 20 or newer
- Environment variable: `NODE_ENV=production`
- cPanel provides `PORT`; do not hard-code a port in production

For detailed steps, see `CPANEL_DEPLOYMENT.md`.


## Dashboard Login

The dashboard supports two profile types:

- Admin: set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `AUTH_SECRET` in Vercel project environment variables. Use `Farhan` for `ADMIN_USERNAME` and set the password value only in Vercel, not in GitHub.
- User: users can create their own consultation profile from the Dashboard tab. Current user profiles are saved privately in the browser until a database is connected.
## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm test
npm start
```
