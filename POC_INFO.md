# Diamond Pigs Signals Dashboard POC

## Test URL
[insert deployed URL after first deploy]

## Tech Stack
- Next.js 15 (App Router) with `output: "export"` for static hosting
- TypeScript
- Tailwind CSS (design tokens mirroring the Figma color & typography scale)
- Recharts (sparkline + detail charts)
- Lucide React (icons)
- Inter Tight (loaded via `next/font/google`)

## Data Source
- `public/data/indicators.json` — primary time-series payload (12 signals × 365 days each).
- `public/data/all_signals.json` — metadata-only mirror (no `values` array) for quick listings.

The dashboard fetches `/data/indicators.json` on mount, caches the timestamp in
`localStorage` under `dp.lastFetchedAt`, refetches automatically once 24h have
passed, and exposes a manual **Refresh data** button.

## Local Development
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produces a static export in ./out
```

## Deployment Notes
- Any static-friendly host works: **Vercel**, **Netlify**, or **GitHub Pages**.
- Because the app uses `output: "export"`, after `npm run build` the deployable
  artefact lives in `./out`. Push that folder to any static host.
- If the site is hosted under a sub-path (e.g. GitHub Pages),
  set `NEXT_PUBLIC_BASE_PATH=/your-sub-path` and configure
  `basePath` in `next.config.mjs` to match.

## How to Update Data
1. Run the backend export pipeline (e.g. `python indicators_export.py`).
2. Replace `public/data/indicators.json` with the freshly generated file.
3. Either redeploy or, if the host serves the bucket directly, upload the new file.
4. End users see the new values on next page load or after pressing **Refresh**.

To regenerate the demo dataset for the POC, run:

```bash
node scripts/generate-indicators.mjs
```

## Out of Scope (Phase 1)
- No backend, authentication, or persistence.
- No live API calls. All filtering, sorting, and search run client-side.
- Interpretation copy is consumed verbatim from `indicators.json`.
