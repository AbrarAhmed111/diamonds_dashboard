import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number;
  src?: string;
}

const LOGO_ASPECT: Record<string, number> = {
  "/dp logo.svg": 102 / 27,
};

export default function Logo({ className, height = 28, src = "/logo.png" }: LogoProps) {
  const aspect = LOGO_ASPECT[src] ?? 5.2;

  return (
    <Image
      src={src}
      alt="Diamond Pigs"
      width={Math.round(height * aspect)}
      height={height}
      priority
      className={cn("h-auto w-auto select-none", className)}
      style={{ height }}
    />
  );
}
