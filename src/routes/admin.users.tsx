import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { getPlatformUsers } from "@/lib/supabase-queries";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin — MediCare Connect" }] }),
  component: UsersPage,
});

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await getPlatformUsers();
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = users.filter(
    (u: any) =>
      (role === "All" || u.role === role) &&
      (q === "" ||
        u.full_name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage all patients and doctors on the platform
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 rounded-xl bg-secondary p-1">
          {["All", "Patient", "Doctor"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${role === r ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary text-xs">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">User</th>
              <th className="px-5 py-3 text-left font-semibold">Role</th>
              <th className="px-5 py-3 text-left font-semibold">Joined</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u: any) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                      {u.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{u.full_name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">{u.role}</td>
                <td className="px-5 py-4 text-xs text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    status={(u.status ?? "Active") === "Active" ? "verified" : "blocked"}
                  />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button size="sm" variant="outline">
                      {u.status === "Active" ? "Block" : "Unblock"}
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="More">
                      <MoreVertical className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
