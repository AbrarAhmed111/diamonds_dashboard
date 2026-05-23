import {
  Activity,
  ArrowDownUp,
  BarChart2,
  Coins,
  Compass,
  Droplet,
  DollarSign,
  Flame,
  Gauge,
  Globe2,
  LineChart as LineChartIcon,
  Percent,
  Scale,
  Shuffle,
  Wallet,
  Zap,
} from "lucide-react";
import type { JSX } from "react";

interface IconConfig {
  bg: string;
  ink: string;
  glyph: JSX.Element;
}

function bitcoinGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        d="M14.4 11.4c.7-.5 1-1.2 1-2.1 0-1.5-1.1-2.6-3.2-2.7V5h-1.2v1.6h-.8V5H9v1.6H7v1.4h.9c.4 0 .5.1.5.4v6.2c0 .3-.1.4-.5.4H7v1.4h2v1.6h1.2v-1.6h.8V18h1.2v-1.6c2.2-.1 3.5-1 3.5-2.7 0-1.2-.7-2-2.3-2.3Zm-3.5-3.7c.9 0 2.6.1 2.6 1.3 0 .9-.7 1.3-1.6 1.4h-1V7.7Zm0 7c.9 0 2.7.1 2.7 1.4 0 1.1-1.4 1.3-2.3 1.3h-.4v-2.7Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function ethGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M12 4 6.5 12.4l5.5 3 5.5-3L12 4Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M12 16.4 6.5 13l5.5 7 5.5-7-5.5 3.4Z" fill="#FFFFFF" opacity="0.7" />
    </svg>
  );
}

const ICONS: Record<string, IconConfig> = {
  btc_price: {
    bg: "bg-[#FBE6D8]",
    ink: "text-[#F08F47]",
    glyph: bitcoinGlyph(),
  },
  eth_price: {
    bg: "bg-[#E2E5F4]",
    ink: "text-[#5A6BB8]",
    glyph: ethGlyph(),
  },
  buying_power: {
    bg: "bg-[#DDECFB]",
    ink: "text-blue-600",
    glyph: <Zap className="h-4 w-4" fill="currentColor" />,
  },
  btc_netflow: {
    bg: "bg-[#DDECFB]",
    ink: "text-blue-600",
    glyph: <ArrowDownUp className="h-4 w-4" />,
  },
  btc_funding_rate: {
    bg: "bg-[#E2E5F4]",
    ink: "text-[#5A6BB8]",
    glyph: <Percent className="h-4 w-4" />,
  },
  global_liquidity: {
    bg: "bg-[#DDECFB]",
    ink: "text-blue-600",
    glyph: <Droplet className="h-4 w-4" />,
  },
  crypto_market_sentiment: {
    bg: "bg-[#FFF1DA]",
    ink: "text-[#C9882B]",
    glyph: <Compass className="h-4 w-4" />,
  },
  vix: {
    bg: "bg-[#E2F3D6]",
    ink: "text-green-800",
    glyph: <Flame className="h-4 w-4" />,
  },
  stablecoin_supply: {
    bg: "bg-[#E2F3D6]",
    ink: "text-green-800",
    glyph: <DollarSign className="h-4 w-4" />,
  },
  market_cap: {
    bg: "bg-[#DDECFB]",
    ink: "text-blue-600",
    glyph: <Coins className="h-4 w-4" />,
  },
  fear_greed: {
    bg: "bg-[#FFF1DA]",
    ink: "text-[#C9882B]",
    glyph: <Gauge className="h-4 w-4" />,
  },
  long_short_ratio: {
    bg: "bg-[#EAE0F5]",
    ink: "text-[#7B5BB6]",
    glyph: <Shuffle className="h-4 w-4" />,
  },
  btc_dominance: {
    bg: "bg-[#FBE6D8]",
    ink: "text-[#F08F47]",
    glyph: <Scale className="h-4 w-4" />,
  },
  btc_rsi_14d: {
    bg: "bg-[#E2E5F4]",
    ink: "text-[#5A6BB8]",
    glyph: <BarChart2 className="h-4 w-4" />,
  },
  us_dxy: {
    bg: "bg-[#E5EBF2]",
    ink: "text-blue-700",
    glyph: <Globe2 className="h-4 w-4" />,
  },
  m2_supply: {
    bg: "bg-[#E5EBF2]",
    ink: "text-blue-700",
    glyph: <Wallet className="h-4 w-4" />,
  },
  mvrv_zscore: {
    bg: "bg-[#E2F3D6]",
    ink: "text-green-800",
    glyph: <Activity className="h-4 w-4" />,
  },
};

const CATEGORY_FALLBACK: Record<string, IconConfig> = {
  technical: {
    bg: "bg-[#E2E5F4]",
    ink: "text-[#5A6BB8]",
    glyph: <LineChartIcon className="h-4 w-4" />,
  },
  sentiment: {
    bg: "bg-[#FFF1DA]",
    ink: "text-[#C9882B]",
    glyph: <Gauge className="h-4 w-4" />,
  },
  macro: {
    bg: "bg-[#E5EBF2]",
    ink: "text-blue-700",
    glyph: <Globe2 className="h-4 w-4" />,
  },
  on_chain: {
    bg: "bg-[#DDECFB]",
    ink: "text-blue-600",
    glyph: <Wallet className="h-4 w-4" />,
  },
  market: {
    bg: "bg-[#E2F3D6]",
    ink: "text-green-800",
    glyph: <Coins className="h-4 w-4" />,
  },
};

export default function SignalIcon({
  id,
  category,
  size = "md",
}: {
  id: string;
  category: string;
  size?: "sm" | "md";
}) {
  const cfg = ICONS[id] ?? CATEGORY_FALLBACK[category] ?? CATEGORY_FALLBACK.technical;
  const dim = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return (
    <span
      aria-hidden
      className={`grid ${dim} place-items-center rounded-full ${cfg.bg} ${cfg.ink}`}
    >
      {cfg.glyph}
    </span>
  );
}
