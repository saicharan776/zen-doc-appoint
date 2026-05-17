import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/supabase";
import { LayoutDashboard, Calendar, FileText, User, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/doctor")({
  component: DoctorLayout,
});

function DoctorLayout() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();

      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    };

    loadUser();
  }, []);

  return (
    <DashboardLayout
      role="Doctor"
      userName={userName}
      items={[
        { to: "/doctor", label: "Overview", icon: LayoutDashboard },
        { to: "/doctor/appointments", label: "Appointments", icon: Calendar },
        { to: "/doctor/schedule", label: "Schedule", icon: Clock },
        { to: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
        { to: "/doctor/profile", label: "Profile", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  );
}
