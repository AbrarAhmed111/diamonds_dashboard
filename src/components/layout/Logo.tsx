import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Pixel height; the width scales by aspect ratio. */
  height?: number;
}

export default function Logo({ className, height = 28 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Diamond Pigs"
      width={Math.round(height * 5.2)}
      height={height}
      priority
      className={cn("h-auto w-auto select-none", className)}
      style={{ height }}
    />
  );
}
