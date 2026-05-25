# Frontend deployment notes

Prerequisites:
- Node.js (or Bun) and package manager installed. The project uses Vite; the repo's Vercel config uses `bun`.
- Ensure `VITE_API_URL` is set in your environment (see `.env.example`).

Local build and preview:

```bash
# Install deps
npm install
# or with bun
bun install

# Build
npm run build
# or
bun run build

# Preview the production build
npm run preview
```

Vercel:
- The repository includes `vercel.json` configured to run `bun run build` and to serve `dist/client`.
- In the Vercel project settings add `VITE_API_URL=https://progloss-adminpage-xg48.onrender.com`.
- Push to a branch connected to Vercel; Vercel will run the configured build command.

Frontend deployment checklist:

1. Import the repo into Vercel.
2. Use the repository root as the project root.
3. Set `VITE_API_URL=https://progloss-adminpage-xg48.onrender.com`.
4. Deploy and then open the generated frontend URL.
5. If auth or API calls fail, confirm the backend Render URL is still active and the CORS origin is allowed.

Cloudflare Workers (via Wrangler):
- This repo includes `wrangler.jsonc` and a Cloudflare build plugin in `vite.config.ts`.
- Build the project locally (`bun run build`), then run `wrangler publish` to deploy the worker.
- Store any secrets or environment values with `wrangler secret put <NAME>` or via Cloudflare dashboard.

Next steps / checks:
- Run `npm run build` locally to verify the build completes.
- Confirm the app reads `import.meta.env.VITE_API_URL` at runtime; set it in your hosting provider.
# Deploying Progloss Super Admin

## Vercel (recommended)

A `vercel.json` is included.

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Framework Preset: **Other**. Build is already pinned in `vercel.json`:
   - Install: `bun install`
   - Build: `bun run build`
   - Output: `dist/client`
4. Deploy. SPA fallback is configured via `rewrites`, so deep links and
   page refreshes (e.g. `/billing/invoices/INV-2026-04812`) work.

> If you prefer Node/SSR on Vercel instead of static + client routing,
> swap the TanStack Start preset from `cloudflare` to `vercel` in
> `vite.config.ts` and remove `wrangler.jsonc`. The current setup ships
> the app as a fast static admin with client-side React Router-style
> navigation handled by TanStack Router.

## Cloudflare Workers

`wrangler.jsonc` is wired. `bun run deploy` (or `wrangler deploy`) ships
the SSR worker.
