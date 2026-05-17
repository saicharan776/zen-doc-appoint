import type { AppointmentStatus } from "@/lib/mock-data";

const styles: Record<AppointmentStatus | "verified" | "blocked", string> = {
  upcoming: "bg-primary-soft text-primary",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/10 text-destructive",
  pending: "bg-warning/20 text-warning-foreground",
  verified: "bg-success/15 text-success",
  blocked: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ status }: { status: keyof typeof styles }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
