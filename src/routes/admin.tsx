import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, BadgeCheck, FileBarChart, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardLayout
      role="Admin"
      userName="Admin"
      items={[
        { to: "/admin", label: "Analytics", icon: LayoutDashboard },
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/doctors", label: "Doctor approvals", icon: BadgeCheck },
        { to: "/admin/reports", label: "Reports", icon: FileBarChart },
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  );
}
