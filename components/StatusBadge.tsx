import { Badge } from "@/components/ui/badge";
import { statusLabel, type JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  const variant =
    status === "approved" || status === "delivered"
      ? "success"
      : status === "rejected"
        ? "outline"
        : status === "draft_ready"
          ? "default"
          : "secondary";

  return <Badge variant={variant}>{statusLabel(status)}</Badge>;
}
