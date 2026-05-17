import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/supabase";
import { LayoutDashboard, Calendar, FileText, User, Bell } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/patient")({
  component: PatientLayout,
});

function PatientLayout() {
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
      role="Patient"
      userName={userName}
      items={[
        { to: "/patient", label: "Overview", icon: LayoutDashboard },
        { to: "/patient/appointments", label: "Appointments", icon: Calendar },
        { to: "/patient/prescriptions", label: "Prescriptions", icon: FileText },
        { to: "/patient/notifications", label: "Notifications", icon: Bell },
        { to: "/patient/profile", label: "Profile", icon: User },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  );
}
