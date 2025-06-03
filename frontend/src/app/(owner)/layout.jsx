"use client";

import { useAuth } from "@/hooks/auth.jsx";
import Navigation from "@/app/(owner)/Navigation.jsx";
import Loading from "@/components/Loading.jsx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: "auth" });
  const router = useRouter();

  // Redirect non-admin users to homepage
  useEffect(() => {
    if (user && user.system_role_id !== 2) {
      router.push("/");
    }
  }, [user, router]);

  // Show loading state while user data is being fetched
  if (!user) {
    return <Loading />;
  }

  // Prevent rendering for non-admin users until redirect occurs
  if (user.system_role_id !== 2) {
    return null;
  }

  // Render admin layout for users with system_role_id === 1
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
