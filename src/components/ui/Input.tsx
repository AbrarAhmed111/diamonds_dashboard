import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, containerClassName, leadingIcon, trailingIcon, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "group flex h-10 items-center gap-2 rounded-lg border border-neutral-500/70 bg-white px-3 text-small text-ink transition-colors",
        "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/30",
        containerClassName,
      )}
    >
      {leadingIcon ? (
        <span className="text-ink-muted shrink-0" aria-hidden>
          {leadingIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-muted",
          className,
        )}
        {...rest}
      />
      {trailingIcon ? (
        <span className="text-ink-muted shrink-0" aria-hidden>
          {trailingIcon}
        </span>
      ) : null}
    </div>
  );
});

export default Input;
