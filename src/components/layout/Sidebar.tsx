"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutDashboard,
  LineChart,
  LogOut,
  PanelLeft,
  Search,
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

const SECTIONS: NavSection[] = [
  {
    label: "Overview",
    items: [
      { href: MEMBERS_URL, label: "Dashboard", icon: LayoutDashboard, external: true },
      { href: MEMBERS_URL, label: "Portfolio", icon: Briefcase, external: true },
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
        {!collapsed ? <Logo /> : null}

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
              <kbd className="grid h-7 min-w-[24px] place-items-center rounded-sm border border-neutral-500/70 bg-neutral-500/50 px-1 text-[12px] font-medium text-ink-muted">
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
            className="grid h-10 w-10 place-items-center rounded-md border border-neutral-500/70 text-ink-muted transition-colors hover:bg-neutral-400 focus-ring"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
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
                  "flex items-center rounded-lg text-small transition-colors duration-fast ease-standard focus-ring",
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

      <div className={cn("p-4", collapsed && "px-2")}>
        <button
          type="button"
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex w-full items-center justify-center border border-negative-500 bg-white font-medium text-negative-500 transition-colors duration-fast ease-standard hover:bg-negative-50 focus-ring",
            collapsed
              ? "rounded-md px-2 py-3"
              : "gap-2.5 rounded-md px-5 py-3 text-[16px]",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.25} />
          {!collapsed ? "Log out" : null}
        </button>
      </div>
    </aside>
  );
}
