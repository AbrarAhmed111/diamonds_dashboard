import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-colors duration-fast ease-standard disabled:opacity-50 disabled:cursor-not-allowed focus-ring";

const variants: Record<Variant, string> = {
  primary:
    "bg-neutral-900 text-white hover:bg-black active:bg-neutral-900/95",
  secondary:
    "bg-white text-neutral-900 border border-neutral-500/60 hover:border-neutral-700 hover:bg-neutral-400",
  outline:
    "bg-transparent text-neutral-900 border border-neutral-500 hover:bg-white",
  ghost: "text-neutral-800 hover:bg-neutral-400",
  danger:
    "bg-white text-negative-700 border border-negative-100 hover:bg-negative-50 active:border-negative-500",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-btn-sm",
  md: "h-10 px-4 text-btn-sm",
  lg: "h-12 px-6 text-btn-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
});

export default Button;
