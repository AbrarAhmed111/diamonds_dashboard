import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, children, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        "relative inline-flex h-10 items-center gap-2 rounded-full border border-neutral-500/70 bg-white px-3 text-small text-ink",
        "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30",
      )}
    >
      {label ? <span className="text-ink-muted">{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          "appearance-none bg-transparent pr-6 outline-none",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-ink-muted" />
    </label>
  );
});

export default Select;
