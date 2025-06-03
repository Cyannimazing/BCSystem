"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/auth";

const LoginLinks = () => {
  const { user } = useAuth({ middleware: "guest" });
  var birthcare_Id = null;
  console.log(user);

  if (user?.system_role_id === 3) {
    birthcare_Id = user?.birth_care_staff.birth_care_id;
  }

  return (
    <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
      {user ? (
        <>
          {user.system_role_id === 1 ? (
            <Link
              href="/dashboard"
              className="ml-4 text-sm text-gray-700 underline"
            >
              Dashboard
            </Link>
          ) : user.system_role_id === 2 ? (
            <Link
              href="/facility-dashboard"
              className="ml-4 text-sm text-gray-700 underline"
            >
              Dashboard
            </Link>
          ) : user.system_role_id === 3 ? (
            <Link
              href={`/${birthcare_Id}/dashboard`}
              className="ml-4 text-sm text-gray-700 underline"
            >
              Dashboard
            </Link>
          ) : null}
        </>
      ) : (
        <>
          <Link href="/login" className="text-sm text-gray-700 underline">
            Login
          </Link>
          <Link
            href="/register"
            className="ml-4 text-sm text-gray-700 underline"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default LoginLinks;
