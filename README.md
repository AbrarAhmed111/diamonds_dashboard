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
| `npm run test:helix` | Call Helix from the CLI and print the raw response |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_HELIX_API_KEY` | Yes (browser) | API key used by the dashboard at runtime |
| `NEXT_PUBLIC_HELIX_API_URL` | No | Helix endpoint (default: `https://helix.diamondpigs.com/api/v1`) |
| `HELIX_API_KEY` | CLI only | Used by `npm run test:helix` |
| `HELIX_API_URL` | CLI only | Override Helix URL for CLI scripts |
| `NEXT_PUBLIC_BASE_PATH` | No | Base path when hosting under a sub-path |

See [`.env.example`](./.env.example) for the full template.

## Data

### Helix snapshot

On load, `SignalsProvider` (`src/lib/data.tsx`) requests:

```json
{
  "action": "dashboard.snapshot",
  "params": {
    "output_prompt_id": 7,
    "limit_days": 90
  }
}
```

The response is mapped to dashboard signals in `src/lib/helix/mapSnapshot.ts` and summary bullets are parsed from `consolidation_summary`.

| Dashboard signal | Helix source |
| --- | --- |
| BTC Price | `btc_price_4h` |
| Market Buying Power | `ssr` |
| BTC Netflow | `btc_exchange_netflow` |
| BTC Funding Rate | `btc_funding_rate` (+ open interest extras) |
| Global Liquidity | `m2` |
| Crypto Market Sentiment | `fear_greed` (+ RSI / ADX / VIX sub-stats) |
| VIX (Global Volatility) | `vix` |

Indicator **descriptions** shown on cards are defined in the mapper. **Values**, **charts**, and the **market summary bullets** come from the API.

### Refresh behaviour

- `lastFetchedAt` is stored in `localStorage`
- Data is refetched automatically after 24 hours
- Manual refresh is available from the UI

### Testing the API

- **CLI:** `npm run test:helix`
- **Browser (dev):** open `/helix-test` to probe `dashboard.snapshot` and inspect the raw JSON

## Routes

| Route | Description |
| --- | --- |
| `/` | Market sentiment overview with signal cards |
| `/dashboard` | Personal dashboard placeholder (coming soon) |
| `/helix-test` | Dev-only Helix API probe (not linked in navigation) |

## Project structure

```
src/
  app/                    App Router pages and layout
  assets/css/             Global styles and sentiment CSS variables
  components/
    layout/               AppShell, Sidebar, TopBar, MobileNav
    dashboard/            Signal cards, summary, badges, loading/error states
    charts/               Line charts, gauges, sparklines
    ui/                   Button, Badge, Input, etc.
  lib/
    data.tsx              Helix fetch, context, and refresh logic
    types.ts              Domain types
    format.ts             Value, date, and change formatters
    sentiment.ts          Filtering, sorting, sentiment helpers
    theme.ts              Shared chart and gauge color tokens
    netflow.ts            Netflow weekly chart helpers
    helix/
      client.ts           Helix HTTP client
      mapSnapshot.ts      Helix → dashboard signal mapping
      parseSummary.ts     consolidation_summary HTML parser
      config.ts           URL, API key, default params
scripts/
  test-helix-api.mjs      CLI Helix smoke test
```

## Deployment

The app is configured for static export:

```bash
npm run build
```

Deploy the contents of `./out` to Vercel, Netlify, GitHub Pages, or any static host.

Set `NEXT_PUBLIC_HELIX_API_KEY` (and optionally `NEXT_PUBLIC_HELIX_API_URL`) in your hosting provider’s environment variables before building, or inject them at build time.

For sub-path hosting (e.g. GitHub Pages), set `basePath` in `next.config.mjs` and `NEXT_PUBLIC_BASE_PATH` to match your path.

See [`POC_INFO.md`](./POC_INFO.md) for delivery checklist and hosting notes.

## Design system

Colors, typography, and spacing follow the Diamond Pigs design tokens in `tailwind.config.ts` and `src/assets/css/globals.css`. Chart and gauge components pull shared values from `src/lib/theme.ts` so SVG and Recharts styling stay consistent with Tailwind classes.

Sentiment mode is applied via a `data-sentiment` attribute on the app shell, which updates CSS custom properties for accents, badges, and summary surfaces.

## Out of scope (POC)

- No backend, authentication, or database
- No static JSON fallback — Helix API only
- Personal dashboard, watchlists, and alerts are placeholders

## License

MIT — POC engagement.
