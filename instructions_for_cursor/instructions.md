Absolutely. Here is the **fully detailed Cursor prompt document** you can paste into Cursor.

---

# Cursor Prompt: Diamond Pigs Signals Dashboard POC

Build a **pixel-perfect, high-fidelity dashboard prototype** for the **Diamond Pigs Signals Dashboard POC**.

This is a **frontend-only Proof of Concept**. There is **no live backend integration** in this phase. The goal is to test user appetite for the product. The app must look and feel exactly like the provided Figma design and must dynamically render all dashboard data from a static JSON file.

Use the uploaded Figma/design assets and design-system guidelines as the source of truth. The project must follow the extracted color tokens, typography scale, spacing logic, responsive behavior, and accessibility rules from the provided design documentation. The design system requires a clean, token-driven, functional dashboard UI with keyboard-first interactions and WCAG 2.2 AA accessibility expectations. 

---

## 1. Tech Stack

Use the following stack:

* Framework: **Next.js 14+**
* Router: **App Router**
* Styling: **Tailwind CSS**
* Language: **TypeScript**
* Icons: **Lucide React**
* Charts: **Recharts**
* State management: **React Context or local React state**
* Data source: static JSON file
* Deployment target: **Vercel / Netlify / GitHub Pages**
* Static export support preferred using:

```js
output: "export"
```

---

## 2. Main Objective

Create a standalone dashboard application that:

* Matches the Figma design with pixel-perfect accuracy.
* Uses all data from `public/data/indicators.json`.
* Does not call any live backend.
* Renders signal cards, charts, interpretation text, filters, search, and sentiment-based UI states dynamically.
* Works perfectly on desktop, tablet, and mobile.
* Is clean, scalable, reusable, and ready for future backend/API integration.

The provided API documentation confirms that the POC reads from a static `indicators.json` file instead of a live backend, while keeping a realistic market-signal data structure. 

---

## 3. Data Source

Primary data file:

```txt
public/data/indicators.json
```

Optional metadata file:

```txt
public/data/all_signals.json
```

The dashboard must fetch data like this:

```ts
fetch("/data/indicators.json")
```

Do not hardcode signal data inside components.

---

## 4. Expected JSON Structure

The JSON file is an array of indicator/signal objects.

Base structure:

```json
[
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
    "interpretation": "The current reading suggests improving risk appetite across the crypto market.",
    "values": [
      {
        "timestamp": "2026-05-18",
        "value": 45
      },
      {
        "timestamp": "2026-05-19",
        "value": 52
      },
      {
        "timestamp": "2026-05-20",
        "value": 58
      }
    ]
  }
]
```

The official API file defines fields such as `id`, `name`, `category`, `description`, `source`, `unit`, `min_val`, `max_val`, and `values`, where `values` contains time-series objects with `timestamp` and `value`. 

The client clarified that interpretation text will already be included in `indicators.json`, generated from their backend. Your job is only to display it in the UI.

Do not generate interpretation logic.

---

## 5. Daily JSON Update Requirement

The frontend should fetch the updated JSON file once per day.

Implement this in a simple POC-friendly way:

* Fetch `indicators.json` on initial app load.
* Store `lastFetchedAt` in local state or localStorage.
* If 24 hours have passed, refetch the JSON.
* Also include a manual “Refresh data” button.
* Show the latest loaded timestamp in the UI if available.
* If the static JSON file is updated on the hosting environment, the dashboard should display the new values after refresh/refetch.

Do not build a backend cron job. The backend/export process is outside frontend scope. The documentation says the backend scripts/export process generate a fresh `indicators.json`, which is then committed or uploaded to static hosting. 

---

## 6. Pages / Routes

Build these routes:

```txt
/
 /signals
 /settings
```

### `/` Overview Dashboard

Main dashboard screen with:

* Sidebar navigation
* Top bar
* Search input
* System status indicator
* Market sentiment summary card
* Signal cards grid/list
* Charts
* Status badges
* Interpretation text
* Responsive layout

### `/signals`

Signals listing page with:

* All signals
* Search
* Category filter
* Status filter
* Sentiment filter
* Sort options:

  * Name
  * Category
  * Latest value
  * Last updated if field exists
* Clickable signal cards or rows
* Optional expanded detail panel/modal

### `/settings`

Prototype settings page with:

* Data source information
* Last fetched timestamp
* Manual refresh button
* Static app information
* Placeholder settings only; no backend functionality

---

## 7. Layout Requirements

### Sidebar

Include navigation items:

* Overview
* Signals
* Settings

Sidebar requirements:

* Desktop: fixed/left sidebar.
* Tablet/mobile: collapsible drawer or compact menu.
* Use Lucide icons.
* Active route must be visually highlighted.
* Must support keyboard navigation and focus-visible states.

### Top Bar

Include:

* Search input
* System status indicator:

  * Online
  * Issues
* Optional refresh button
* Optional current sentiment label

Search must filter signals client-side.

---

## 8. Signal Card Requirements

Each signal card must show:

