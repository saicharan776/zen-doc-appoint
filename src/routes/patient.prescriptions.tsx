import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText, Download, Pill, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getPatientPrescriptions } from "@/lib/supabase-queries";

export const Route = createFileRoute("/patient/prescriptions")({
  head: () => ({ meta: [{ title: "Prescriptions — MediCare Connect" }] }),
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["patient-prescriptions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await getPatientPrescriptions(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <FileText className="size-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Please sign in</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You need to be logged in to view prescriptions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <p className="text-sm text-muted-foreground">
          All medication and care notes from your doctors
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <Loader2 className="size-12 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <FileText className="size-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No prescriptions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your prescriptions will appear here after consultations.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((p: any) => (
            <article
              key={p.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    <h3 className="text-lg font-semibold">{p.diagnosis}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Issued by {p.doctor_name} ·{" "}
                    {new Date(p.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5" /> Download PDF
                </Button>
              </div>

              <div className="mt-5 grid gap-2.5">
                {p.medicines && Array.isArray(p.medicines) ? (
                  p.medicines.map((m: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-3"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-card">
                        <Pill className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Dose {m.dose} · {m.duration}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No medicines recorded</p>
                )}
              </div>

              {p.notes && (
                <div className="mt-4 rounded-xl border border-dashed border-border p-4">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Doctor's notes
                  </p>
                  <p className="mt-1 text-sm">{p.notes}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
