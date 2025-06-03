"use client";

import { useAuth } from "@/hooks/auth.jsx";
import Loading from "@/components/Loading.jsx";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Navigation from "./Navigation";

const AppLayout = ({ children }) => {
  const { user } = useAuth({ middleware: "auth" });
  const router = useRouter();
  const { birthcare_Id } = useParams();

  useEffect(() => {
    if (!user) return; // Wait for user to load

    // Redirect if user is neither role 2 nor role 3
    if (user.system_role_id !== 2 && user.system_role_id !== 3) {
      router.push("/");
      return;
    }

    // Check birthcare match based on role
    const birthcareId =
      user.system_role_id === 3
        ? user?.birth_care_staff?.birth_care_id
        : user?.birth_care?.id;

    if (birthcareId && parseInt(birthcare_Id) !== birthcareId) {
      router.push(`/${birthcareId}/dashboard`);
    }
  }, [user, router, birthcare_Id]);

  if (!user) {
    return <Loading />;
  }

  if (user.system_role_id !== 2 && user.system_role_id !== 3) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  );
};

export default AppLayout;
