import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, Calendar, Users, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Admin — MediCare Connect" }] }),
  component: ReportsPage,
});

const reports = [
  { i: Calendar, t: "Appointments report", d: "Daily / monthly appointments breakdown", f: "CSV" },
  { i: Users, t: "User growth", d: "Patient and doctor sign-ups over time", f: "CSV" },
  { i: IndianRupee, t: "Revenue report", d: "Consultation fees by specialization", f: "PDF" },
  { i: FileBarChart, t: "Activity logs", d: "System activity and audit trail", f: "CSV" },
];

function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Export platform data for analysis and compliance
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((r) => (
          <article
            key={r.t}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <r.i className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold">{r.t}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{r.d}</p>
              <Button size="sm" variant="outline" className="mt-3">
                <Download className="size-3.5" /> Download {r.f}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
