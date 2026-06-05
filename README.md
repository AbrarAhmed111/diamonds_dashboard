# Diamond Pigs Signals Dashboard

A Next.js dashboard for Diamond Pigs market intelligence. The application presents live signal data from the Helix API in a responsive, brand-aligned interface with charts, gauges, and a consolidated market summary.

## Features

- **Market sentiment overview** — consolidated summary, signal cards, line charts, and gauges
- **Server-side data layer** — secure Helix integration with shared caching
- **Sentiment theming** — positive, neutral, and negative modes driven by signal data
- **Responsive layout** — desktop sidebar, collapsible navigation, and mobile drawer
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
| Data | Helix API (`dashboard.snapshot`) via internal `/api/helix` route |
| Hosting | Next.js server build (Node / serverless, e.g. Vercel) |

## Quick start

```bash
npm install
cp .env.example .env.local
```

Add your Helix API key to `.env.local`:

```env
HELIX_API_KEY=dp_your_key_here
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Helix is accessed only on the server through the `/api/helix` route. `HELIX_API_KEY` is not prefixed with `NEXT_PUBLIC`, so it is never exposed to the browser.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `HELIX_API_KEY` | Yes | Server-side API key |
| `HELIX_API_URL` | No | Helix endpoint (default: `https://helix.diamondpigs.com/api/v1`) |

See [`.env.example`](./.env.example) for the full template.

## Architecture

```
Browser → GET /api/helix → server cache → Helix dashboard.snapshot
```

1. `SignalsProvider` (`src/lib/data.tsx`) loads dashboard data from `GET /api/helix`.
2. The API route (`src/app/api/helix/route.ts`) serves responses from a server-side cache (`src/lib/helix/serverCache.ts`).
3. The cache refreshes from Helix `dashboard.snapshot` (`output_prompt_id: 7`, `limit_days: 730`) on a four-hour TTL. All visitors receive the same cached payload until the window expires.
4. Helix responses are mapped to display-ready signals (`src/lib/helix/mapSnapshot.ts`) and market summary data (`consolidation_summary`) on the server. The client receives `{ signals, consolidation, fetchedAt }`.

| Dashboard signal | Helix source |
| --- | --- |
| BTC Price | `btc_price_4h` |
| Stablecoin Buying Power | `ssr` |
| BTC Netflow | `btc_exchange_netflow` |
| BTC Funding Rate | `btc_funding_rate` (+ open interest metadata) |
| US Money Supply | `global_m2` (fallback: `m2`) |
| Crypto Market Sentiment | `fear_greed` |
| VIX (Global Volatility) | `vix` |

Signal descriptions and the market summary (position, headline, update time, and bullets) are sourced from Helix and rendered on the client.

### Data refresh

- The server cache limits Helix requests to one refresh per four-hour window.
- The UI displays `fetchedAt` to indicate data age.
- The client re-fetches `/api/helix` on GMT-aligned four-hour boundaries while the tab is open, with a catch-up request when the tab becomes visible again.
- **Account → Refresh data** bypasses the cache and fetches a new snapshot from Helix immediately (`GET /api/helix?force=true`).

## Routes

| Route | Description |
| --- | --- |
| `/` | Market sentiment dashboard |
| `GET /api/helix` | Cached dashboard JSON API |

## Project structure

```
src/
  app/                    App Router pages and layout
  assets/css/             Global styles and sentiment CSS variables
  components/
    layout/               AppShell, Sidebar, TopBar, MobileNav
    dashboard/            Signal cards, summary, badges, loading/error states
    charts/               Line charts, gauges
    ui/                   Button, Badge, Input, Avatar
  app/
    api/helix/route.ts    Server route: Helix proxy with caching
  lib/
    data.tsx              Client provider
    dashboard.ts          Internal API contract types
    refreshSchedule.ts    GMT-aligned refresh windows
    useSignalRange.ts     Range selection and stat sync
    types.ts              Domain types
    format.ts             Value, date, and change formatters
    sentiment.ts          Sentiment and range helpers
    theme.ts              Chart and gauge color tokens
    netflow.ts            Netflow chart helpers
    liquidity.ts          M2 scaling and chart axis helpers
    helix/                Helix client, types, mapper, and server cache
```

## Deployment

The application requires a Node.js or serverless runtime (e.g. Vercel) because Helix credentials and caching run on the server.

```bash
npm run build
npm run start
```

Configure `HELIX_API_KEY` and optionally `HELIX_API_URL` in your hosting environment. Server-only variables are not bundled into client JavaScript.

## Design system

Colors, typography, and spacing follow Diamond Pigs design tokens in `tailwind.config.ts` and `src/assets/css/globals.css`. Chart and gauge components use shared values from `src/lib/theme.ts` for consistent SVG and Recharts styling.

Sentiment mode is applied via a `data-sentiment` attribute on the application shell, which updates CSS custom properties for accents, badges, and summary surfaces.

## License

MIT
