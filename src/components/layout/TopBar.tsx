"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  PanelLeft,
  RefreshCcw,
} from "lucide-react";
import { useSignals } from "@/lib/data";
import Avatar from "@/components/ui/Avatar";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onOpenMenu?: () => void;
}

export default function TopBar({ title, subtitle, onOpenMenu }: TopBarProps) {
  const { refresh, isLoading } = useSignals();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="px-4 pt-4 sm:px-5 sm:pt-5 md:px-10 md:pt-9">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <Logo />
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition-colors duration-fast ease-standard hover:bg-white focus-ring"
          aria-label="Open navigation"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-page-title">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-body-responsive text-ink-muted">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div ref={ref} className="relative ml-auto hidden md:flex">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border border-neutral-500/40 bg-white py-1 pl-1 pr-3 text-small font-medium text-ink shadow-card transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring",
            )}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <Avatar
              initials="OW"
              className="bg-negative-50 text-negative-500 shadow-none"
            />
            <span className="hidden sm:inline">Account</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-ink-muted transition-transform duration-fast ease-standard",
                open && "rotate-180",
              )}
            />
          </button>

          {open ? (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-3xl border border-neutral-500/40 bg-white shadow-card"
            >
              <div className="border-b border-neutral-500/40 p-3">
                <p className="text-small font-medium text-ink">Owen Wilson</p>
                <p className="text-caption text-ink-muted">
                  owen@diamondpigs.demo
                </p>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    refresh();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-small text-ink hover:bg-neutral-400 focus-ring"
                >
                  <RefreshCcw
                    className={cn(
                      "h-4 w-4",
                      isLoading && "animate-spin",
                    )}
                  />
                  Refresh data
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
