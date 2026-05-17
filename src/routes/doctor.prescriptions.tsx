import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText, Send } from "lucide-react";

export const Route = createFileRoute("/doctor/prescriptions")({
  head: () => ({ meta: [{ title: "Write prescription — MediCare Connect" }] }),
  component: WritePrescriptionPage,
});

interface Med {
  id: string;
  name: string;
  dose: string;
  duration: string;
}

function WritePrescriptionPage() {
  const [meds, setMeds] = useState<Med[]>([{ id: "1", name: "", dose: "", duration: "" }]);
  const add = () =>
    setMeds([...meds, { id: String(Date.now()), name: "", dose: "", duration: "" }]);
  const update = (id: string, k: keyof Med, v: string) =>
    setMeds(meds.map((m) => (m.id === id ? { ...m, [k]: v } : m)));
  const remove = (id: string) => setMeds(meds.filter((m) => m.id !== id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Write prescription</h1>
        <p className="text-sm text-muted-foreground">
          Issue a digital prescription for your patient
        </p>
      </div>

      <form className="grid gap-6 lg:grid-cols-[1fr_320px]" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Patient & diagnosis</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Patient</Label>
                <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Rahul Sen</option>
                  <option>Meera Pillai</option>
                  <option>Aditya Joshi</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Diagnosis</Label>
                <Input placeholder="e.g. Hypertension stage 1" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Medications</h2>
              <Button type="button" size="sm" variant="outline" onClick={add}>
                <Plus className="size-3.5" /> Add medicine
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              {meds.map((m, i) => (
                <div
                  key={m.id}
                  className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-[1fr_100px_120px_auto]"
                >
                  <Input
                    placeholder={`Medicine ${i + 1}`}
                    value={m.name}
                    onChange={(e) => update(m.id, "name", e.target.value)}
                  />
                  <Input
                    placeholder="1-0-1"
                    value={m.dose}
                    onChange={(e) => update(m.id, "dose", e.target.value)}
                  />
                  <Input
                    placeholder="5 days"
                    value={m.duration}
                    onChange={(e) => update(m.id, "duration", e.target.value)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => remove(m.id)}
                    aria-label="Remove medicine"
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-base font-semibold">Notes & follow-up</h2>
            <Textarea
              rows={4}
              className="mt-3"
              placeholder="Lifestyle advice, follow-up instructions, lab tests…"
            />
          </section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <FileText className="size-5 text-primary" />
            <h3 className="mt-2 text-base font-semibold">Preview</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A PDF will be generated and shared with the patient.
            </p>
            <Button className="mt-4 w-full">
              <Send className="size-4" /> Issue prescription
            </Button>
            <Button variant="outline" className="mt-2 w-full">
              Save draft
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}
