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
        "relative inline-flex h-9 w-full items-center gap-2 rounded-full border border-neutral-500/70 bg-white px-2.5 text-[13px] text-ink sm:h-10 sm:w-auto sm:px-3 sm:text-small",
        "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30",
      )}
    >
      {label ? <span className="text-ink-muted">{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          "min-w-0 flex-1 appearance-none bg-transparent pr-6 outline-none",
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
