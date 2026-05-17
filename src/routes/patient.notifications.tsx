import { createFileRoute } from "@tanstack/react-router";
import { Bell, Calendar, FileText, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/patient/notifications")({
  head: () => ({ meta: [{ title: "Notifications — MediCare Connect" }] }),
  component: NotificationsPage,
});

const items = [
  {
    i: BadgeCheck,
    t: "Appointment confirmed",
    d: "Dr. Aanya Sharma · 18 May, 4:30 PM",
    time: "2 hours ago",
    read: false,
    c: "text-success",
  },
  {
    i: Bell,
    t: "Reminder",
    d: "Take Paracetamol at 9:00 PM",
    time: "Today",
    read: false,
    c: "text-primary",
  },
  {
    i: FileText,
    t: "New prescription available",
    d: "Dr. Vikram Rao issued a prescription",
    time: "Yesterday",
    read: true,
    c: "text-accent",
  },
  {
    i: Calendar,
    t: "Reschedule confirmed",
    d: "Dr. Priya Nair · 22 May, 6:15 PM",
    time: "2 days ago",
    read: true,
    c: "text-primary",
  },
];

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Updates about your appointments and prescriptions
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card shadow-soft">
        {items.map((n, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 border-b border-border px-5 py-4 last:border-0 ${!n.read ? "bg-primary-soft/30" : ""}`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary ${n.c}`}
            >
              <n.i className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{n.t}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.d}</p>
            </div>
            <span className="text-[11px] text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
