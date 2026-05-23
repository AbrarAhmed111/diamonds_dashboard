"use client";

import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-40 md:hidden",
        !open && "pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-72 max-w-[85vw] shadow-card transition-transform duration-300 ease-out",
          "[&_aside]:border-r-0 [&_aside]:border-l [&_aside]:border-neutral-500/40",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <Sidebar onClose={onClose} />
      </div>
    </div>
  );
}
