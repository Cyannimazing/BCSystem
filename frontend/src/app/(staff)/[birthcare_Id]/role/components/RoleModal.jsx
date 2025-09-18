"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import InputError from "@/components/InputError";

/**
 * Modal component for creating and editing roles
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Object} props.role - Role data for editing (null for create)
 * @param {Array} props.permissions - List of all available permissions
 * @param {boolean} props.isEdit - Whether this is an edit operation
 */
const RoleModal = ({
  isOpen,
  onClose,
  onSubmit,
  role,
  permissions,
  isEdit,
}) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with role data if editing
  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setSelectedPermissions(
        role.permissions?.map((permission) => permission.id) || []
      );
    } else {
      // Reset form for creation
      setName("");
      setSelectedPermissions([]);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    let hasErrors = false;
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Role name is required";
      hasErrors = true;
    }

    if (selectedPermissions.length === 0) {
      newErrors.permissions = "At least one permission must be selected";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const result = await onSubmit({
      name,
      permissions: selectedPermissions,
    });

    if (result?.error) {
      setErrors({ submit: result.error });
      setIsSubmitting(false);
    }
  };

  // Toggle permission selection
  const togglePermission = (permissionId) => {
    setSelectedPermissions((prevSelected) => {
      if (prevSelected.includes(permissionId)) {
        return prevSelected.filter((id) => id !== permissionId);
      } else {
        return [...prevSelected, permissionId];
      }
    });
  };

  // Group permissions by category for better organization
  const groupPermissionsByCategory = () => {
    const groups = {};

    permissions.forEach((permission) => {
      // Extract category from permission name (e.g., "user.create" -> "user")
      const category = permission.name.split(".")[0];

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(permission);
    });

    return groups;
  };

  const permissionGroups = groupPermissionsByCategory();

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? "Edit Role" : "Create New Role"}
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Role name input */}
            <div className="mb-4">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting}
              />
              {errors.name && <InputError message={errors.name} />}
            </div>

            {/* Permissions section */}
            <div>
              <Label>Permissions</Label>
              {errors.permissions && (
                <InputError message={errors.permissions} />
              )}

              <div className="mt-2 border rounded-md p-3 max-h-96 overflow-y-auto">
                {Object.entries(permissionGroups).map(([category, perms]) => (
                  <div key={category} className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2 capitalize border-b pb-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(
                              permission.id
                            )}
                            onChange={() => togglePermission(permission.id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            disabled={isSubmitting}
                          />
                          <label
                            htmlFor={`permission-${permission.id}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3">
                {errors.submit}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Role"
                : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RoleModal;
