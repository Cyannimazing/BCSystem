"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import useSWR from "swr";
import axios from "../../../lib/axios";
import { useAuth } from "../../../hooks/auth";
import LocationPicker from "../../../components/LocationPicker";
import DocumentUpload from "../../../components/DocumentUpload";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputError from "../../../components/InputError";

export default function RegisterBirthcare() {
  const router = useRouter();
  const { user } = useAuth({ middleware: "auth" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: null,
      philhealth_cert: null,
      business_permit: null,
      doh_cert: null,
    },
  });

  // Check subscription status
  const {
    data: subscription,
    error: subscriptionError,
    isLoading: isCheckingSubscription,
  } = useSWR("/api/owner/subscription", () =>
    axios
      .get("/api/owner/subscription")
      .then((res) => res.data)
      .catch((error) => {
        console.error("Error fetching subscription:", error);
        throw error;
      })
  );

  // Check if user already has a birthcare registered
  const {
    data: existingBirthcare,
    error: birthcareError,
    isLoading: isCheckingBirthcare,
  } = useSWR("/api/owner/birthcare", () =>
    axios
      .get("/api/owner/birthcare")
      .then((res) => res.data)
      .catch((error) => {
        // 404 means no birthcare found, which is expected for new registrations
        if (error.response?.status !== 404) {
          console.error("Error fetching birthcare:", error);
          throw error;
        }
        return null; // Return null for no existing birthcare
      })
  );

  // Redirect if user already has a birthcare
  useEffect(() => {
    if (existingBirthcare && !birthcareError) {
      router.push("/facility-dashboard");
    }
  }, [existingBirthcare, birthcareError, router]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError("");
    setSuccessMessage("");

    try {
      // Create FormData object for file uploads
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("latitude", data.location[0]);
      formData.append("longitude", data.location[1]);

      // Append documents
      if (data.philhealth_cert) {
        formData.append("philhealth_cert", data.philhealth_cert);
      }

      if (data.business_permit) {
        formData.append("business_permit", data.business_permit);
      }

      if (data.doh_cert) {
        formData.append("doh_cert", data.doh_cert);
      }

      // Submit the form
      const response = await axios.post(
        "/api/owner/register-birthcare",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(
        "Your birthcare facility has been registered successfully and is pending approval."
      );

      // Redirect after a delay to allow the user to see the success message
      setTimeout(() => {
        router.push("/facility-dashboard");
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError(
          "An error occurred during registration. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has an active subscription
  const hasActiveSubscription = subscription?.status === "active";

  // Loading state
  if (isCheckingSubscription || isCheckingBirthcare) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // No active subscription
  if (!hasActiveSubscription && !subscriptionError) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Subscription Required
        </h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need an active subscription to register a birthcare
                facility.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/owner/subscription")}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Subscribe Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Register Your Birthcare Facility
      </h1>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Server error message */}
      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Facility Information */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Facility Information
          </h2>

          <div className="space-y-4">
            {/* Facility Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Facility Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                type="text"
                {...register("name", {
                  required: "Facility name is required",
                  maxLength: {
                    value: 100,
                    message: "Facility name must be less than 100 characters",
                  },
                })}
                className="mt-1 block w-full"
              />
              <InputError
                messages={errors.name ? [errors.name.message] : []}
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description must be less than 500 characters",
                  },
                })}
                className="mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <InputError
                messages={
                  errors.description ? [errors.description.message] : []
                }
                className="mt-2"
              />
              <p className="mt-1 text-sm text-gray-500">
                Briefly describe your facility and the services offered.
              </p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Facility Location <span className="text-red-500">*</span>
          </h2>

          <Controller
            name="location"
            control={control}
            rules={{ required: "Please select a location on the map" }}
            render={({ field }) => (
              <LocationPicker
                value={field.value}
                onChange={field.onChange}
                error={errors.location?.message}
              />
            )}
          />
        </div>

        {/* Documents Section */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Required Documents
          </h2>

          <div className="space-y-6">
            {/* PhilHealth Accreditation (Optional) */}
            <Controller
              name="philhealth_cert"
              control={control}
              render={({ field }) => (
                <DocumentUpload
                  label="PhilHealth Accreditation Certificate"
                  name="philhealth_cert"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.philhealth_cert?.message}
                  required={false}
                  accept="application/pdf,image/jpeg,image/png"
                />
              )}
            />

            {/* Business Permit (Required) */}
            <Controller
              name="business_permit"
              control={control}
              rules={{ required: "Business Permit is required" }}
              render={({ field }) => (
                <DocumentUpload
                  label="Business Permit from Local Government Unit (LGU)"
                  name="business_permit"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.business_permit?.message}
                  required={true}
                  accept="application/pdf,image/jpeg,image/png"
                />
              )}
            />

            {/* DOH Certificate (Required) */}
            <Controller
              name="doh_cert"
              control={control}
              rules={{ required: "DOH Certificate is required" }}
              render={({ field }) => (
                <DocumentUpload
                  label="DOH Certificate of Compliance"
                  name="doh_cert"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.doh_cert?.message}
                  required={true}
                  accept="application/pdf,image/jpeg,image/png"
                />
              )}
            />
          </div>
        </div>

        {/* Submission Section */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-600">
            <p>* Required fields</p>
            <p className="mt-1">
              Your application will be reviewed by an administrator.
            </p>
          </div>

          <Button
            type="submit"
            className={`${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            } bg-indigo-600 hover:bg-indigo-700`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
