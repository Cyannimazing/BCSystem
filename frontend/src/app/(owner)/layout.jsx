"use client";

import { useAuth } from "@/hooks/auth.jsx";
import Navigation from "@/app/(owner)/Navigation.jsx";
import Loading from "@/components/Loading.jsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: "auth" });
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Redirect non-owner users to homepage (keeping original role logic)
  useEffect(() => {
    if (user && user.system_role_id !== 2) {
      router.push("/");
    }
  }, [user, router]);

  // Show loading state while user data is being fetched
  if (!user) {
    return <Loading />;
  }

  // Prevent rendering for non-owner users until redirect occurs
  if (user.system_role_id !== 2) {
    return null;
  }

  // Render owner layout with new navigation design
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      <main className="lg:ml-72 transition-all duration-300 pt-16 lg:pt-0">{children}</main>
    </div>
  );
};

export default AppLayout;
