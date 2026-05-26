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
| Data | Helix API (`dashboard.snapshot`) |
| Hosting | Static export (`output: "export"`) |

## Quick start

```bash
npm install
cp .env.example .env.local
```

Add your Helix API key to `.env.local`:

```env
NEXT_PUBLIC_HELIX_API_KEY=dp_your_key_here
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Because the app is a static export, Helix is called **from the browser**. `NEXT_PUBLIC_HELIX_API_KEY` is required for the Market sentiment page to load data.

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
| `NEXT_PUBLIC_HELIX_API_KEY` | Yes | API key used by the dashboard at runtime |
| `NEXT_PUBLIC_HELIX_API_URL` | No | Helix endpoint (default: `https://helix.diamondpigs.com/api/v1`) |
| `NEXT_PUBLIC_BASE_PATH` | No | Base path when hosting under a sub-path |

See [`.env.example`](./.env.example) for the full template.

## Data

On load, `SignalsProvider` (`src/lib/data.tsx`) requests a Helix `dashboard.snapshot` with `output_prompt_id: 7` and `limit_days: 730`.

The response is mapped to dashboard signals in `src/lib/helix/mapSnapshot.ts` and summary bullets are parsed from `consolidation_summary`.

| Dashboard signal | Helix source |
| --- | --- |
| BTC Price | `btc_price_4h` |
| Market Buying Power | `ssr` |
| BTC Netflow | `btc_exchange_netflow` |
| BTC Funding Rate | `btc_funding_rate` (+ open interest extras) |
| Global Liquidity | `global_m2` (fallback: `m2`) — values in USD billions, displayed as trillions |
| Crypto Market Sentiment | `fear_greed` |
| VIX (Global Volatility) | `vix` |

Indicator **descriptions** shown on cards are defined in the mapper. **Values**, **charts**, and the **market summary bullets** come from the API.

### Refresh behaviour

- `lastFetchedAt` is stored in `localStorage`
- Data is refetched automatically every **4 hours**, aligned to **00:00 GMT** (then 04:00, 08:00, 12:00, 16:00, 20:00)
- While the tab is open, the next refresh is scheduled at the upcoming GMT boundary; returning to a backgrounded tab triggers a catch-up fetch if the current window was missed
- Manual refresh is available from the UI

## Routes

| Route | Description |
| --- | --- |
| `/` | Market sentiment overview with signal cards |

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
  lib/
    data.tsx              Helix fetch, context, and refresh logic
    refreshSchedule.ts    GMT-aligned 4-hour auto-refresh windows
    useSignalRange.ts     Shared range selection and stat sync
    types.ts              Domain types
    format.ts             Value, date, and change formatters
    sentiment.ts          Sentiment and range helpers
    theme.ts              Shared chart and gauge color tokens
    netflow.ts            Netflow weekly chart helpers
    liquidity.ts          Global M2 trillion scaling and chart axis helpers
    helix/                Helix API client, types, and snapshot mapper
```

## Deployment

The app is configured for static export:

```bash
npm run build
```

Deploy the contents of `./out` to Vercel, Netlify, GitHub Pages, or any static host.

Set `NEXT_PUBLIC_HELIX_API_KEY` (and optionally `NEXT_PUBLIC_HELIX_API_URL`) in your hosting provider’s environment variables before building.

For sub-path hosting (e.g. GitHub Pages), set `basePath` in `next.config.mjs` and `NEXT_PUBLIC_BASE_PATH` to match your path.

## Design system

Colors, typography, and spacing follow the Diamond Pigs design tokens in `tailwind.config.ts` and `src/assets/css/globals.css`. Chart and gauge components pull shared values from `src/lib/theme.ts` so SVG and Recharts styling stay consistent with Tailwind classes.

Sentiment mode is applied via a `data-sentiment` attribute on the app shell, which updates CSS custom properties for accents, badges, and summary surfaces.

## Out of scope (POC)

- No backend, authentication, or database
- No static JSON fallback — Helix API only

## License

MIT — POC engagement.
