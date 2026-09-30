# Deployment Checklist

## Before Uploading to cPanel or Pushing to GitHub

1. Run `npm test`.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Confirm generated development-only files are not committed: `node_modules`, local `.env` files, logs, browser profiles, screenshots, and `data/contact-submissions.json`.
5. Commit the source files, `package-lock.json`, and deployment docs.

## cPanel Deployment

Use the cPanel Node.js application manager.

- Startup file: `app.cjs`
- Install command: `npm install`
- Build command: `npm run build`
- Health check: `/api/health`

The Express server serves the built frontend from `dist`, so the app deploys as one full-stack Node service.

## GitHub Push

```bash
git init
git add .
git commit -m "Prepare TableCraft Solutions website for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Production Follow-Ups

- Replace local JSON contact storage with a hosted database, email delivery, or CRM integration.
- Add a real domain and SSL through cPanel.
- Configure monitoring/logging for contact submission failures.
- Run `npm audit` and decide whether dependency updates are appropriate.
