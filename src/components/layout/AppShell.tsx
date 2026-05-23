"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import { useSignals } from "@/lib/data";
import { getOverallSentiment } from "@/lib/sentiment";
import { cn } from "@/lib/utils";

const SIDEBAR_STORAGE_KEY = "dp-sidebar-collapsed";

function readCollapsedPreference() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const { signals } = useSignals();
  const sentiment = getOverallSentiment(signals);
  const [navOpen, setNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsedPreference);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      // Ignore storage write errors in restricted environments.
    }
  }, [sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  return (
    <div data-sentiment={sentiment} className="flex min-h-screen w-full bg-surface-canvas text-ink">
      <div
        className={cn(
          "hidden shrink-0 md:block",
          sidebarCollapsed ? "md:w-[72px]" : "md:w-[240px]",
        )}
      >
        <div className="sticky top-0 h-screen">
          <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} />
        </div>
      </div>

      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          onOpenMenu={() => setNavOpen(true)}
        />
        <main className="flex-1 px-5 pb-14 pt-6 md:px-10 md:pt-8">{children}</main>
      </div>
    </div>
  );
}
