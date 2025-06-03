"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Button from "@/components/Button.jsx";

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/api/plans");
        console.log(response);
        setPlans(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch plans");
      }
    };

    fetchPlans();
  }, []);

  const selectPlan = (planId) => {
    router.push(`/register?plan_id=${planId}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Choose a Subscription Plan
      </h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {plan.plan_name}
                </h2>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${plan.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mt-1">
                  {plan.duration_in_year} Year(s)
                </p>
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </div>
              <Button
                onClick={() => selectPlan(plan.id)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Select Plan
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No plans available.</p>
        )}
      </div>
      <div className="mt-6">
        <Link
          href="/login"
          className="underline text-sm text-gray-600 hover:text-gray-900"
        >
          Already registered? Log in
        </Link>
      </div>
    </div>
  );
};

export default PlansPage;
