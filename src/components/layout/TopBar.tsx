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

function AccountDropdownMenu({
  onRefresh,
  isLoading,
  onClose,
}: {
  onRefresh: () => void;
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-3xl border border-neutral-500/40 bg-white shadow-card sm:w-56"
    >
      <div className="border-b border-neutral-500/40 p-3">
        <p className="text-small font-medium text-ink">Owen Wilson</p>
        <p className="text-caption text-ink-muted">owen@diamondpigs.demo</p>
      </div>
      <div className="p-1">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            onClose();
            onRefresh();
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-small text-ink hover:bg-neutral-400 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            className={cn("h-4 w-4", isLoading && "animate-spin")}
          />
          Refresh data
        </button>
      </div>
    </div>
  );
}

export default function TopBar({ title, subtitle, onOpenMenu }: TopBarProps) {
  const { refresh, isLoading } = useSignals();
  const [open, setOpen] = useState(false);
  const mobileAccountRef = useRef<HTMLDivElement>(null);
  const desktopAccountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        mobileAccountRef.current?.contains(target) ||
        desktopAccountRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
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

  const handleRefresh = () => void refresh();

  return (
    <header className="px-4 pt-4 sm:px-5 sm:pt-5 md:px-10 md:pt-9">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <div ref={mobileAccountRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-500/40 bg-white text-ink shadow-card transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Account"
            >
              <Avatar
                initials="OW"
                className="h-6 w-6 bg-negative-50 text-[10px] font-medium text-negative-500 shadow-none"
              />
            </button>
            {open ? (
              <AccountDropdownMenu
                isLoading={isLoading}
                onRefresh={handleRefresh}
                onClose={() => setOpen(false)}
              />
            ) : null}
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted transition-colors duration-fast ease-standard hover:bg-white focus-ring"
            aria-label="Open navigation"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-page-title">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-body-responsive text-ink-muted">{subtitle}</p>
          ) : null}
        </div>

        <div ref={desktopAccountRef} className="relative ml-auto hidden md:block">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-md border border-neutral-500/40 bg-white py-1 pl-1 pr-3 text-ink shadow-card transition-colors duration-fast ease-standard hover:bg-neutral-400 focus-ring"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <Avatar
              initials="OW"
              className="bg-negative-50 text-caption font-medium text-negative-500 shadow-none"
            />
            <span className="text-small font-medium">Account</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-ink-muted transition-transform duration-fast ease-standard",
                open && "rotate-180",
              )}
            />
          </button>

          {open ? (
            <AccountDropdownMenu
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onClose={() => setOpen(false)}
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
