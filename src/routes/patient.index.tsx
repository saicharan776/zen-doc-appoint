import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser } from "@/lib/supabase";

import { Calendar, FileText, Search, Stethoscope, ArrowRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { getPatientOverview } from "@/lib/supabase-queries";

export const Route = createFileRoute("/patient/")({
  head: () => ({
    meta: [{ title: "Patient dashboard — MediCare Connect" }],
  }),

  component: PatientOverview,
});

function PatientOverview() {
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

  const { isAuthenticated, user } = useProtectedRoute({
    allowedRoles: ["patient"],
    redirectTo: "/login",
  });

  const { data } = useQuery({
    queryKey: ["patient-overview", user?.id],

    queryFn: async () => {
      if (!user?.id) {
        return {
          appointments: [],
          prescriptions: [],
          recommendedDoctors: [],
          counts: {
            upcoming: 0,
            completed: 0,
            prescriptions: 0,
          },
        };
      }

      const { appointments, prescriptions, recommendedDoctors, counts, error } =
        await getPatientOverview(user.id);

      if (error) throw error;

      return {
        appointments,
        prescriptions,
        recommendedDoctors,
        counts,
      };
    },

    enabled: !!user?.id,
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

  const appointments = data?.appointments ?? [];

  const upcoming = appointments.filter((a: any) => a.status === "upcoming");

  const completed = appointments.filter((a: any) => a.status === "completed");

  const stats = [
    {
      i: Calendar,
      l: "Upcoming",
      v: data?.counts.upcoming ?? upcoming.length,
      c: "text-primary bg-primary-soft",
    },

    {
      i: Stethoscope,
      l: "Past visits",
      v: data?.counts.completed ?? completed.length,
      c: "text-accent bg-accent/15",
    },

    {
      i: FileText,
      l: "Prescriptions",
      v: data?.counts.prescriptions ?? 0,
      c: "text-success bg-success/15",
    },
  ];

  const recommended = data?.recommendedDoctors ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-medical-gradient p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Hi {userName}, how are you feeling today?
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">Here's a quick look at your care.</p>
          </div>

          <Button asChild size="lg" className="shadow-soft">
            <Link to="/doctors">
              <Search className="size-4" />
              Book new appointment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
