import { statusLabel, type JobStatus } from "@/lib/types";

const styles: Record<JobStatus, string> = {
  intake_received: "bg-slate-100 text-slate-800",
  triaged: "bg-sky-100 text-sky-900",
  draft_ready: "bg-indigo-100 text-indigo-900",
  approved: "bg-emerald-100 text-emerald-900",
  delivered: "bg-green-100 text-green-900",
  rejected: "bg-rose-100 text-rose-900",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
