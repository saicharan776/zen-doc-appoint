import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, BadgeCheck } from "lucide-react";
import { getDoctorByUserId } from "@/lib/supabase-queries";

export const Route = createFileRoute("/doctor/profile")({
  head: () => ({ meta: [{ title: "Doctor profile — MediCare Connect" }] }),
  component: DoctorProfilePage,
});

function DoctorProfilePage() {
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["doctor-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await getDoctorByUserId(user.id);

      if (error) throw error;

      return data;
    },
    enabled: !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Camera className="size-12 text-muted-foreground" />

        <h3 className="mt-4 text-lg font-semibold">Please sign in</h3>

        <p className="mt-1 text-sm text-muted-foreground">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Camera className="size-12 text-muted-foreground" />

        <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const specialization =
    typeof data.specialization === "object"
      ? data.specialization?.name || "General"
      : data.specialization || "General";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My profile</h1>

        <p className="text-sm text-muted-foreground">
          This is what patients see when they view your profile
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="relative mx-auto size-28">
            <img
              src={data.avatar || "https://via.placeholder.com/150"}
              alt={data.name}
              className="size-full rounded-2xl object-cover"
            />

            <button className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border border-border bg-card shadow-soft">
              <Camera className="size-4" />
            </button>
          </div>

          <p className="mt-4 text-base font-semibold">{data.name}</p>

          <p className="text-xs text-muted-foreground">{specialization}</p>

          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-semibold text-success">
            <BadgeCheck className="size-3" />
            Verified
          </span>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Professional details</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input defaultValue={data.name} />
              </div>

              <div className="space-y-1.5">
                <Label>Specialization</Label>
                <Input defaultValue={specialization} />
              </div>

              <div className="space-y-1.5">
                <Label>Qualifications</Label>
                <Input defaultValue={data.qualifications} />
              </div>

              <div className="space-y-1.5">
                <Label>Experience (years)</Label>
                <Input type="number" defaultValue={data.experience} />
              </div>

              <div className="space-y-1.5">
                <Label>Consultation fee (₹)</Label>
                <Input type="number" defaultValue={data.fee} />
              </div>

              <div className="space-y-1.5">
                <Label>Registration #</Label>

                <Input placeholder="MCI/12345" defaultValue={data.registration_number ?? ""} />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label>Bio</Label>

              <Textarea rows={5} defaultValue={data.bio ?? ""} />
            </div>

            <div className="mt-6 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
