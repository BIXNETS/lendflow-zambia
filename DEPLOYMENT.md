# Deploying to Vercel

This app is a TanStack Start (SSR) application. The production build outputs a client bundle under `dist/client` and a server-side handler under `dist/server/server.js`. Vercel serves static assets from `dist/client` and routes every other request to a serverless function at `api/index.ts` that runs the SSR/ server-function handler.

## Quick deploy (one click)

1. Sync this project to GitHub from the Lovable editor: **Plus (+) menu → GitHub → Connect project**.
2. Replace `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` in the README deploy button with your actual repository path.
3. Click the **Deploy with Vercel** button in README.md and fill in the environment variables when prompted.

## Manual import

In Vercel: **Add New → Project → Import** this repository. Set the framework preset to **Other** (Vercel will read `vercel.json`).

- Build command: `npm run build:vercel` (set by `vercel.json`)
- Static output: `dist/client`
- Server handler: `api/index.ts`
- Install command: `npm install`

## Environment variables

Add these in **Project → Settings → Environment Variables** for Production, Preview and Development. Separate Preview and Production values as needed.

Client (must keep the `VITE_` prefix):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Server-only:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MOMO_WEBHOOK_SECRET`

Copy the values from the project's backend settings. Never expose the service role key or the webhook secret to the client.

## Webhook / callback URLs

After the first deploy, point the mobile-money provider at:

```
https://<your-vercel-domain>/api/public/momo/webhook
```

The handler verifies the HMAC signature with `MOMO_WEBHOOK_SECRET`, so the same secret must be configured on both sides.

## Auth redirect URLs

Add the Vercel production and preview domains to the backend Auth settings (Site URL + Redirect URLs) so email confirmation and OAuth return correctly.

## Local verification

```bash
npm run build:vercel   # builds the Vercel target output into dist/
```

To preview the production build locally, run the Vercel CLI (`vercel dev`) or use the standard dev server:

```bash
npm run dev
```
