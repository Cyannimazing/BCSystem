"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import axios from "@/lib/axios";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function BirthcareApplications() {
  const router = useRouter();
  const { user } = useAuth({ middleware: "auth" });

  // State for pagination, sorting, filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filters, setFilters] = useState({
    status: "pending", // Default to pending applications only
    search: "",
  });

  // State for application actions
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve' or 'reject'
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  // State for document viewer
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  // State for review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewApplication, setReviewApplication] = useState(null);

  // Fetch applications data
  const { data, error, mutate, isLoading } = useSWR(
    `/api/admin/birthcare-applications?page=${currentPage}&perPage=${perPage}&sortField=${sortField}&sortDirection=${sortDirection}&status=${filters.status}&search=${filters.search}`,
    () =>
      axios
        .get(`/api/admin/birthcare-applications`, {
          params: {
            page: currentPage,
            perPage,
            sortField,
            sortDirection,
            status: filters.status,
            search: filters.search,
          },
        })
        .then((res) => res.data)
        .catch((error) => {
          console.error("Error fetching applications:", error);
          throw error;
        })
  );

  // Handle sort click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Open action modal
  const openActionModal = (application, action) => {
    setSelectedApplication(application);
    setActionType(action);
    setRejectionReason("");
    setShowModal(true);
  };

  // Close action modal
  const closeActionModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setActionType("");
    setRejectionReason("");
  };

  // Handle application action (approve/reject)
  const handleApplicationAction = async () => {
    if (!selectedApplication || !actionType) return;

    setIsSubmitting(true);
    setActionMessage({ type: "", text: "" });

    try {
      const endpoint = `/api/admin/birthcare-applications/${selectedApplication.id}/${actionType}`;
      const payload =
        actionType === "reject" ? { reason: rejectionReason } : {};

      await axios.post(endpoint, payload);

      // Show success message and close modal
      setActionMessage({
        type: "success",
        text: `Application ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully.`,
      });

      // Refresh data
      mutate();

      // Close modal after short delay
      setTimeout(() => {
        closeActionModal();
        setActionMessage({ type: "", text: "" });
      }, 2000);
    } catch (error) {
      console.error(`Error ${actionType}ing application:`, error);
      setActionMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          `An error occurred while ${actionType}ing the application.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open document viewer
  const openDocumentViewer = (document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  // Close document viewer
  const closeDocumentViewer = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
  };

  // Download document
  const downloadDocument = (document) => {
    window.open(document.url, "_blank");
  };
  
  // Open review modal
  const openReviewModal = (application) => {
    setReviewApplication(application);
    setShowReviewModal(true);
  };
  
  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewApplication(null);
    setActionType("");
    setRejectionReason("");
    setActionMessage({ type: "", text: "" });
  };
  
  // Handle decision from review modal
  const handleReviewDecision = (action) => {
    setActionType(action);
    if (action === "reject") {
      setRejectionReason("");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Sort indicator
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return null;

    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading applications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
              <p className="text-sm text-red-700">
                Error loading applications. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="px-6 py-6 h-full flex flex-col">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Birthcare Applications
                </h1>
                <p className="text-gray-600">
                  Review and manage pending facility registration applications
                </p>
              </div>

              {/* Empty State - Center vertically in remaining space */}
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center max-w-md w-full">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Applications Found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are no birthcare facility applications to review at this time. 
                  New applications will appear here as they are submitted.
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Waiting for Applications
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="px-6 py-6 h-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Birthcare Applications
              </h1>
              <p className="text-gray-600">
                Review and manage pending facility registration applications
              </p>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 px-6 py-5 mb-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Filters
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <div className="mt-1">
              <Input
                type="text"
                name="search"
                id="search"
                placeholder="Search by facility name or owner"
                value={filters.search}
                onChange={handleFilterChange}
                className="block w-full"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-1 flex items-end">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setFilters({ status: "pending", search: "" });
                setCurrentPage(1);
              }}
            >
              Reset
            </Button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Facility Name
                      <SortIndicator field="name" />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("created_at")}
                    >
                      Submission Date
                      <SortIndicator field="created_at" />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Owner
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <SortIndicator field="status" />
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Documents
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(application.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {application.documents.map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => openDocumentViewer(doc)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {doc.document_type}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {application.status === "pending" && (
                          <button
                            onClick={() => openReviewModal(application)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Review
                          </button>
                        )}
                        {application.status !== "pending" && (
                          <span className="text-gray-500">
                            {application.status === "approved"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-b-xl">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === data.totalPages}
              className={`ml-3 ${
                currentPage === data.totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * perPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * perPage, data.total)}
                </span>{" "}
                of <span className="font-medium">{data.total}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {[...Array(data.totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page + 1
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    currentPage === data.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
              </div>
            )}
            
            {/* Action Modal */}
      {showModal && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  {actionType === "approve" ? (
                    <svg
                      className="h-6 w-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    {actionType === "approve"
                      ? "Approve Application"
                      : "Reject Application"}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {actionType === "approve"
                        ? "Are you sure you want to approve this birthcare application? This will allow the owner to access all birthcare management features."
                        : "Are you sure you want to reject this birthcare application? Please provide a reason for the rejection."}
                    </p>

                    {actionType === "reject" && (
                      <div className="mt-4">
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700 text-left"
                        >
                          Rejection Reason{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="reason"
                          name="reason"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Please explain why this application is being rejected"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Action message */}
                    {actionMessage.text && (
                      <div
                        className={`mt-4 p-2 rounded ${
                          actionMessage.type === "success"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                        }`}
                      >
                        {actionMessage.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button
                  type="button"
                  onClick={handleApplicationAction}
                  className={`w-full sm:col-start-2 ${
                    actionType === "approve"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={
                    isSubmitting ||
                    (actionType === "reject" && !rejectionReason.trim())
                  }
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
                      Processing...
                    </>
                  ) : actionType === "approve" ? (
                    "Approve"
                  ) : (
                    "Reject"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={closeActionModal}
                  className="mt-3 w-full sm:mt-0 sm:col-start-1 bg-white text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentModal && selectedDocument && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="flex justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedDocument.document_type}
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeDocumentViewer}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 h-96 overflow-auto border rounded-md">
                  {/* If the document is an image, show it directly */}
                  {selectedDocument.document_path.match(
                    /\.(jpeg|jpg|gif|png)$/i
                  ) ? (
                    <img
                      src={selectedDocument.url}
                      alt={selectedDocument.document_type}
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    // Otherwise show a document icon and download prompt
                    <div className="flex flex-col items-center justify-center h-full">
                      <svg
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Preview not available. Please download to view.
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-5 sm:mt-6">
                  <Button
                    type="button"
                    onClick={() => downloadDocument(selectedDocument)}
                    className="w-full"
                  >
                    Download Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewApplication && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
            <div
              className="fixed inset-0 backdrop-blur-md transition-opacity"
              aria-hidden="true"
              onClick={closeReviewModal}
            ></div>
            <div className="relative bg-white rounded-xl shadow-2xl transform transition-all max-w-6xl w-full max-h-[95vh] overflow-hidden">
              <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {reviewApplication.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6h6v-6M8 11V8a2 2 0 012-2h4a2 2 0 012 2v3M8 19h8" />
                        </svg>
                        Submitted {formatDate(reviewApplication.created_at)}
                      </span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(reviewApplication.status)}`}>
                        {reviewApplication.status.charAt(0).toUpperCase() + reviewApplication.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={closeReviewModal}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(95vh-200px)]">
                  {/* Application Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Owner Information Card */}
                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">Owner Details</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{reviewApplication.user.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">{reviewApplication.user.email}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</label>
                            <p className="text-sm font-medium text-gray-900 mt-1">#{reviewApplication.user.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents Section */}
                    <div className="lg:col-span-2">
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center mb-6">
                          <div className="p-2 bg-gray-100 rounded-lg mr-3">
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">Submitted Documents</h4>
                          <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            {reviewApplication.documents.length} files
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {reviewApplication.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
                              onClick={() => openDocumentViewer(doc)}
                            >
                              <div className="flex items-start">
                                <div className="p-2 bg-gray-50 rounded-lg mr-3 group-hover:bg-blue-50">
                                  <svg className="h-5 w-5 text-gray-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                    {doc.document_type}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 group-hover:text-blue-500">
                                    Click to view document
                                  </p>
                                </div>
                                <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Section */}
                  {!actionType && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Review Complete?</h4>
                        <p className="text-gray-600">Make your decision on this birthcare facility application</p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => handleReviewDecision("approve")}
                          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Approve Application
                        </button>
                        <button
                          onClick={() => handleReviewDecision("reject")}
                          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject Application
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Confirmation */}
                  {actionType && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">
                        {actionType === "approve" ? "Approve Application" : "Reject Application"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {actionType === "approve"
                          ? "Are you sure you want to approve this birthcare application? This will allow the owner to access all birthcare management features."
                          : "Please provide a reason for rejecting this application."}
                      </p>
                      
                      {actionType === "reject" && (
                        <div className="mb-4">
                          <label
                            htmlFor="rejectionReason"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Rejection Reason <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="rejectionReason"
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Please explain why this application is being rejected"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                          />
                        </div>
                      )}

                      {/* Action message */}
                      {actionMessage.text && (
                        <div
                          className={`mb-4 p-3 rounded ${
                            actionMessage.type === "success"
                              ? "bg-green-50 text-green-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          {actionMessage.text}
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <Button
                          onClick={async () => {
                            setSelectedApplication(reviewApplication);
                            await handleApplicationAction();
                          }}
                          className={`${
                            actionType === "approve"
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                          disabled={
                            isSubmitting ||
                            (actionType === "reject" && !rejectionReason.trim())
                          }
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
                              Processing...
                            </>
                          ) : actionType === "approve" ? (
                            "Confirm Approval"
                          ) : (
                            "Confirm Rejection"
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setActionType("");
                            setRejectionReason("");
                            setActionMessage({ type: "", text: "" });
                          }}
                          className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
}
