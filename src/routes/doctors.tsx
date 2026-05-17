import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DoctorCard } from "@/components/doctor-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, Frown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDoctors, getSpecializations } from "@/lib/supabase-queries";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Find Doctors — MediCare Connect" },
      {
        name: "description",
        content: "Search verified doctors by speciality, location, rating and consultation fee.",
      },
    ],
  }),
  component: DoctorsListPage,
});

function DoctorsListPage() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string>("All");
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await getDoctors();
      if (error) throw error;
      return data || [];
    },
  });

  const { data: specializations = [] } = useQuery({
    queryKey: ["doctor-specializations"],
    queryFn: async () => {
      const { data } = await getSpecializations();
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    return doctors.filter(
      (d: any) =>
        (spec === "All" || d.specialization === spec) &&
        d.fee <= maxFee &&
        d.rating >= minRating &&
        (!onlyAvailable || d.available) &&
        (q.trim() === "" ||
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.specialization.toLowerCase().includes(q.toLowerCase()) ||
          d.location.toLowerCase().includes(q.toLowerCase())),
    );
  }, [doctors, q, spec, maxFee, minRating, onlyAvailable]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Find your doctor</h1>
          <p className="mt-2 text-muted-foreground">
            {filtered.length} verified specialists available
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft">
            <Search className="ml-2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by doctor, speciality or city…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        {/* Filters */}
        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-20 lg:self-start">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <p className="text-sm font-semibold">Filters</p>
          </div>

          <div>
            <Label className="text-xs">Speciality</Label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {["All", ...specializations].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpec(s)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    spec === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary-soft"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Max fee — ₹{maxFee}</Label>
            <input
              type="range"
              min={500}
              max={2000}
              step={100}
              value={maxFee}
              onChange={(e) => setMaxFee(+e.target.value)}
              className="mt-2 w-full accent-primary"
            />
          </div>
          <div>
            <Label className="text-xs">Min rating — {minRating}★</Label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(+e.target.value)}
              className="mt-2 w-full accent-primary"
            />
          </div>
          <label className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5">
            <span className="text-xs font-medium">Available today</span>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="size-4 accent-primary"
            />
          </label>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setQ("");
              setSpec("All");
              setMaxFee(2000);
              setMinRating(0);
              setOnlyAvailable(false);
            }}
          >
            Reset
          </Button>
        </aside>

        {/* Results */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
              <Loader2 className="size-12 animate-spin text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Loading doctors...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
              <Frown className="size-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No doctors found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((d: any) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
