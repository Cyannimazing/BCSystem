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
      <div className="h-screen w-full overflow-hidden flex flex-col">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-center text-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-amber-500 mr-2 flex-shrink-0" />
                <h2 className="text-xl font-semibold text-gray-900">
                  No Birthcare Facility Found
                </h2>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 px-6 py-6 flex flex-col justify-center overflow-hidden">
              {/* Icon and Main Message */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 rounded-full p-4">
                    <BuildingOffice2Icon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get Started with Your Facility
                </h3>
                <p className="text-gray-600 mb-1">
                  You haven't registered a birthcare facility yet.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Register your facility to manage appointments, staff, and access powerful management tools.
                </p>

                {/* CTA Button */}
                <Link href="/register-birthcare" passHref>
                  <Button className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white transition-all duration-200 px-6 py-3 rounded-lg shadow-sm hover:shadow-md font-medium">
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Register Birthcare Facility</span>
                  </Button>
                </Link>
              </div>

              {/* Benefits Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                  What You'll Get
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="flex items-start text-sm">
                    <span className="text-green-600 mr-2 font-medium">•</span>
                    <span className="text-gray-700">Manage your facility staff and roles</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-green-600 mr-2 font-medium">•</span>
                    <span className="text-gray-700">Handle client appointments efficiently</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-green-600 mr-2 font-medium">•</span>
                    <span className="text-gray-700">Access analytics and detailed reports</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <span className="text-green-600 mr-2 font-medium">•</span>
                    <span className="text-gray-700">Showcase your services to potential clients</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Need help getting started? Contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isApproved = approvalStatus?.status === "approved";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-6">
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
                disabled={isTogglingVisibility || birthcare.status === "pending"}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                  birthcare.status === "pending"
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
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
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staffCount}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
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

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Patients
                </p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
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

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">Coming Soon</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
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

        {/* Monthly Births Report - Top Position */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Monthly Births Report
              </h2>
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {/* Chart Container */}
              <div className="relative h-48 bg-white rounded-lg p-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
                  <span>20</span>
                  <span>15</span>
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                
                {/* Chart bars */}
                <div className="ml-8 h-full flex items-end justify-between space-x-2">
                  {[
                    { month: 'Jan', value: 0 },
                    { month: 'Feb', value: 0 },
                    { month: 'Mar', value: 0 },
                    { month: 'Apr', value: 0 },
                    { month: 'May', value: 0 },
                    { month: 'Jun', value: 0 }
                  ].map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-300 relative group ${
                          data.value === 0 
                            ? 'bg-gray-200 h-1' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        style={data.value > 0 ? { height: `${(data.value / 20) * 100}%` } : {}}
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-10">
                          {data.value} births
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Chart Summary */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Total Births</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">0.0</div>
                  <div className="text-sm text-gray-600">Avg/Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facility Name and Description */}
        <div className="mb-8">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Facility Information */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
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
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
