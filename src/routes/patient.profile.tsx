import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/patient/profile")({
  head: () => ({ meta: [{ title: "Profile — MediCare Connect" }] }),
  component: PatientProfilePage,
});

function PatientProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal and medical information
        </p>
      </div>

      <form className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <div className="relative mx-auto size-28">
            <div className="flex size-full items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
              RS
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-card border border-border shadow-soft"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <p className="mt-4 text-base font-semibold">Riya Sharma</p>
          <p className="text-xs text-muted-foreground">Patient since Jan 2026</p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Personal details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input defaultValue="Riya Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" defaultValue="riya@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <Label>Date of birth</Label>
                <Input type="date" defaultValue="1995-04-12" />
              </div>
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input defaultValue="Bandra West, Mumbai" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Medical history</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Blood group</Label>
                <Input defaultValue="O+" />
              </div>
              <div className="space-y-1.5">
                <Label>Allergies</Label>
                <Input placeholder="e.g. Penicillin" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Existing conditions</Label>
                <Textarea rows={3} placeholder="Any chronic conditions, recent surgeries…" />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
