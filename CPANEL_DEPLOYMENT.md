# cPanel Deployment Guide for TableCraft Solutions

This project is a dynamic full-stack Node.js site. Deploy it as a cPanel Node.js application, not as a static-only `public_html` upload.

## What to Upload

Upload the contents of the generated cPanel package or upload the project folder with these important items included:

- `app.cjs`
- `backend/`
- `data/`
- `dist/`
- `public/`
- `package.json`
- `package-lock.json`
- `README.md`

Do not upload `node_modules`; cPanel should install dependencies.

## cPanel Node.js App Settings

In cPanel, open **Setup Node.js App** and use:

- Node.js version: `20.x` or newer
- Application mode: `Production`
- Application root: your uploaded TableCraft folder
- Application URL: your domain or subdomain
- Application startup file: `app.cjs`

Add environment variables:

```text
NODE_ENV=production
```

Do not add `PORT` manually unless your host specifically asks for it. cPanel normally injects the correct port.

## Install and Start

From the cPanel Node.js interface or terminal:

```bash
npm install
npm run build
```

Then restart the Node.js app in cPanel.

## Health Check

After deployment, visit:

```text
https://your-domain.com/api/health
```

Expected response:

```json
{"ok":true,"service":"tablecraft-api"}
```

## Frontend Routes

The Express server serves the built React frontend from `dist`, so these routes should work directly:

- `/`
- `/about`
- `/services`
- `/case-studies`
- `/insights`
- `/contact`
- `/dashboard`

## Contact Submissions

Contact submissions are currently stored in:

```text
data/contact-submissions.json
```

For production business use, connect this to email delivery, a CRM, or a database so leads are not dependent on a local JSON file.

## Troubleshooting

If the frontend loads but API calls fail, confirm cPanel is running the Node app and not serving only static files.

If `/api/health` fails, check:

- `app.cjs` is the startup file
- `npm install` completed
- Node.js version is 20+
- cPanel app was restarted after upload
- `dist/index.html` exists after running `npm run build`
