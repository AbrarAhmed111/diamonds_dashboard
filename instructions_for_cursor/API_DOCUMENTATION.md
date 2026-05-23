# API Documentation - Diamond Pigs Signals POC

This document describes the JSON data structure and the "API" for the Diamond Pigs Signals Dashboard Proof of Concept (POC).

## Overview

For the POC, the application will read from a static JSON file instead of a live backend. This allows for a simplified frontend-only development focus while maintaining a realistic data structure.

## Data Source: `indicators.json`

The primary data source is a file named `indicators.json`. This file contains the metadata and historical time-series data for all market signals.

### File Format

The file is a JSON array of signal objects.

```json
[
  {
    "id": "signal_slug",
    "name": "Signal Display Name",
    "category": "category_name",
    "description": "Longer description of the signal.",
    "source": "Data Source (e.g., CryptoQuant, FRED)",
    "unit": "Unit (e.g., %, USD, index)",
    "min_val": 0.0,
    "max_val": 100.0,
    "values": [
      {
        "timestamp": "YYYY-MM-DD",
        "value": 123.45
      },
      ...
    ]
  },
  ...
]
```

### Fields Description

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique identifier (slug) for the signal. |
| `name` | String | Human-readable name of the signal. |
| `category` | String | Category grouping (e.g., macro, technical, sentiment). |
| `description` | String | Detailed explanation of what the signal represents. |
| `source` | String | Origin of the data. |
| `unit` | String | Unit of measurement. |
| `min_val` | Number | Historical minimum value (calculated). |
| `max_val` | Number | Historical maximum value (calculated). |
| `values` | Array | Chronological list of data points. |
| `values[].timestamp` | String | ISO 8601 date string (YYYY-MM-DD). |
| `values[].value` | Number | The numerical value of the signal at that timestamp. |

## Metadata: `all_signals.json`

A secondary file `all_signals.json` contains only the metadata (excluding the `values` array) for quick discovery and listing.

## Delivery and Hosting (POC)

For the external programmer building this POC:

1. **Code Delivery**: The source code must be provided via a private **GitLab** or **GitHub** repository.
2. **Hosting**: 
   - The programmer should host a live version of the POC for review.
   - Recommended platforms: **Vercel**, **Netlify**, or **GitHub Pages** (since it's a static export).
   - Once hosted, the programmer must provide the **Test URL** (Domain Name).
3. **Environment Configuration**: 
   - Create a file named `POC_INFO.md` in the root of the repository containing the test URL and any deployment notes.
   - If a specific domain is required for testing on your end (e.g., `gold.diamondpigs.com`), this should be coordinated, but for the POC, a generic Vercel/Netlify URL is preferred.

## How to Update Data Daily

To keep the dashboard updated every day:

1. **Data Collection**: The backend scripts (e.g., `signal_manager.py`) fetch the latest data from various providers into a local SQLite database (`signals.db`).
2. **Export Process**: Run the `indicators_export.py` script. This script queries the database and generates a fresh `indicators.json` file.
3. **Deployment**: The updated `indicators.json` is committed to the repository or uploaded to the static hosting environment.

### Example Update Command:
```bash
# Run this daily via Cron or a Github Action
python indicators_export.py
```

## POC Implementation Notes

- **Pixel Perfection**: The developer must match the Figma design exactly.
- **Client-Side Processing**: All filtering, searching, and chart rendering should be done client-side using the data from the loaded JSON.
- **Charts**: Use a robust charting library (like Recharts or Chart.js) to render the `values` time-series.
