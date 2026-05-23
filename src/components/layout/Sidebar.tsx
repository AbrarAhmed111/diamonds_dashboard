"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, PanelLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import Input from "@/components/ui/Input";

interface NavItem {
  href: string;
  label: string;
  /** When true, render as an external `<a>` opened in a new tab. */
  external?: boolean;
  /** Treat additional pathnames as belonging to this nav item. */
  match?: (pathname: string) => boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const MEMBERS_URL = "http://members.diamondpigs.com/";

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: MEMBERS_URL, label: "Dashboard", external: true },
      { href: MEMBERS_URL, label: "Portfolio", external: true },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        href: "/",
        label: "Sentiment",
        match: (pathname) =>
          pathname === "/" ||
          pathname.startsWith("/signals") ||
          pathname.startsWith("/settings"),
      },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname() ?? "/";

  return (
    <aside
      className="flex h-full w-full flex-col bg-white border-r border-neutral-500/40"
      aria-label="Primary"
    >
      <div className="flex items-center justify-between p-5">
        <Logo />
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring"
            aria-label="Close sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="px-4">
        <Input
          type="search"
          placeholder="Search"
          aria-label="Search"
          leadingIcon={<Search className="h-4 w-4" />}
          trailingIcon={
            <kbd className="grid h-6 min-w-[22px] place-items-center rounded-md border border-neutral-500/70 bg-white px-1 text-[12px] font-medium text-ink-muted">
              /
            </kbd>
          }
        />
      </div>

      <nav className="mt-6 flex-1 space-y-6 overflow-y-auto px-5 pb-4">
        {SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-1 pb-2 text-small text-ink-muted">{section.label}</p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = item.external
                  ? false
                  : item.match
                    ? item.match(pathname)
                    : item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                const className = cn(
                  "flex items-center rounded-lg px-3 py-2 text-small transition-colors duration-fast ease-standard focus-ring",
                  active
                    ? "bg-neutral-900 font-medium text-white"
                    : "text-ink hover:bg-neutral-400",
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
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={className}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-negative-100 bg-white px-5 py-3 text-[16px] font-medium text-negative-700 transition-colors duration-fast ease-standard hover:bg-negative-50 focus-ring"
        >
          <LogOut className="h-5 w-5" strokeWidth={2.25} />
          Log out
        </button>
      </div>
    </aside>
  );
}
