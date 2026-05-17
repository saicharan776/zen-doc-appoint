import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export const Route = createFileRoute("/doctor/schedule")({
  head: () => ({ meta: [{ title: "Schedule — Doctor — MediCare Connect" }] }),
  component: SchedulePage,
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const slots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

function SchedulePage() {
  const [available, setAvailable] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    days.forEach((d) => {
      init[d] = {};
      slots.forEach((s, i) => (init[d][s] = d !== "Sunday" && i < 8));
    });
    return init;
  });

  const toggle = (d: string, s: string) =>
    setAvailable((p) => ({ ...p, [d]: { ...p[d], [s]: !p[d][s] } }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Set your weekly availability and slot duration
          </p>
        </div>
        <Button>
          <Save className="size-4" /> Save schedule
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Label className="text-xs">Slot duration</Label>
          <select className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>15 minutes</option>
            <option>20 minutes</option>
            <option>30 minutes</option>
          </select>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Label className="text-xs">Buffer between</Label>
          <select className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option>None</option>
            <option>5 minutes</option>
            <option>10 minutes</option>
          </select>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <Label className="text-xs">Block dates</Label>
          <Input type="date" className="mt-2" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold">Weekly availability</h2>
        <p className="text-xs text-muted-foreground">Click a slot to toggle availability</p>
        <div className="mt-5 space-y-3">
          {days.map((d) => (
            <div key={d} className="grid grid-cols-[100px_1fr] items-center gap-3">
              <p className="text-sm font-semibold">{d}</p>
              <div className="flex flex-wrap gap-1.5">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(d, s)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${available[d][s] ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-primary-soft"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
