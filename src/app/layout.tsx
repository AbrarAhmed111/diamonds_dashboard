import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter_Tight } from "next/font/google";
import "../assets/css/globals.css";
import { SignalsProvider } from "@/lib/data";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diamond Pigs Signals Dashboard",
  description:
    "A pixel-perfect proof-of-concept dashboard for the Diamond Pigs Signals platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={interTight.variable}>
      <body suppressHydrationWarning className="antialiased">
        <SignalsProvider>{children}</SignalsProvider>
      </body>
    </html>
  );
}
