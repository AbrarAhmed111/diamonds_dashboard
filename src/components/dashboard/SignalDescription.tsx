import { cn } from "@/lib/utils";

interface Props {
  /**
   * Description text. May contain valid HTML from the Helix API and is rendered
   * as-is. This is TRUSTED content from our own API mapper / Helix — never pass
   * user-generated or otherwise untrusted input here.
   */
  html?: string;
  className?: string;
  id?: string;
}

export default function SignalDescription({ html, className, id }: Props) {
  if (!html) return null;
  return (
    <div
      id={id}
      className={cn("signal-description text-card-body", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
