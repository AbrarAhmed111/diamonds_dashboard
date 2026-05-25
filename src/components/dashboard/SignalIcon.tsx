import {
  Activity,
  ArrowDownUp,
  ArrowLeftRight,
  BarChart2,
  BatteryCharging,
  Bitcoin,
  Coins,
  Droplet,
  DollarSign,
  Gauge,
  Globe2,
  LineChart as LineChartIcon,
  Percent,
  Scale,
  Shuffle,
  Wallet,
} from "lucide-react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface IconConfig {
  bg: string;
  ink: string;
  glyph: JSX.Element;
}

const GLYPH = "h-[18px] w-[18px] shrink-0";
const STROKE = 2.25;

function ethGlyph() {
  return (
    <svg viewBox="0 0 24 24" className={GLYPH} aria-hidden>
      <circle cx="12" cy="12" r="10" className="fill-current" />
      <path
        d="M12 4 6.5 12.4l5.5 3 5.5-3L12 4Z"
        className="fill-white opacity-90"
      />
      <path
        d="M12 16.4 6.5 13l5.5 7 5.5-7-5.5 3.4Z"
        className="fill-white opacity-70"
      />
    </svg>
  );
}

function lucideIcon(Icon: typeof Gauge) {
  return <Icon className={GLYPH} strokeWidth={STROKE} />;
}

const ICONS: Record<string, IconConfig> = {
  btc_price: {
    bg: "bg-coral-100",
    ink: "text-coral-500",
    glyph: lucideIcon(Bitcoin),
  },
  eth_price: {
    bg: "bg-indigo-100",
    ink: "text-indigo-600",
    glyph: ethGlyph(),
  },
  buying_power: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(BatteryCharging),
  },
  btc_netflow: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(ArrowLeftRight),
  },
  btc_funding_rate: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(Percent),
  },
  global_liquidity: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(Droplet),
  },
  crypto_market_sentiment: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(Gauge),
  },
  vix: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(ArrowDownUp),
  },
  stablecoin_supply: {
    bg: "bg-green-100",
    ink: "text-green-900",
    glyph: lucideIcon(DollarSign),
  },
  market_cap: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(Coins),
  },
  fear_greed: {
    bg: "bg-warning-100",
    ink: "text-warning-700",
    glyph: lucideIcon(Gauge),
  },
  long_short_ratio: {
    bg: "bg-purple-100",
    ink: "text-purple-600",
    glyph: lucideIcon(Shuffle),
  },
  btc_dominance: {
    bg: "bg-coral-100",
    ink: "text-coral-500",
    glyph: lucideIcon(Scale),
  },
  btc_rsi_14d: {
    bg: "bg-indigo-100",
    ink: "text-indigo-600",
    glyph: lucideIcon(BarChart2),
  },
  us_dxy: {
    bg: "bg-slate-100",
    ink: "text-blue-700",
    glyph: lucideIcon(Globe2),
  },
  m2_supply: {
    bg: "bg-slate-100",
    ink: "text-blue-700",
    glyph: lucideIcon(Wallet),
  },
  mvrv_zscore: {
    bg: "bg-green-100",
    ink: "text-green-900",
    glyph: lucideIcon(Activity),
  },
};

const CATEGORY_FALLBACK: Record<string, IconConfig> = {
  technical: {
    bg: "bg-indigo-100",
    ink: "text-indigo-600",
    glyph: lucideIcon(LineChartIcon),
  },
  sentiment: {
    bg: "bg-warning-100",
    ink: "text-warning-700",
    glyph: lucideIcon(Gauge),
  },
  macro: {
    bg: "bg-slate-100",
    ink: "text-blue-700",
    glyph: lucideIcon(Globe2),
  },
  on_chain: {
    bg: "bg-blue-25",
    ink: "text-blue-700",
    glyph: lucideIcon(Wallet),
  },
  market: {
    bg: "bg-green-100",
    ink: "text-green-900",
    glyph: lucideIcon(Coins),
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
  const dim = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-[8px]", dim, cfg.bg, cfg.ink)}
    >
      {cfg.glyph}
    </span>
  );
}
