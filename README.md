# Diamond Pigs Signals Dashboard

A frontend-only proof of concept for the Diamond Pigs market signals dashboard. The app renders a polished, Figma-aligned UI from a static JSON dataset — no backend or live API required.

## Features

- **Overview dashboard** (`/`) — market sentiment summary and curated signal cards with charts and gauges
- **Signals explorer** (`/signals`) — search, filter, sort, and open a detail panel for any signal
- **Settings** (`/settings`) — data source info, last fetch time, and manual refresh
- **Sentiment theming** — positive, neutral, and negative modes driven by loaded signal data
- **Responsive layout** — desktop sidebar, collapsible navigation, mobile drawer
- **Accessibility** — keyboard navigation, focus states, and chart fallbacks

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + design tokens |
| Charts | Recharts |
| Icons | Lucide React |
| Font | Inter Tight (`next/font/google`) |
| Hosting | Static export (`output: "export"`) |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build a static export to `./out` |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Data

All signal data comes from static JSON files in `public/data/`:

| File | Purpose |
| --- | --- |
| `indicators.json` | Primary dataset — signal metadata and time-series `values` |
| `all_signals.json` | Metadata-only mirror (no `values` array) |

The app fetches `/data/indicators.json` on load, stores `lastFetchedAt` in `localStorage`, refetches after 24 hours, and supports a manual **Refresh data** action from the UI.

### Signal shape

Each entry in `indicators.json` follows this structure:

```json
{
  "id": "btc_fear_greed",
  "name": "Crypto Fear & Greed Index",
  "category": "sentiment",
  "description": "Market sentiment from 0 extreme fear to 100 extreme greed.",
  "source": "Alternative.me",
  "unit": "index",
  "min_val": 0,
  "max_val": 100,
  "status": "healthy",
  "sentiment": "positive",
  "interpretation": "The current reading suggests improving risk appetite.",
  "values": [
    { "timestamp": "2026-05-18", "value": 45 },
    { "timestamp": "2026-05-19", "value": 52 }
  ]
}
```

Interpretation text is consumed as-is from the JSON — the frontend does not generate it.

### Updating data

1. Replace `public/data/indicators.json` with the new export from your backend pipeline.
2. Redeploy, or upload the file to your static host.
3. Users see updated values on the next page load or after pressing **Refresh data**.

## Routes

| Route | Description |
| --- | --- |
| `/` | Market sentiment overview with featured signal cards |
| `/signals` | Full signal list with filters and detail panel |
| `/settings` | POC settings, refresh controls, and deployment notes |

## Project structure

```
src/
  app/                    App Router pages and layout
  assets/css/             Global styles and sentiment CSS variables
  components/
    layout/               AppShell, Sidebar, TopBar, MobileNav
    dashboard/            Signal cards, summary, badges, states
    charts/               Line charts, gauges, sparklines
    filters/              Search and filter bar
    ui/                   Button, Badge, Input, Card, etc.
  lib/
    data.tsx              Fetch, cache, and refresh logic
    types.ts              Domain types
    format.ts             Value and date formatters
    sentiment.ts          Filtering, sorting, sentiment helpers
    theme.ts              Shared chart and gauge color tokens
    netflow.ts            Netflow weekly chart helpers
public/
  data/                   Static JSON datasets
```

## Deployment

The app is configured for static export. After building:

```bash
npm run build
```

Deploy the contents of `./out` to Vercel, Netlify, GitHub Pages, or any static host.

For sub-path hosting (e.g. GitHub Pages), set `basePath` in `next.config.mjs` and `NEXT_PUBLIC_BASE_PATH` to match your path.

See [`POC_INFO.md`](./POC_INFO.md) for delivery checklist and hosting notes.

## Design system

Colors, typography, and spacing follow the Diamond Pigs design tokens defined in `tailwind.config.ts` and `src/assets/css/globals.css`. Chart and gauge components pull shared values from `src/lib/theme.ts` so SVG and Recharts styling stay consistent with Tailwind classes.

Sentiment mode is applied via a `data-sentiment` attribute on the app shell, which updates CSS custom properties for accents, badges, and summary surfaces.

## Out of scope (POC)

- No backend, authentication, or database
- No live market API calls
- No client-side interpretation generation
- Filtering and search run entirely in the browser

## License

MIT — POC engagement.
