import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getStatusLabel } from "@/lib/sentiment";
import type { SignalStatus } from "@/lib/types";

const TONE: Record<SignalStatus, "positive" | "warning" | "negative" | "muted"> = {
  healthy: "positive",
  stale: "warning",
  error: "negative",
  unknown: "muted",
};

const ICON: Record<SignalStatus, React.ComponentType<{ className?: string }>> = {
  healthy: CheckCircle2,
  stale: AlertTriangle,
  error: AlertCircle,
  unknown: HelpCircle,
};

export default function StatusBadge({ status }: { status?: SignalStatus }) {
  const s: SignalStatus = status ?? "unknown";
  const Icon = ICON[s];
  return (
    <Badge tone={TONE[s]} icon={<Icon className="h-3 w-3" />}>
      {getStatusLabel(s)}
    </Badge>
  );
}
