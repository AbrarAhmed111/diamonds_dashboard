"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Layers3,
  LayoutDashboard,
  LineChart,
  PanelLeft,
  Search,
  Shield,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Input from "@/components/ui/Input";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
  match?: (pathname: string) => boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const MEMBERS_URL = "http://members.diamondpigs.com/";

const CRYPTO_UPDATES_URL =
  "https://youtube.com/playlist?list=PLBseDg6N6kOnj9Fwtzc4531DR-s_b7UBN&si=VbOgZN1cbUjFAmjq";
const BITCOIN_PROTECT_URL =
  "https://www.diamondpigs.com/investment-strategies/crypto-active/bitcoin-protect";
const TOP_10_CRYPTO_INDEX_URL =
  "https://www.diamondpigs.com/investment-strategies/crypto-index/top-10-crypto-index";

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: MEMBERS_URL, label: "Dashboard", icon: LayoutDashboard, external: true },
      { href: MEMBERS_URL, label: "Connect Your Exchange", icon: Briefcase, external: true },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        href: "/",
        label: "Sentiment",
        icon: LineChart,
        match: (pathname) => pathname === "/",
      },
      {
        href: CRYPTO_UPDATES_URL,
        label: "Crypto Updates in 60 Seconds",
        icon: Youtube,
        external: true,
      },
    ],
  },
  {
    label: "Investment Strategies",
    items: [
      {
        href: BITCOIN_PROTECT_URL,
        label: "Bitcoin Protect Strategy",
        icon: Shield,
        external: true,
      },
      {
        href: TOP_10_CRYPTO_INDEX_URL,
        label: "Top 10 Crypto Index",
        icon: Layers3,
        external: true,
      },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname() ?? "/";

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-neutral-500/40 bg-white",
        collapsed ? "overflow-hidden" : "",
      )}
      aria-label="Primary"
    >
      <div
        className={cn(
          "flex items-center p-5",
          collapsed ? "justify-center px-2" : "justify-between gap-3",
        )}
      >
        {!collapsed ? <Logo src="/dp logo.svg" /> : null}

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring"
            aria-label="Close sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        ) : onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <PanelLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <div className="px-4">
          <Input
            type="search"
            placeholder="Search"
            aria-label="Search"
            leadingIcon={<Search className="h-4 w-4" />}
            trailingIcon={
              <kbd className="grid h-7 min-w-[24px] place-items-center rounded-[4px] border border-neutral-500/70 bg-neutral-500/50 px-1 text-caption font-medium text-ink-muted">
                /
              </kbd>
            }
          />
        </div>
      ) : (
        <div className="flex justify-center px-2">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="grid h-10 w-10 place-items-center rounded-[4px] border border-neutral-500/70 text-caption text-ink-muted transition-colors hover:bg-neutral-400 focus-ring"
            aria-label="Search"
          >
            <Search className="h-3 w-3" />
          </button>
        </div>
      )}

      <nav
        className={cn(
          "mt-6 flex-1 space-y-6 overflow-y-auto pb-4",
          collapsed ? "px-2" : "px-5",
        )}
      >
        {SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <p className="px-1 pb-2 text-small text-ink-muted">{section.label}</p>
            ) : null}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = item.external
                  ? false
                  : item.match
                    ? item.match(pathname)
                    : item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                const Icon = item.icon;
                const className = cn(
                  "flex items-center rounded text-small transition-colors duration-fast ease-standard focus-ring",
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2",
                  active
                    ? "bg-neutral-900 font-medium text-white"
                    : "text-ink hover:bg-neutral-400",
                );
                const content = collapsed ? (
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                ) : (
                  <span>{item.label}</span>
                );

                return (
                  <li key={`${item.label}-${item.href}`}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className={className}
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={className}
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

    </aside>
  );
}
