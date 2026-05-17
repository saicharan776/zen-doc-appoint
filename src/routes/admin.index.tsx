import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Stethoscope, Calendar, BadgeCheck } from "lucide-react";
import { getAdminStats } from "@/lib/supabase-queries";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin analytics — MediCare Connect" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const {
    data: stats = { totalPatients: 0, totalDoctors: 0, appointmentsToday: 0, pendingApprovals: 0 },
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data, error } = await getAdminStats();
      if (error) throw error;
      return (
        data ?? { totalPatients: 0, totalDoctors: 0, appointmentsToday: 0, pendingApprovals: 0 }
      );
    },
  });

  const monthlyAppointments = [
    { m: "Dec", v: 1820 },
    { m: "Jan", v: 2104 },
    { m: "Feb", v: 2390 },
    { m: "Mar", v: 2750 },
    { m: "Apr", v: 3120 },
    { m: "May", v: 3580 },
  ];

  const specializationSplit = [
    { name: "Cardiology", value: 22 },
    { name: "Pediatrics", value: 18 },
    { name: "Dermatology", value: 14 },
    { name: "Orthopedics", value: 12 },
    { name: "Other", value: 34 },
  ];

  const statsDisplay = [
    {
      i: Users,
      l: "Total patients",
      v: stats.totalPatients.toLocaleString(),
      c: "text-primary bg-primary-soft",
    },
    { i: Stethoscope, l: "Verified doctors", v: stats.totalDoctors, c: "text-accent bg-accent/15" },
    {
      i: Calendar,
      l: "Appointments today",
      v: stats.appointmentsToday,
      c: "text-success bg-success/15",
    },
    {
      i: BadgeCheck,
      l: "Pending approvals",
      v: stats.pendingApprovals,
      c: "text-warning-foreground bg-warning/30",
    },
  ];

  const max = Math.max(...monthlyAppointments.map((m) => m.v));
  const total = specializationSplit.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const colors = [
    "oklch(0.62 0.12 195)",
    "oklch(0.70 0.14 175)",
    "oklch(0.60 0.13 230)",
    "oklch(0.78 0.15 75)",
    "oklch(0.65 0.18 320)",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform analytics</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your healthcare platform at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsDisplay.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className={`flex size-10 items-center justify-center rounded-xl ${s.c}`}>
              <s.i className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-bold">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold">Monthly appointments</h2>
          <div className="mt-6 flex h-56 items-end gap-3">
            {monthlyAppointments.map((m) => (
              <div key={m.m} className="flex flex-1 flex-col items-center gap-2">
                <p className="text-[10px] font-semibold">{m.v}</p>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary to-accent"
                  style={{ height: `${(m.v / max) * 100}%` }}
                />
                <p className="text-xs text-muted-foreground">{m.m}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold">By specialization</h2>
          <div className="mt-4 flex items-center gap-6">
            <svg viewBox="0 0 36 36" className="size-32 -rotate-90">
              {specializationSplit.map((s, i) => {
                const len = (s.value / total) * 100;
                const dasharray = `${len} ${100 - len}`;
                const offset = -acc;
                acc += len;
                return (
                  <circle
                    key={s.name}
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke={colors[i]}
                    strokeWidth="6"
                    strokeDasharray={dasharray}
                    strokeDashoffset={offset}
                  />
                );
              })}
            </svg>
            <ul className="flex-1 space-y-2 text-xs">
              {specializationSplit.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-sm" style={{ background: colors[i] }} />{" "}
                    {s.name}
                  </span>
                  <span className="font-semibold">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
