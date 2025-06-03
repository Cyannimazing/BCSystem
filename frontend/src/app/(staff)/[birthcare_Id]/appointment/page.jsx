"use client";
import { useAuth } from "@/hooks/auth";
import React from "react";

const AppointmentPage = () => {
  const { user } = useAuth({ middleware: "auth" });

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log("User data:", {
    system_role_id: user.system_role_id,
    permissions: user.permissions,
  });

  // Debug logs for staff
  if (user.system_role_id === 3) {
    console.log("TEST");
    console.log(user.permissions);
  }

  // Unauthorized: not role 2 and not role 3 with manage_appointment
  if (
    user.system_role_id !== 2 &&
    (user.system_role_id !== 3 ||
      !user.permissions?.includes("manage_appointment"))
  ) {
    return <div>Unauthorized</div>;
  }

  return <div>just a sample appointment page dont need to do anything</div>;
};

export default AppointmentPage;
