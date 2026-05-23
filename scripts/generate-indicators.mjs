// Deterministic seed-based generator for the POC indicators.json.
// Run: `node scripts/generate-indicators.mjs`
// Output: public/data/indicators.json + public/data/all_signals.json

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TODAY = new Date("2026-05-21T00:00:00Z");
const DAYS = 365;

function dailySeries({ seed, base, trend, volatility, min, max, decimals = 2, days = DAYS }) {
  const rand = mulberry32(seed);
  const values = [];
  let v = base;
  for (let i = 0; i < days; i++) {
    const drift = trend / days;
    const noise = (rand() - 0.5) * volatility;
    v = v + drift + noise * v * 0.01;
    if (typeof min === "number") v = Math.max(min, v);
    if (typeof max === "number") v = Math.min(max, v);
    const d = new Date(TODAY);
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    const ts = d.toISOString().slice(0, 10);
    values.push({ timestamp: ts, value: Number(v.toFixed(decimals)) });
  }
  return values;
}

function bandedSeries({ seed, base, swing, period, min, max, decimals = 2, days = DAYS }) {
  const rand = mulberry32(seed);
  const values = [];
  for (let i = 0; i < days; i++) {
    const cycle = Math.sin((i / days) * Math.PI * 2 * (days / period));
    const noise = (rand() - 0.5) * swing * 0.4;
    let v = base + cycle * swing + noise;
    if (typeof min === "number") v = Math.max(min, v);
    if (typeof max === "number") v = Math.min(max, v);
    const d = new Date(TODAY);
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    values.push({ timestamp: d.toISOString().slice(0, 10), value: Number(v.toFixed(decimals)) });
  }
  return values;
}

function monthlySeries({ seed, base, trend, volatility, startYear, decimals = 0 }) {
  const rand = mulberry32(seed);
  const months = (TODAY.getUTCFullYear() - startYear) * 12 + TODAY.getUTCMonth() + 1;
  const values = [];
  let v = base;
  for (let i = 0; i < months; i++) {
    const drift = trend / months;
    const noise = (rand() - 0.5) * volatility;
    v = v + drift + noise * v * 0.01;
    const d = new Date(Date.UTC(startYear, i, 1));
    values.push({
      timestamp: d.toISOString().slice(0, 10),
      value: Number(v.toFixed(decimals)),
    });
  }
  return values;
}

function netflowSeries({ seed, days = 30 }) {
  const rand = mulberry32(seed);
  const values = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(TODAY);
    d.setUTCDate(d.getUTCDate() - (days - 1 - i));
    const inflows = Math.round(40 + rand() * 110);
    const outflows = Math.round(40 + rand() * 110);
    values.push({
      timestamp: d.toISOString().slice(0, 10),
      value: inflows - outflows,
      inflows,
      outflows,
    });
  }
  return values;
}

