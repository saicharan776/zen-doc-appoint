import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser } from "@/lib/supabase";

import { Calendar, Users, IndianRupee, Star, ArrowRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

import { getDoctorByUserId, getDoctorOverview } from "@/lib/supabase-queries";

export const Route = createFileRoute("/doctor/")({
  head: () => ({
    meta: [{ title: "Doctor dashboard — MediCare Connect" }],
  }),

  component: DoctorOverview,
});

function DoctorOverview() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();

      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    };

    loadUser();
  }, []);

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

  const { data: overview } = useQuery({
    queryKey: ["doctor-overview", doctorProfile?.id],

    queryFn: async () => {
      if (!doctorProfile?.id) {
        return {
          appointments: [],
          today: 0,
          upcoming: 0,
          completed: 0,
          error: null,
        };
      }

      const { appointments, today, upcoming, completed, error } = await getDoctorOverview(
        doctorProfile.id,
      );

      if (error) throw error;

      return {
        appointments,
        today,
        upcoming,
        completed,
      };
    },

    enabled: !!doctorProfile?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Calendar className="size-12 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">Please sign in</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          You need to be logged in to view your dashboard.
        </p>
      </div>
    );
  }

  const appointments = overview?.appointments ?? [];

  const today = appointments.filter(
    (a: any) => new Date(a.appointment_date || "").toDateString() === new Date().toDateString(),
  );

  const patientCount = new Set(appointments.map((a: any) => a.patient_id)).size;

  const weeklyPending = appointments.filter((a: any) => a.status === "pending").length;

  const stats = [
    {
      i: Calendar,
      l: "Today's appointments",
      v: today.length,
      c: "text-primary bg-primary-soft",
    },

    {
      i: Users,
      l: "Total patients",
      v: patientCount.toLocaleString(),
      c: "text-accent bg-accent/15",
    },

    {
      i: IndianRupee,
      l: "This month",
      v: "₹2,40,000",
      c: "text-success bg-success/15",
    },

    {
      i: Star,
      l: "Rating",
      v: doctorProfile?.rating ?? "4.9",
      c: "text-warning-foreground bg-warning/30",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Dr. {userName}</h1>

          <p className="text-sm text-muted-foreground">Here's your day at a glance</p>
        </div>

        <Button asChild>
          <Link to="/doctor/schedule">
            <Clock className="size-4" />
            Manage schedule
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className={`flex size-10 items-center justify-center rounded-xl ${s.c}`}>
              <s.i className="size-5" />
            </div>

            <p className="mt-4 text-2xl font-bold">{s.v}</p>

            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
