# Diamond Pigs Signals Dashboard

A frontend proof of concept for the Diamond Pigs market signals dashboard. The app renders a Figma-aligned UI and loads live market data from the **Helix API**.

## Features

- **Market sentiment** (`/`) — consolidated summary, signal cards, line charts, and gauges
- **Loading states** — skeleton UI while Helix data is fetched
- **Sentiment theming** — positive, neutral, and negative modes driven by signal data
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

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Helix is called **only on the server** through the `/api/helix` route. `HELIX_API_KEY` is **not** prefixed with `NEXT_PUBLIC`, so it is never bundled into the browser.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build a static export to `./out` |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `HELIX_API_KEY` | Yes | Server-side API key. Never exposed to the browser. |
| `HELIX_API_URL` | No | Helix endpoint (default: `https://helix.diamondpigs.com/api/v1`) |

See [`.env.example`](./.env.example) for the full template.

## Data flow

```
Browser → GET /api/helix → server cache → Helix dashboard.snapshot
```

1. `SignalsProvider` (`src/lib/data.tsx`) fetches **only** the internal route `GET /api/helix` — it never talks to Helix directly.
2. The route (`src/app/api/helix/route.ts`) reads from a **server-side cache** (`src/lib/helix/serverCache.ts`).
3. The cache calls Helix `dashboard.snapshot` (`output_prompt_id: 7`, `limit_days: 730`) **at most once every 4 hours**. All visitors share the cached payload until the window expires.
4. Helix data is mapped to dashboard signals (`src/lib/helix/mapSnapshot.ts`) and the market summary (`consolidation_summary`: position, description, timestamp, bullets) **on the server**, so the browser receives display-ready JSON (`{ signals, consolidation, fetchedAt }`).

| Dashboard signal | Helix source |
| --- | --- |
| BTC Price | `btc_price_4h` |
| Stablecoin Buying Power | `ssr` |
| BTC Netflow | `btc_exchange_netflow` |
| BTC Funding Rate | `btc_funding_rate` (+ open interest extras) |
| US Money Supply | `global_m2` (fallback: `m2`) — US M2 in USD billions, displayed as trillions |
| Crypto Market Sentiment | `fear_greed` |
| VIX (Global Volatility) | `vix` |

Signal card **descriptions** come from Helix. The **market summary** (position, headline description, update time, and bullets) is parsed from `consolidation_summary` on the server.

### Refresh behaviour

- **Server cache** is authoritative: Helix is hit at most once per 4-hour window, shared across all visitors.
- The client displays `fetchedAt` (the real data age) and stores it in `localStorage`.
- While the tab is open, the client re-requests `/api/helix` on GMT-aligned 4-hour boundaries (00:00, 04:00, …); returning to a backgrounded tab triggers a catch-up request. These hit the cached route, so they are cheap.
- Manual refresh is available from the UI.

## Routes

| Route | Description |
| --- | --- |
| `/` | Market sentiment overview with signal cards |
| `GET /api/helix` | Server route returning cached, display-ready dashboard JSON |

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
    api/helix/route.ts    Server route: cached Helix proxy (no key in browser)
  lib/
    data.tsx              Client provider — fetches /api/helix only
    dashboard.ts          Shared internal API contract types
    refreshSchedule.ts    GMT-aligned 4-hour auto-refresh windows
    useSignalRange.ts     Shared range selection and stat sync
    types.ts              Domain types
    format.ts             Value, date, and change formatters
    sentiment.ts          Sentiment and range helpers
    theme.ts              Shared chart and gauge color tokens
    netflow.ts            Netflow weekly chart helpers
    liquidity.ts          Global M2 trillion scaling and chart axis helpers
    helix/                Helix client, types, snapshot mapper, and server cache
```

## Deployment

The app is a Next.js **server build** (not a static export), because the Helix
key must stay server-side. It needs a host that runs Node / serverless functions
(e.g. Vercel, or any Node server) — it can no longer be served as pure static files.

```bash
npm run build
npm run start
```

Set `HELIX_API_KEY` (and optionally `HELIX_API_URL`) in your hosting provider’s
environment variables. Because the key is **not** prefixed with `NEXT_PUBLIC`, it
is only available to the server route and never shipped to the browser.

## Design system

Colors, typography, and spacing follow the Diamond Pigs design tokens in `tailwind.config.ts` and `src/assets/css/globals.css`. Chart and gauge components pull shared values from `src/lib/theme.ts` so SVG and Recharts styling stay consistent with Tailwind classes.

Sentiment mode is applied via a `data-sentiment` attribute on the app shell, which updates CSS custom properties for accents, badges, and summary surfaces.

## Out of scope (POC)

- No authentication or database (the only backend is the cached `/api/helix` proxy)
- No static JSON fallback — Helix API only

## License

MIT — POC engagement.
