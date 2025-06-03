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
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function FacilityDashboard() {
  const [birthcare, setBirthcare] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!birthcare) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-50 p-6 border-b border-indigo-100">
            <div className="flex items-center justify-center">
              <ExclamationTriangleIcon className="h-10 w-10 text-indigo-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">No Birthcare Facility Found</h2>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <BuildingOffice2Icon className="h-24 w-24 text-gray-300 mb-6" />
              <p className="text-gray-600 text-lg text-center mb-2">
                You haven't registered a birthcare facility yet.
              </p>
              <p className="text-gray-500 text-center mb-8">
                Register your facility to manage appointments, staff, and access powerful management tools.
              </p>
              
              <Link href="/register-birthcare" passHref>
                <Button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 px-8 py-3 rounded-lg shadow-md hover:shadow-lg">
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
    );
  }

  const isApproved = approvalStatus?.status === "approved";

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header with Dashboard Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Facility Management
        </h1>
        <Link 
          href={`/${birthcare.id}/dashboard`} 
          passHref
        >
          <Button 
            disabled={!isApproved}
            className={`flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 px-6 py-3 rounded-lg shadow-md hover:shadow-lg ${
              !isApproved ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Status Section */}
      <div
        className={`p-5 rounded-lg mb-8 shadow-sm flex items-start border-l-4 ${
          approvalStatus?.status === "approved"
            ? "bg-green-50 border-green-500"
            : approvalStatus?.status === "pending"
            ? "bg-yellow-50 border-yellow-500"
            : "bg-red-50 border-red-500"
        }`}
      >
        <div className="mr-4">
          {approvalStatus?.status === "approved" ? (
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          ) : approvalStatus?.status === "pending" ? (
            <ClockIcon className="h-6 w-6 text-yellow-500" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-red-500" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">
            Status: {approvalStatus?.status.toUpperCase()}
          </h2>
          <p className="text-gray-700">{approvalStatus?.message}</p>
        </div>
      </div>

      {/* Facility Details */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center mb-4">
          <UserIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold">{birthcare.name}</h3>
        </div>
        <p className="text-gray-600 mb-4 pl-8">{birthcare.description}</p>
        <div className="flex items-center text-sm text-gray-500 pl-8">
          <MapPinIcon className="h-4 w-4 mr-1" />
          <span>Location: {birthcare.latitude}, {birthcare.longitude}</span>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold">Documents</h3>
        </div>
        <div className="space-y-4 pl-8">
          {birthcare.documents.map((doc, index) => (
            <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
              <span className="font-medium text-gray-700">{doc.document_type}</span>
              <Button
                onClick={() => window.open(doc.url, "_blank")}
                className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-1 transition-colors duration-200"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>View Document</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center mb-4">
          <CreditCardIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h3 className="text-lg font-semibold">Subscription Status</h3>
        </div>
        {subscription?.status === "active" ? (
          <div className="pl-8">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-600 font-medium">Active Subscription</p>
            </div>
            {subscription.expires_at && (
              <p className="text-sm text-gray-500 mt-2 pl-7">
                Expires: {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center pl-8">
            <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-600 font-medium">No active subscription</p>
          </div>
        )}
      </div>

      {/* Management Buttons */}
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
        <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-500 mr-2" />
        Management Tools
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Button
          disabled={!isApproved}
          className={`w-full flex items-center justify-center space-x-2 py-4 bg-white shadow hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200 ${
            !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <UserGroupIcon className="h-5 w-5 text-indigo-500" />
          <span className="font-medium">Manage Staff</span>
        </Button>
        <Button
          disabled={!isApproved}
          className={`w-full flex items-center justify-center space-x-2 py-4 bg-white shadow hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200 ${
            !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <CalendarIcon className="h-5 w-5 text-indigo-500" />
          <span className="font-medium">Appointment</span>
        </Button>
        <Button
          disabled={!isApproved}
          className={`w-full flex items-center justify-center space-x-2 py-4 bg-white shadow hover:shadow-md transition-all duration-200 rounded-lg border border-gray-200 ${
            !isApproved ? "opacity-50 cursor-not-allowed" : "hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          <UserIcon className="h-5 w-5 text-indigo-500" />
          <span className="font-medium">Manage Role</span>
        </Button>
      </div>
    </div>
  );
}
