import { supabase } from "@/lib/supabase";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ShieldCheck,
  CalendarCheck,
  Stethoscope,
  Star,
  ArrowRight,
  HeartPulse,
  Clock,
  FileText,
  Bell,
  Users,
  Activity,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DoctorCard } from "@/components/doctor-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { getFeaturedDoctors, getSpecializations } from "@/lib/supabase-queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "MediCare Connect — Book trusted doctors online",
      },
      {
        name: "description",
        content:
          "Find verified doctors, book appointments instantly, and manage your healthcare in one secure platform.",
      },
    ],
  }),

  component: LandingPage,
});

function LandingPage() {
  const { data: featuredDoctors = [] } = useQuery({
    queryKey: ["featured-doctors"],

    queryFn: async () => {
      const { data } = await getFeaturedDoctors();

      return data ?? [];
    },
  });

  const { data: popularSpecializations = [] } = useQuery({
    queryKey: ["specializations"],

    queryFn: async () => {
      const { data } = await getSpecializations();

      return data ?? [];
    },
  });

  const heroDoctor = featuredDoctors[0] ?? {
    id: "",
    name: "Dr. Aanya Sharma",
    specialization: "General Medicine",
    qualifications: "MBBS",
    avatar: "https://via.placeholder.com/150",
    rating: 4.9,
    reviews: 120,
  };

  const heroSpecialization =
    typeof heroDoctor.specialization === "object"
      ? heroDoctor.specialization?.name || "General"
      : heroDoctor.specialization || "General";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-medical-gradient">
        <div className="absolute inset-0 bg-hero-grid opacity-60" aria-hidden />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-24 lg:pb-32">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1.5 text-xs font-medium text-primary backdrop-blur">
              <span className="size-1.5 rounded-full bg-success" />
              24/7 trusted care
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Your health,
              <br />
              <span className="text-gradient-medical">one tap away.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Find verified specialists, book appointments instantly and access prescriptions — all
              in one secure healthcare platform.
            </p>

            <form className="mt-8 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
                <Search className="size-4 text-muted-foreground" />

                <Input
                  placeholder="Search doctor, speciality, clinic…"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>

              <Button asChild size="lg" className="shadow-soft">
                <Link to="/doctors">
                  Find doctors
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">Popular:</span>

              {popularSpecializations.slice(0, 5).map((s: any, index: number) => (
                <Link
                  key={`${s.specialization}-${index}`}
                  to="/doctors"
                  search={{ q: s.specialization } as never}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-primary-soft"
                >
                  {s.specialization}
                </Link>
              ))}
            </div>
          </div>

          {/* Hero doctor card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-start gap-4">
                <img
                  src={heroDoctor.avatar}
                  alt={heroDoctor.name}
                  className="size-20 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-xl font-semibold">{heroDoctor.name}</h3>

                    <ShieldCheck className="size-5 text-primary" />
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {heroSpecialization} · {heroDoctor.qualifications}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Star className="size-4 fill-warning text-warning" />

                    <span className="font-semibold">{heroDoctor.rating}</span>

                    <span className="text-muted-foreground">({heroDoctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-primary-soft p-4">
                  <CalendarCheck className="size-5 text-primary" />

                  <p className="mt-3 text-sm font-semibold">Easy booking</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Schedule appointments instantly
                  </p>
                </div>

                <div className="rounded-2xl bg-secondary p-4">
                  <HeartPulse className="size-5 text-primary" />

                  <p className="mt-3 text-sm font-semibold">Trusted doctors</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Verified healthcare professionals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