* Signal name
* Latest value from the last item in `values`
* Unit
* Category
* Source
* Status badge
* Sentiment badge
* Mini sparkline chart
* Interpretation text
* Optional description
* Optional min/max range
* Optional last updated date based on latest `values[].timestamp`

Latest value logic:

```ts
const latest = signal.values[signal.values.length - 1];
```

Do not assume values exist. Add fallback UI for empty/missing data.

---

## 9. Chart Requirements

Use Recharts.

Implement:

* Mini sparkline chart on each signal card.
* Larger chart in detail view.
* Time-series chart using `values`.
* X-axis from `timestamp`.
* Y-axis from `value`.
* Tooltip on hover.
* Responsive container.
* Graceful empty state if no values.

The briefing requires interactive time-series charts for each signal and client-side filtering/search. 

---

## 10. Sentiment Theme Requirement

The dashboard must support 3 sentiment modes:

```ts
positive
neutral
negative
```

The page changes colors based on sentiment.

### Positive

Use green/positive accents.

* Summary card background: light green
* Badges: green
* Highlight states: green
* Positive interpretation styling

### Neutral

Use blue/neutral accents.

* Summary card background: light blue
* Badges: blue
* Highlight states: blue

### Negative

Use red/orange/negative accents.

* Summary card background: light red/orange
* Badges: red/orange
* Alert-like styling

The layout remains the same. Only colors, badges, summary panels, and accent states change.

Determine overall page sentiment by either:

1. A top-level field if provided in JSON, or
2. The majority/common sentiment across indicators, or
3. A safe default of `neutral`.

Keep this logic isolated in a helper function.

---

## 11. Status States

Support these statuses:

```ts
healthy
stale
error
```

Each status must have:

* Badge label
* Visual color
* Accessible text
* Optional icon

Rules:

* `healthy`: normal/green/success style
* `stale`: warning/amber style
* `error`: danger/red style

If status is missing, show `unknown`.

---

## 12. Search and Filtering

All filtering must be client-side.

Search should match:

* Signal name
* Category
* Description
* Source
* Interpretation text

Filters:

* Category
* Status
* Sentiment

Sorting:

* Name A-Z
* Latest value high-low
* Latest value low-high
* Category
* Status

Do not make API requests for filtering.

---

## 13. Component Structure

Use modular components.

Suggested structure:

```txt
src/
  app/
    layout.tsx
    page.tsx
    signals/
      page.tsx
    settings/
      page.tsx

  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      TopBar.tsx
      MobileNav.tsx

    dashboard/
      MarketSummary.tsx
      SignalCard.tsx
      SignalGrid.tsx
      SignalDetailPanel.tsx
      StatusBadge.tsx
      SentimentBadge.tsx
      EmptyState.tsx
      LoadingState.tsx
      ErrorState.tsx

    charts/
      SparklineChart.tsx
      SignalLineChart.tsx
      GaugeChart.tsx

    filters/
      SearchInput.tsx
      CategoryFilter.tsx
      StatusFilter.tsx
      SentimentFilter.tsx
      SortDropdown.tsx

    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      Input.tsx
      Select.tsx

  lib/
    data.ts
    types.ts
    utils.ts
    sentiment.ts
    format.ts

  public/
    data/
      indicators.json
      all_signals.json
```

---

## 14. TypeScript Types

Create strong types:

```ts
export type SignalStatus = "healthy" | "stale" | "error" | "unknown";

export type SentimentType = "positive" | "neutral" | "negative";

export interface SignalValue {
  timestamp: string;
  value: number;
}

export interface Signal {
  id: string;
  name: string;
  category: string;
  description?: string;
  source?: string;
  unit?: string;
  min_val?: number;
  max_val?: number;
  status?: SignalStatus;
  sentiment?: SentimentType;
  interpretation?: string;
  values: SignalValue[];
}
```

Allow flexible fields because the backend JSON may include additional data later.

---

## 15. Utility Functions

Create helpers:

```ts
getLatestValue(signal)
getPreviousValue(signal)
getValueChange(signal)
getValueChangePercent(signal)
getSignalSentiment(signal)
getOverallSentiment(signals)
getStatusLabel(status)
formatValue(value, unit)
formatDate(timestamp)
filterSignals(signals, filters)
sortSignals(signals, sortKey)
```

---

## 16. Design System Requirements

Use the uploaded design system tokens.

The design guidelines define key colors including Orange Gradient, Green Gradient, Blue Gradient, blue scale, green scale, neutral whites, and greys. They also define Inter Tight typography for desktop and mobile sizes. 

### Typography

Use **Inter Tight**.

Desktop typography tokens:

* H1: 68px / 80px
* H2: 34px / 40px
* H3: 28px / 32px
* H4: 22px / 28px
* Body: 17px / 24px
* Small: 14px / 20px
* Caption: 12px / 16px

Mobile typography tokens:

* H1: 34px / 40px
* H2: 28px / 32px
* H3: 22px / 28px
* H4: 18px / 24px
* Body: 17px / 24px
* Small: 14px / 20px
* Caption: 12px / 16px

