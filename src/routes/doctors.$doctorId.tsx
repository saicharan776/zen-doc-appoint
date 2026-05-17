import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MapPin,
  BadgeCheck,
  Clock,
  IndianRupee,
  GraduationCap,
  Calendar,
  Upload,
  CheckCircle2,
} from "lucide-react";

import { sampleReviews } from "@/lib/mock-data";
import { getDoctorById } from "@/lib/supabase-queries";

export const Route = createFileRoute("/doctors/$doctorId")({
  head: () => ({
    meta: [
      { title: "Doctor profile — MediCare Connect" },
      {
        name: "description",
        content: "Doctor profile and booking page.",
      },
    ],
  }),

  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>

        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>

      <SiteFooter />
    </div>
  ),

  component: DoctorProfilePage,
});

const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri"];

const slots = [
  "09:00",
  "09:30",
  "10:00",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

function DoctorProfilePage() {
  const { doctorId } = Route.useParams();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctor", doctorId],

    queryFn: async () => {
      if (!doctorId) return null;

      const { data, error } = await getDoctorById(doctorId);

      if (error) throw error;

      return data;
    },

    enabled: !!doctorId,
  });

  const [day, setDay] = useState(0);

  const [slot, setSlot] = useState<string | null>(null);

  const [reason, setReason] = useState("");

  const [confirmed, setConfirmed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">Loading doctor profile…</p>
        </div>

        <SiteFooter />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />

        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="text-3xl font-bold">Doctor not found</h1>

          <p className="mt-2 text-muted-foreground">
            The profile you're looking for doesn't exist.
          </p>

          <Button asChild className="mt-6">
            <Link to="/doctors">Browse doctors</Link>
          </Button>
        </div>

        <SiteFooter />
      </div>
    );
  }

  const specialization =
    typeof doctor.specialization === "object"
      ? doctor.specialization?.name || "General"
      : doctor.specialization || "General";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-medical-gradient">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/doctors"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Back to all doctors
          </Link>

          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="size-28 rounded-2xl object-cover ring-4 ring-background shadow-card"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{doctor.name}</h1>

                {doctor.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                    <BadgeCheck className="size-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {specialization} · {doctor.qualifications}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-warning text-warning" />
                  <b>{doctor.rating}</b> · {doctor.reviews} reviews
                </span>

                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="size-4" />
                  {doctor.clinic}, {doctor.location}
                </span>

                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" />
                  {doctor.experience} yrs experience
                </span>

                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <IndianRupee className="size-4" />₹{doctor.fee} consultation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
