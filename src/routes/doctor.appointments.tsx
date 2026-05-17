import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { Check, X, FileText, Clock } from "lucide-react";
import type { AppointmentStatus } from "@/types";
import { getDoctorByUserId, getDoctorAppointments } from "@/lib/supabase-queries";

export const Route = createFileRoute("/doctor/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Doctor — MediCare Connect" }] }),
  component: DoctorAppointmentsPage,
});

const tabs: { k: "all" | AppointmentStatus; label: string }[] = [
  { k: "all", label: "All" },
  { k: "pending", label: "Pending" },
  { k: "upcoming", label: "Confirmed" },
  { k: "completed", label: "Completed" },
];

function DoctorAppointmentsPage() {
  const { loading, isAuthenticated, user } = useProtectedRoute({
    allowedRoles: ["doctor"],
    redirectTo: "/login",
  });
  const { data: doctorProfile } = useQuery({
    queryKey: ["doctor-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await getDoctorByUserId(user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: doctorAppointments = [] } = useQuery({
    queryKey: ["doctor-appointments", doctorProfile?.id],
    queryFn: async () => {
      if (!doctorProfile?.id) return [];
      const { data, error } = await getDoctorAppointments(doctorProfile.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!doctorProfile?.id,
  });

  const [tab, setTab] = useState<(typeof tabs)[number]["k"]>("all");
  const list =
    tab === "all" ? doctorAppointments : doctorAppointments.filter((a: any) => a.status === tab);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Clock className="size-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Please sign in</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You need to be logged in to manage appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Accept, decline and follow up with your patients
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-secondary p-1">
        {tabs.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold ${tab === t.k ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary text-xs">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Patient</th>
              <th className="px-5 py-3 text-left font-semibold">Date & time</th>
              <th className="px-5 py-3 text-left font-semibold">Reason</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {(a.patient_name ?? "Patient")
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.patient_name ?? "Patient"}</p>
                      <p className="text-xs text-muted-foreground">₹{a.fee ?? 0}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-muted-foreground" />
                    {a.appointment_date
                      ? new Date(a.appointment_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                      : ""}{" "}
                    · {a.appointment_time ?? ""}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-muted-foreground">{a.reason}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    {a.status === "pending" ? (
                      <>
                        <Button size="sm">
                          <Check className="size-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="size-3.5" />
                        </Button>
                      </>
                    ) : a.status === "completed" ? (
                      <Button size="sm" variant="outline">
                        <FileText className="size-3.5" /> Notes
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        Start
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
