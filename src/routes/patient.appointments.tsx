import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Calendar, X, Clock, Plus, Loader2 } from "lucide-react";
import { type AppointmentStatus } from "@/lib/mock-data";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getPatientAppointments } from "@/lib/supabase-queries";

export const Route = createFileRoute("/patient/appointments")({
  head: () => ({
    meta: [{ title: "My Appointments — MediCare Connect" }],
  }),

  component: AppointmentsPage,
});

const tabs: { k: "all" | AppointmentStatus; label: string }[] = [
  { k: "all", label: "All" },
  { k: "upcoming", label: "Upcoming" },
  { k: "completed", label: "Completed" },
  { k: "cancelled", label: "Cancelled" },
];

function AppointmentsPage() {
  const { isAuthenticated, user } = useProtectedRoute({
    allowedRoles: ["patient"],
    redirectTo: "/login",
  });

  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("all");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["patient-appointments", user?.id],

    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await getPatientAppointments(user.id);

      if (error) throw error;

      return data || [];
    },

    enabled: !!user?.id,
  });

  const list = tab === "all" ? appointments : appointments.filter((a: any) => a.status === tab);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Calendar className="size-12 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">Please sign in</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          You need to be logged in to view appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My appointments</h1>

          <p className="text-sm text-muted-foreground">
            Manage upcoming visits and view your history
          </p>
        </div>

        <Button asChild>
          <Link to="/doctors">
            <Plus className="size-4" />
            Book new
          </Link>
        </Button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              tab === t.k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <Loader2 className="size-12 animate-spin text-muted-foreground" />

          <p className="mt-4 text-sm text-muted-foreground">Loading appointments...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <Calendar className="size-12 text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">No appointments</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            When you book a visit it'll show up here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {list.map((a: any) => {
            const specialization =
              typeof a.specialization === "object"
                ? a.specialization?.name || "General"
                : a.specialization || "General";

            return (
              <article
                key={a.id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center"
              >
                <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-soft">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                    {a.appointment_date
                      ? new Date(a.appointment_date).toLocaleDateString("en-IN", {
                          month: "short",
                        })
                      : ""}
                  </p>

                  <p className="text-xl font-bold text-primary">
                    {a.appointment_date ? new Date(a.appointment_date).getDate() : ""}
                  </p>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold">{a.doctor_name ?? "Doctor"}</h3>

                    <StatusBadge status={a.status} />
                  </div>

                  <p className="mt-0.5 text-xs text-muted-foreground">{specialization}</p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {a.appointment_time ?? ""}
                    </span>

                    <span>· {a.reason}</span>

                    <span>· ₹{a.fee}</span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  {a.status === "upcoming" && (
                    <>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="size-3.5" />
                        Cancel
                      </Button>
                    </>
                  )}

                  {a.status === "completed" && (
                    <Button variant="outline" size="sm">
                      View prescription
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
