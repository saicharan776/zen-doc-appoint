import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin — MediCare Connect" }] }),
  component: SettingsPage,
});

function Toggle({
  label,
  desc,
  defaultChecked = false,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <input type="checkbox" defaultChecked={defaultChecked} className="size-5 accent-primary" />
    </label>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure appointment policies and notifications
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold">Appointment policies</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Cancellation window (hours)</Label>
            <Input type="number" defaultValue={2} />
          </div>
          <div className="space-y-1.5">
            <Label>Max future booking (days)</Label>
            <Input type="number" defaultValue={30} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold">Notifications</h2>
        <div className="mt-5 space-y-3">
          <Toggle
            label="Email confirmations"
            desc="Send booking confirmation emails to patients"
            defaultChecked
          />
          <Toggle label="Reminder emails" desc="24 hours before appointment" defaultChecked />
          <Toggle label="SMS notifications" desc="Optional, requires Twilio" />
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save settings</Button>
      </div>
    </div>
  );
}
