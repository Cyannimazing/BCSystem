"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import Button from "@/components/Button.jsx";

const PlansPage = ({ id }) => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get("/api/plans");
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
    <section id={id}>
      <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#333] text-center mb-4">
          Choose Your Subscription Plan
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Select the plan that best suits your needs and start your journey with
          BirthCare today.
        </p>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  index === 1 ? "border-2 border-[#ff6b6b] scale-105" : ""
                }`}
              >
                {index === 1 && (
                  <span className="absolute top-0 right-0 bg-[#ff6b6b] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </span>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#333] mb-4">
                    {plan.plan_name}
                  </h2>
                  <p className="text-3xl font-bold text-[#ff6b6b] mb-2">
                    ₱{plan.price.toFixed(2)}
                  </p>
                  <p className="text-gray-500 mb-6">
                    {plan.duration_in_year} Year
                    {plan.duration_in_year > 1 ? "s" : ""}
                  </p>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Comprehensive maternal care
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      24/7 support
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Personalized plans
                    </li>
                  </ul>
                </div>
                <Button
                  onClick={() => selectPlan(plan.id)}
                  className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-semibold py-3 rounded-md transition-all duration-300 transform hover:scale-105"
                >
                  Select Plan
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-600 py-12">
              No plans available. Please try again later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlansPage;
