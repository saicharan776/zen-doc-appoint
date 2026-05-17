import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, X, FileText, Stethoscope } from "lucide-react";
import { getPendingDoctors } from "@/lib/supabase-queries";

export const Route = createFileRoute("/admin/doctors")({
  head: () => ({
    meta: [{ title: "Doctor approvals — Admin — MediCare Connect" }],
  }),
  component: DoctorApprovalsPage,
});

function DoctorApprovalsPage() {
  const { data: pendingDoctors = [] } = useQuery({
    queryKey: ["pending-doctors"],
    queryFn: async () => {
      const { data, error } = await getPendingDoctors();

      if (error) throw error;

      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Doctor approvals</h1>

        <p className="text-sm text-muted-foreground">
          Review submitted profiles and verify documentation
        </p>
      </div>

      <div className="grid gap-4">
        {pendingDoctors.map((d: any) => {
          const specialization =
            typeof d.specialization === "object"
              ? d.specialization?.name || "General"
              : d.specialization || "General";

          return (
            <article
              key={d.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Stethoscope className="size-5" />
                  </div>

                  <div>
                    <p className="text-base font-semibold">{d.name || "Doctor"}</p>

                    <p className="text-xs text-muted-foreground">
                      {specialization} · Submitted{" "}
                      {d.submitted
                        ? new Date(d.submitted).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="size-3.5" />
                    {d.documents || 0} documents
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <X className="size-3.5" />
                    Reject
                  </Button>

                  <Button size="sm">
                    <Check className="size-3.5" />
                    Approve
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