### Colors

Use design tokens, not random one-off colors.

Important colors:

```txt
Primary blue:
#EDF6FF
#B6D6F7
#92C2F3
#60A6ED
#4195E9
#127AE4
#106FCF
#0D57A2
#0A437D
#083360

Secondary green:
#F9FEF4
#ECFBDB
#E3F9CA
#D6F6B2
#CEF5A3
#C2F28C
#B1DC7F
#8AAC63
#6B854D
#335C07

Neutral:
#FFFFFF
#FCFCFC
#F6F6F8
#E5E5E5
#B3B3B3
#8B8B8B
#6A6A6A
```

Gradients:

```txt
Orange Gradient: #F9B8A2 → #FFFFFF
Green Gradient: #C2F28C → transparent
Blue Gradient: #B6D6F7 → #FFFFFF
Full Gradient: #C2F28C → #84C9F4 → #127AE4
Blue to Green Gradient
Green to Blue Gradient
```

---

## 17. Interaction Requirements

Every interactive component must include:

* default state
* hover state
* active state
* focus-visible state
* disabled state
* loading state where applicable

This applies to:

* Buttons
* Sidebar items
* Search input
* Filters
* Dropdowns
* Cards if clickable
* Refresh button
* Mobile navigation

Do not remove focus outlines.

---

## 18. Accessibility Requirements

Must follow:

* WCAG 2.2 AA
* Keyboard navigation
* Focus-visible indicators
* Proper labels for inputs
* `aria-label` where needed
* Sufficient color contrast
* Do not rely only on color for status/sentiment
* Badges must include readable text
* Charts must include accessible fallback/summary text

---

## 19. Responsive Requirements

Must work flawlessly on:

* Desktop
* Tablet
* Mobile

Desktop:

* Sidebar visible
* Dashboard content grid
* Cards in multi-column layout

Tablet:

* Sidebar can collapse
* Cards adjust to 2 columns

Mobile:

* Sidebar becomes drawer/bottom nav/menu
* Cards become single column
* Charts remain responsive
* Text must not overflow
* Long interpretation text should clamp or wrap cleanly

---

## 20. Loading, Error, and Empty States

Implement:

### Loading State

Show skeleton cards while JSON loads.

### Error State

If JSON fails to load:

* Show friendly error message
* Show retry button
* Do not crash app

### Empty State

If no indicators exist:

* Show empty dashboard message
* Keep layout stable

### Missing Fields

If any field is missing:

* Show fallback values
* Do not break UI

Examples:

```txt
Unknown source
No interpretation available
No chart data available
Unknown status
```

---

## 21. Settings Page Details

Settings page should include:

* Data source path: `/data/indicators.json`
* Last fetched time
* Manual refresh button
* Static POC notice
* Current app version placeholder
* Hosting/deployment notes placeholder

No real backend settings.

---

## 22. Delivery Requirements

Deliver:

* Private GitHub or GitLab repository
* Live test deployment URL
* `POC_INFO.md` in root

`POC_INFO.md` should include:

```md
# Diamond Pigs Signals Dashboard POC

## Test URL
[insert deployed URL]

## Tech Stack
Next.js 14+, Tailwind CSS, TypeScript, Recharts, Lucide React

## Data Source
public/data/indicators.json

## Deployment Notes
[insert notes]

## How to Update Data
Replace public/data/indicators.json and redeploy or refresh static hosting.
```

The API documentation specifically requires private GitHub/GitLab delivery, hosted test environment, and a `POC_INFO.md` file with test URL and deployment notes. 

---

## 23. Important “Do Not” Rules

Do not:

* Build a backend.
* Add live API integration.
* Generate interpretation text.
* Hardcode signal data.
* Hardcode random colors outside design tokens.
* Ignore Figma spacing, typography, shadows, radius, or hover states.
* Break mobile responsiveness.
* Remove keyboard accessibility.
* Make filtering server-side.
* Assume every field always exists.
* Use fake UI that does not read from JSON.

---

## 24. Acceptance Criteria

The project is complete only if:

* UI matches Figma closely.
* Data loads from `public/data/indicators.json`.
* Signal cards render dynamically.
* Latest value is calculated from the final item in `values`.
* Interpretation text displays from JSON.
* Charts render from `values`.
* Search works client-side.
* Filters work client-side.
* Sentiment theme changes between positive, neutral, and negative.
* Status badges support healthy, stale, error, and unknown.
* Responsive layout works on desktop/tablet/mobile.
* Loading, error, and empty states exist.
* Code is modular and scalable.
* `POC_INFO.md` exists.
* App can be deployed to Vercel/Netlify/GitHub Pages.

---

## 25. Final Developer Note

Focus on the **look and feel** first. This is a POC meant to impress stakeholders and validate demand. The dashboard should feel modern, fast, clean, responsive, and highly polished while remaining simple under the hood.

The current phase is intentionally small, but code should be structured so future pages, integrations, and backend APIs can be added later without rewriting the frontend architecture.