const signals = [
  {
    id: "btc_price",
    name: "BTC Price",
    category: "technical",
    description:
      "Spot price of Bitcoin in US dollars across major exchanges, weighted by traded volume. The series tracks the cleanest read of the live market by stripping out illiquid venues and stale prints. It is the anchor signal for every cross-asset comparison on this dashboard.",
    source: "CoinGecko",
    unit: "USD",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Price is consolidating above the medium-term trendline with steady accumulation, signalling cautious upside if macro stays supportive.",
    values: dailySeries({
      seed: 11,
      base: 48000,
      trend: 18000,
      volatility: 2.6,
      min: 30000,
      max: 95000,
      decimals: 2,
    }),
  },
  {
    id: "eth_price",
    name: "ETH Price",
    category: "technical",
    description:
      "Spot price of Ethereum in US dollars, weighted across the deepest spot books. Ether tends to lead during risk-on rotations and lag when liquidity tightens, so this signal doubles as a proxy for crypto-native risk appetite.",
    source: "CoinGecko",
    unit: "USD",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Ether is tracking BTC strength and benefitting from rising staking flows; relative momentum is improving against the broader majors.",
    values: dailySeries({
      seed: 17,
      base: 2400,
      trend: 1100,
      volatility: 3.2,
      min: 1500,
      max: 5200,
      decimals: 2,
    }),
  },
  {
    id: "fear_greed",
    name: "Crypto Fear & Greed Index",
    category: "sentiment",
    description:
      "Composite score of crypto market sentiment from 0 (extreme fear) to 100 (extreme greed). The index blends realised volatility, social chatter, momentum, and survey data into a single number to summarise crowd positioning.",
    source: "Alternative.me",
    unit: "index",
    min_val: 0,
    max_val: 100,
    status: "healthy",
    sentiment: "neutral",
    interpretation:
      "Sentiment has cooled from greed into neutral territory, suggesting traders are no longer chasing strength but are not yet capitulating.",
    values: bandedSeries({
      seed: 23,
      base: 55,
      swing: 25,
      period: 90,
      min: 8,
      max: 95,
      decimals: 0,
    }),
  },
  {
    id: "buying_power",
    name: "Buying Power",
    category: "on_chain",
    description:
      "Stablecoin supply normalised by total crypto market cap, expressed in trillions. A rising ratio means there is more dry powder parked on the sidelines relative to risk assets, which historically precedes upside breakouts. We focus on the trend, not the absolute level, because the float of stables is a slow-moving balance sheet.",
    source: "Diamond Pigs",
    unit: "USD",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Buying power is sitting in the upper half of its 12-month range, hinting that capital remains parked and ready to redeploy.",
    values: dailySeries({
      seed: 53,
      base: 84e12,
      trend: 18e12,
      volatility: 0.4,
      min: 70e12,
      max: 120e12,
      decimals: 0,
    }),
  },
  {
    id: "btc_netflow",
    name: "BTC Netflow",
    category: "on_chain",
    description:
      "Net flow of Bitcoin moving into and out of major exchanges over the past week. Sustained outflows often signal coins being moved into self-custody or long-term storage, a leading indicator for upside breakouts. Persistent inflows tend to precede distribution and short-term tops.",
    source: "Glassnode",
    unit: "BTC",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Outflows have outpaced inflows for five of the last seven sessions; long-term holders are accumulating into strength.",
    values: netflowSeries({ seed: 137, days: 30 }),
    state_label: "Accumulation (Outflows > Inflows)",
  },
  {
    id: "btc_funding_rate",
    name: "BTC Funding Rate",
    category: "sentiment",
    description:
      "Funding rate paid between long and short Bitcoin perpetual traders every eight hours. Positive readings mean longs are paying shorts (bullish positioning); negative readings mean shorts are paying longs (bearish positioning). Extremes in either direction are often contrarian signals.",
    source: "Coinglass",
    unit: "%",
    min_val: -0.05,
    max_val: 0.05,
    status: "healthy",
    sentiment: "neutral",
    interpretation:
      "Funding is hovering just above neutral with mild long bias; positioning is balanced, leaving room for moves in either direction.",
    values: bandedSeries({
      seed: 149,
      base: 0.012,
      swing: 0.018,
      period: 30,
      min: -0.04,
      max: 0.04,
      decimals: 4,
      days: 90,
    }),
    state_label: "Balanced",
    eight_hour_avg: 0.009,
    seven_day_avg: 0.014,
    annualized_estimate: 5.8,
    open_interest: 18.4e9,
  },
  {
    id: "global_liquidity",
    name: "Global Liquidity",
    category: "macro",
    description:
      "Aggregated M2 money supply across the United States, Eurozone, Japan, and China expressed in US dollars. Expanding global liquidity historically correlates with risk-on cycles in crypto and equities, while contractions tighten financial conditions.",
    source: "FRED, ECB, BOJ, PBoC",
    unit: "USD",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Global M2 has reaccelerated for two straight quarters as central banks lean dovish; the liquidity backdrop is turning back in favour of risk.",
    values: monthlySeries({
      seed: 163,
      base: 65e12,
      trend: 33e12,
      volatility: 0.8,
      startYear: 2014,
      decimals: 0,
    }),
    state_label: "+2.4%",
  },
  {
    id: "crypto_market_sentiment",
    name: "Crypto Market Sentiment",
    category: "sentiment",
    description:
      "Composite reading combining social chatter, options skew, momentum, and dominance into a single 0-100 index. A reading of 0 reflects deep fear and capitulation; a reading of 100 reflects unchecked greed and crowded longs. The dial below shows the latest reading and label.",
    source: "Diamond Pigs",
    unit: "index",
    min_val: 0,
    max_val: 100,
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "The composite reads 78 (Greed); positioning is stretched but momentum and dominance components remain orderly.",
    values: bandedSeries({
      seed: 173,
      base: 65,
      swing: 18,
      period: 60,
      min: 10,
      max: 92,
      decimals: 0,
    }),
    state_label: "Greed",
    social_sentiment: 28,
    volatility_score: 42,
    market_momentum: 31,
    btc_dominance_score: 49,
  },
  {
    id: "vix",
    name: "VIX (Global Volatility)",
    category: "macro",
    description:
      "Crypto ipsum bitcoin ethereum dogecoin litecoin. Ox flow decentraland solana quant. Kava zcash gala secret amp terraUSD.",
    source: "CBOE",
    unit: "index",
    min_val: 0,
    max_val: 50,
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Realised and implied vol are compressing together; macro tape is calm, providing a friendlier backdrop for risk allocation.",
    values: bandedSeries({
      seed: 181,
      base: 14,
      swing: 6,
      period: 80,
      min: 8,
      max: 32,
      decimals: 1,
    }),
    state_label: "Calm Markets",
  },
  {
    id: "market_cap",
    name: "Total Crypto Market Cap",
    category: "market",
    description:
      "Aggregate market capitalisation of every cryptocurrency tracked by CoinGecko. The signal is a fast read on whether fresh capital is entering the asset class or whether existing capital is rotating internally without growing the pie.",
    source: "CoinGecko",
    unit: "USD",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Total market cap is grinding higher with widening breadth across mid caps; risk appetite is rotating beyond BTC and ETH.",
    values: dailySeries({
      seed: 29,
      base: 1.9e12,
      trend: 7e11,
      volatility: 2.1,
      min: 1.2e12,
      max: 3.6e12,
      decimals: 0,
    }),
  },
  {
    id: "btc_dominance",
    name: "Bitcoin Dominance",
    category: "market",
    description:
      "Bitcoin's share of the total crypto market capitalisation. Rising dominance during corrections shows alts are bleeding faster than BTC; falling dominance during rallies usually reflects healthy rotation into mid- and small-caps.",
    source: "CoinGecko",
    unit: "%",
    min_val: 0,
    max_val: 100,
    status: "healthy",
    sentiment: "neutral",
    interpretation:
      "Dominance is grinding sideways near 54%, a regime where capital is rotating into select altcoins without abandoning Bitcoin leadership.",
    values: bandedSeries({
      seed: 67,
      base: 54,
      swing: 3.5,
      period: 80,
      min: 42,
      max: 62,
      decimals: 2,
    }),
  },
  {
    id: "btc_rsi_14d",
    name: "BTC RSI (14d)",
    category: "technical",
    description:
      "14-day Relative Strength Index for Bitcoin computed on daily closes. Readings above 70 mark overbought conditions, below 30 oversold. Useful for spotting exhaustion at the edges of trends rather than as a stand-alone trading trigger.",
    source: "TradingView",
    unit: "index",
    min_val: 0,
    max_val: 100,
    status: "healthy",
    sentiment: "neutral",
    interpretation:
      "RSI is cooling from overbought into balanced territory, easing short-term reversal risk while maintaining the broader uptrend.",
    values: bandedSeries({
      seed: 79,
      base: 58,
      swing: 18,
      period: 30,
      min: 18,
      max: 88,
      decimals: 1,
    }),
  },
  {
    id: "long_short_ratio",
    name: "Long/Short Ratio",
    category: "sentiment",
    description:
      "Aggregated futures positioning across major perpetual venues. Values above 1 mean traders are leaning long; below 1 means short. Extremes against price action are common contrarian setups for short-term reversals.",
    source: "Coinglass",
    unit: "ratio",
    status: "healthy",
    sentiment: "positive",
    interpretation:
      "Traders are leaning short despite price strength, a contrarian setup that historically resolves with a squeeze higher.",
    values: bandedSeries({
      seed: 89,
      base: 0.92,
      swing: 0.18,
      period: 25,
      min: 0.55,
      max: 1.45,
      decimals: 3,
    }),
  },
  {
    id: "us_dxy",
    name: "US Dollar Index (DXY)",
    category: "macro",
    description:
      "Strength of the US dollar against a basket of major reserve currencies. Lower DXY usually supports risk assets, including crypto, by easing global liquidity and lifting non-dollar denominated revenue.",
    source: "FRED",
    unit: "index",
    status: "stale",
    sentiment: "positive",
    interpretation:
      "DXY is rolling over from its 2026 highs, easing the global liquidity backdrop and supporting risk-on flows.",
    values: dailySeries({
      seed: 101,
      base: 105,
      trend: -3.5,
      volatility: 0.5,
      min: 95,
      max: 112,
      decimals: 2,
    }),
  },
  {
    id: "mvrv_zscore",
    name: "BTC MVRV Z-Score",
    category: "on_chain",
    description:
      "Standardised distance between Bitcoin's market value and realised value. High readings flag euphoric tops; low readings flag capitulation bottoms. Useful for cycle context, not for short-term timing.",
    source: "Glassnode",
    unit: "z-score",
    status: "healthy",
    sentiment: "neutral",
    interpretation:
      "MVRV is holding mid-cycle territory, indicating neither overheated euphoria nor capitulation; a healthy base for continuation.",
    values: bandedSeries({
      seed: 127,
      base: 1.6,
      swing: 0.6,
      period: 100,
      min: -0.5,
      max: 4.5,
      decimals: 2,
    }),
  },
];

const indicators = signals;
const allSignals = signals.map(({ values, ...rest }) => rest);

const outDir = path.join(__dirname, "..", "public", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "indicators.json"),
  JSON.stringify(indicators, null, 2),
);
fs.writeFileSync(
  path.join(outDir, "all_signals.json"),
  JSON.stringify(allSignals, null, 2),
);

console.log(`wrote ${indicators.length} signals`);
