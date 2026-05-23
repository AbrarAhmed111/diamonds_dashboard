"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import TopBar from "./TopBar";
import { useSignals } from "@/lib/data";
import { getOverallSentiment } from "@/lib/sentiment";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const { signals } = useSignals();
  const sentiment = getOverallSentiment(signals);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div data-sentiment={sentiment} className="flex min-h-screen w-full text-ink">
      <div className="hidden md:block md:w-[240px] md:shrink-0">
        <div className="sticky top-0 h-screen">
          <Sidebar />
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
