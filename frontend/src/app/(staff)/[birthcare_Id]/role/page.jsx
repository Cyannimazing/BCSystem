"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RoleModal from "./components/RoleModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useAuth } from "@/hooks/auth";

const RolePage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
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

  // Fetch roles and permissions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [rolesResponse, permissionsResponse] = await Promise.all([
          axios.get(`/api/birthcare/${birthcare_Id}/roles`),
          axios.get("/api/permissions"),
        ]);

        // Transform backend role_name to name for frontend consistency
        const formattedRoles = rolesResponse.data.map((role) => ({
          ...role,
          name: role.name || role.role_name,
        }));

        setRoles(formattedRoles);
        setPermissions(permissionsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load roles and permissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [birthcare_Id]);

  // Create a new role
  const handleCreateRole = async (roleData) => {
    try {
      const requestData = {
        ...roleData,
        role_name: roleData.name,
      };

      const response = await axios.post(
        `/api/birthcare/${birthcare_Id}/roles`,
        requestData
      );
      const formattedRole = {
        ...response.data,
        name: response.data.name || response.data.role_name,
      };

      setRoles([...roles, formattedRole]);
      setShowRoleModal(false);
    } catch (err) {
      console.error("Error creating role:", err);
      return { error: err.response?.data?.message || "Failed to create role" };
    }
  };

  // Update an existing role
  const handleUpdateRole = async (roleData) => {
    try {
      const requestData = {
        ...roleData,
        role_name: roleData.name,
      };

      const response = await axios.put(
        `/api/birthcare/${birthcare_Id}/roles/${currentRole.id}`,
        requestData
      );

      const formattedRole = {
        ...response.data,
        name: response.data.name || response.data.role_name,
      };

      setRoles(
        roles.map((role) => (role.id === currentRole.id ? formattedRole : role))
      );

      setShowRoleModal(false);
    } catch (err) {
      console.error("Error updating role:", err);
      return { error: err.response?.data?.message || "Failed to update role" };
    }
  };

  // Delete a role
  const handleDeleteRole = async () => {
    try {
      await axios.delete(
        `/api/birthcare/${birthcare_Id}/roles/${currentRole.id}`
      );
      setRoles(roles.filter((role) => role.id !== currentRole.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting role:", err);
      setError("Failed to delete role. Please try again.");
    }
  };

  // Open modal for creating a new role
  const openCreateModal = () => {
    setCurrentRole(null);
    setShowRoleModal(true);
  };

  // Open modal for editing an existing role
  const openEditModal = (role) => {
    setCurrentRole(role);
    setShowRoleModal(true);
  };

  // Open confirmation modal for deleting a role
  const openDeleteModal = (role) => {
    setCurrentRole(role);
    setShowDeleteModal(true);
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Unauthorized: not role 2 and not role 3 with manage_role
  if (
    user.system_role_id !== 2 &&
    (user.system_role_id !== 3 || !user.permissions?.includes("manage_role"))
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
          Role Management
        </h1>
        <Button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Create New Role
        </Button>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {filteredRoles.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {role.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {permission.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(role)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(role)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-gray-500">
            {searchTerm ? (
              <p>No roles match your search criteria.</p>
            ) : (
              <p>No roles found. Create a new role to get started.</p>
            )}
          </div>
        )}
      </div>

      {showRoleModal && (
        <RoleModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
          onSubmit={currentRole ? handleUpdateRole : handleCreateRole}
          role={currentRole}
          permissions={permissions}
          isEdit={!!currentRole}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteRole}
          roleName={currentRole?.name}
        />
      )}
    </div>
  );
};

export default RolePage;
