"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import Button from "@/components/Button";
import Link from "next/link";
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  BuildingOffice2Icon,
  PlusCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  StarIcon,
  SparklesIcon,
  BellIcon,
  Cog6ToothIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function FacilityDashboard() {
  const [staffCount, setStaffCount] = useState(0);
  const [birthcare, setBirthcare] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [birthcareRes, subscriptionRes, approvalRes] = await Promise.all([
          axios.get("/api/owner/birthcare"),
          axios.get("/api/owner/subscription"),
          axios.get("/api/owner/birthcare/approval-status"),
        ]);

        setBirthcare(birthcareRes.data);
        setSubscription(subscriptionRes.data);
        setApprovalStatus(approvalRes.data);

        // Set staff count from available data
        setStaffCount(birthcareRes.data.staff?.length || 0);
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditName = () => {
    setEditName(birthcare.name);
    setIsEditingName(true);
  };

  const handleEditDescription = () => {
    setEditDescription(birthcare.description);
    setIsEditingDescription(true);
  };

  const handleSaveName = async () => {
    if (editName.trim() === "") return;

    setIsSaving(true);
    try {
      await axios.put(`/api/owner/birthcare/${birthcare.id}`, {
        name: editName.trim(),
        description: birthcare.description,
      });

      setBirthcare((prev) => ({ ...prev, name: editName.trim() }));
      setIsEditingName(false);
    } catch (error) {
      console.error("Error saving name:", error);
      alert("Failed to save name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDescription = async () => {
    setIsSaving(true);
    try {
      await axios.put(`/api/owner/birthcare/${birthcare.id}`, {
        name: birthcare.name,
        description: editDescription.trim(),
      });

      setBirthcare((prev) => ({
        ...prev,
        description: editDescription.trim(),
      }));
      setIsEditingDescription(false);
    } catch (error) {
      console.error("Error saving description:", error);
      alert("Failed to save description. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setIsEditingDescription(false);
    setEditName("");
    setEditDescription("");
  };

  const handleToggleVisibility = async () => {
    setIsTogglingVisibility(true);
    try {
      const newVisibility = !birthcare.is_public;
      await axios.put(`/api/owner/birthcare/${birthcare.id}`, {
        name: birthcare.name,
        description: birthcare.description,
        is_public: newVisibility,
      });

      setBirthcare((prev) => ({ ...prev, is_public: newVisibility }));
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility. Please try again.");
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!birthcare) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl drop-shadow-lg overflow-hidden">
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-center">
                <ExclamationTriangleIcon className="h-10 w-10 text-gray-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  No Birthcare Facility Found
                </h2>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <BuildingOffice2Icon className="h-24 w-24 text-gray-300 mb-6" />
                <p className="text-gray-600 text-lg text-center mb-2">
                  You haven't registered a birthcare facility yet.
                </p>
                <p className="text-gray-500 text-center mb-8">
                  Register your facility to manage appointments, staff, and access
                  powerful management tools.
                </p>

                <Link href="/register-birthcare" passHref>
                  <Button className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200 px-8 py-3 rounded-lg shadow-md hover:shadow-lg">
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Register Birthcare Facility</span>
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  Benefits of Registration
                </h3>
                <ul className="text-sm text-gray-600 space-y-2 pl-7">
                  <li>• Manage your facility staff and roles</li>
                  <li>• Handle client appointments efficiently</li>
                  <li>• Access analytics and reports</li>
                  <li>• Showcase your services to potential clients</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = approvalStatus?.status === "approved";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Action Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {approvalStatus?.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1">
                  <span className="text-sm text-yellow-800">
                    Your facility is awaiting approval
                  </span>
                </div>
              )}
              {approvalStatus?.status === "rejected" && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1">
                  <span className="text-sm text-red-800">
                    Your facility registration was rejected
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleToggleVisibility}
                disabled={isTogglingVisibility}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md"
              >
                {isTogglingVisibility ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="h-4 w-4" />
                    <span>{birthcare.is_public ? "Public" : "Private"}</span>
                  </div>
                )}
              </Button>
              <Link href={`/${birthcare.id}/dashboard`}>
                <Button
                  disabled={!isApproved}
                  className={`px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors shadow-md ${
                    !isApproved ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staffCount}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                Staff members registered
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                Feature in development
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                Feature in development
              </span>
            </div>
          </div>
        </div>

        {/* Facility Name and Description */}
        <div className="mb-8">
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Facility Details
              </h2>
              <BuildingOffice2Icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {/* Facility Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facility Name
                </label>
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-xl font-semibold text-gray-900 bg-transparent border-2 border-slate-300 focus:border-slate-500 focus:outline-none rounded-lg p-2 flex-1"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={isSaving || editName.trim() === ""}
                      className="p-2 text-green-600 hover:text-green-800 disabled:opacity-50 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {birthcare.name}
                    </h3>
                    <button
                      onClick={handleEditName}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Facility Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                {isEditingDescription ? (
                  <div className="flex items-start space-x-2">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="text-gray-700 bg-transparent border-2 border-slate-300 focus:border-slate-500 focus:outline-none rounded-lg p-2 flex-1 resize-none"
                      rows="3"
                      autoFocus
                    />
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={handleSaveDescription}
                        disabled={isSaving}
                        className="p-2 text-green-600 hover:text-green-800 disabled:opacity-50 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <CheckIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 flex-1">
                      {birthcare.description || "No description provided"}
                    </p>
                    <button
                      onClick={handleEditDescription}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Facility Information */}
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Facility Information
              </h2>
              <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Location: {birthcare.latitude}, {birthcare.longitude}
                </span>
              </div>
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Status:
                  <span
                    className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      birthcare.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : birthcare.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {birthcare.status?.toUpperCase()}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Visibility: {birthcare.is_public ? "Public" : "Private"}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Registered:{" "}
                  {new Date(birthcare.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Subscription
              </h2>
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
            </div>
            {subscription?.status === "active" ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-green-600 font-medium">
                    Active Subscription
                  </span>
                </div>
                {subscription.subscription?.end_date && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Expires:{" "}
                      {new Date(
                        subscription.subscription.end_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {subscription.subscription?.start_date && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      Started:{" "}
                      {new Date(
                        subscription.subscription.start_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">
                    Plan: {subscription.subscription?.plan?.plan_name || "N/A"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-red-600 font-medium">
                  No active subscription
                </span>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              <DocumentTextIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {birthcare.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700">
                    {doc.document_type}
                  </span>
                  <Button
                    onClick={() => window.open(doc.url, "_blank")}
                    className="px-4 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl drop-shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <Button
                disabled={!isApproved}
                className={`w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Manage Staff</span>
              </Button>
              <Button
                disabled={!isApproved}
                className={`w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span>View Appointments</span>
              </Button>
              <Button
                disabled={!isApproved}
                className={`w-full flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors ${
                  !isApproved ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <UserIcon className="h-5 w-5" />
                <span>Manage Roles</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
