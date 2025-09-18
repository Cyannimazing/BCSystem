"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import Button from "@/components/Button";
import Input from "@/components/Input";
import StaffModal from "./components/StaffModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useAuth } from "@/hooks/auth";

const StaffPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debug logs
  if (user) {
    console.log("User data:", {
      system_role_id: user.system_role_id,
      permissions: user.permissions,
    });

    // Debug logs for staff
    if (user.system_role_id === 3) {
      console.log("TEST");
      console.log(user.permissions);
    }
  }

  // Fetch staff and roles on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [staffResponse, rolesResponse] = await Promise.all([
          axios.get(`/api/birthcare/${birthcare_Id}/staff`),
          axios.get(`/api/birthcare/${birthcare_Id}/roles`),
        ]);

        setStaff(staffResponse.data);
        setRoles(rolesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load staff and roles. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [birthcare_Id]);

  // Effect to add/remove blur effect to entire app layout
  useEffect(() => {
    const appLayout = document.getElementById('app-layout');
    const anyModalOpen = showStaffModal || showDeleteModal;
    
    if (anyModalOpen && appLayout) {
      appLayout.style.filter = 'blur(4px)';
      appLayout.style.pointerEvents = 'none';
      document.body.style.overflow = 'hidden';
    } else if (appLayout) {
      appLayout.style.filter = 'none';
      appLayout.style.pointerEvents = 'auto';
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      if (appLayout) {
        appLayout.style.filter = 'none';
        appLayout.style.pointerEvents = 'auto';
        document.body.style.overflow = 'unset';
      }
    };
  }, [showStaffModal, showDeleteModal]);

  // Create a new staff member
  const handleCreateStaff = async (staffData) => {
    try {
      const response = await axios.post(
        `/api/birthcare/${birthcare_Id}/staff`,
        staffData
      );

      setStaff([...staff, response.data]);
      setShowStaffModal(false);
      return { success: true };
    } catch (err) {
      console.error("Error creating staff:", err);
      return {
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to create staff member",
      };
    }
  };

  // Update an existing staff member
  const handleUpdateStaff = async (staffData) => {
    try {
      const response = await axios.put(
        `/api/birthcare/${birthcare_Id}/staff/${currentStaff.id}`,
        staffData
      );

      setStaff(
        staff.map((s) => (s.id === currentStaff.id ? response.data : s))
      );

      setShowStaffModal(false);
      return { success: true };
    } catch (err) {
      console.error("Error updating staff:", err);
      return {
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update staff member",
      };
    }
  };

  // Delete a staff member
  const handleDeleteStaff = async () => {
    try {
      await axios.delete(
        `/api/birthcare/${birthcare_Id}/staff/${currentStaff.id}`
      );
      setStaff(staff.filter((s) => s.id !== currentStaff.id));
      setShowDeleteModal(false);
      return { success: true };
    } catch (err) {
      console.error("Error deleting staff:", err);
      setError("Failed to delete staff member. Please try again.");
      return { error: "Failed to delete staff member" };
    }
  };

  // Open modal for creating a new staff member
  const openCreateModal = () => {
    setCurrentStaff(null);
    setShowStaffModal(true);
  };

  // Open modal for editing an existing staff member
  const openEditModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setShowStaffModal(true);
  };

  // Open confirmation modal for deleting a staff member
  const openDeleteModal = (staffMember) => {
    setCurrentStaff(staffMember);
    setShowDeleteModal(true);
  };

  // Filter staff based on search term
  const filteredStaff = staff.filter(
    (staffMember) =>
      staffMember.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.contact_number
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Unauthorized: not role 2 and not role 3 with manage_staff
  if (
    user.system_role_id !== 2 &&
    (user.system_role_id !== 3 || !user.permissions?.includes("manage_staff"))
  ) {
    return <div>Unauthorized</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p>{error}</p>
        <Button
          className="mt-2 bg-red-600 hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Staff Management
        </h1>
        <Button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add New Staff
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search staff by name, email or contact number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {filteredStaff.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staffMember) => (
                <tr key={staffMember.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {staffMember.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {staffMember.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {staffMember.contact_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staffMember.role ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {staffMember.role.name}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No Role
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(staffMember)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(staffMember)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            {searchTerm ? (
              <p>No staff members match your search criteria.</p>
            ) : (
              <p>
                No staff members found. Add a new staff member to get started.
              </p>
            )}
          </div>
        )}
      </div>

      {showStaffModal && (
        <StaffModal
          isOpen={showStaffModal}
          onClose={() => setShowStaffModal(false)}
          onSubmit={currentStaff ? handleUpdateStaff : handleCreateStaff}
          staff={currentStaff}
          roles={roles}
          isEdit={!!currentStaff}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteStaff}
          staffName={currentStaff?.name}
        />
      )}
    </div>
  );
};

export default StaffPage;
