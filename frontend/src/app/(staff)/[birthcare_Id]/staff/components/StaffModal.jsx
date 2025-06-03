"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import InputError from "@/components/InputError";

/**
 * Modal component for creating and editing staff members
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @param {Object} props.staff - Staff data for editing (null for create)
 * @param {Array} props.roles - List of available roles
 * @param {boolean} props.isEdit - Whether this is an edit operation
 */
const StaffModal = ({ isOpen, onClose, onSubmit, staff, roles, isEdit }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with staff data if editing
  useEffect(() => {
    if (staff) {
      setFirstname(staff.firstname || "");
      setLastname(staff.lastname || "");
      setMiddlename(staff.middlename || "");
      setEmail(staff.email || "");
      setContactNumber(staff.contact_number || "");
      setAddress(staff.address || "");
      setPassword(""); // Don't populate password for security
      setRoleId(staff.role?.id || "");
    } else {
      // Reset form for creation
      setFirstname("");
      setLastname("");
      setMiddlename("");
      setEmail("");
      setContactNumber("");
      setAddress("");
      setPassword("");
      setRoleId("");
    }
  }, [staff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    let hasErrors = false;
    const newErrors = {};
    
    if (!firstname.trim()) {
      newErrors.firstname = "First name is required";
      hasErrors = true;
    }
    
    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required";
      hasErrors = true;
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      hasErrors = true;
    }
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
      hasErrors = true;
    }
    
    if (!roleId) {
      newErrors.roleId = "Role is required";
      hasErrors = true;
    }
    
    if (!isEdit && !password.trim()) {
      newErrors.password = "Password is required for new staff";
      hasErrors = true;
    } else if (password.trim() && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    const staffData = {
      firstname,
      lastname,
      middlename: middlename || null,
      email,
      contact_number: contactNumber,
      address: address || null,
      role_id: roleId,
    };
    
    // Only include password if it's provided
    if (password.trim()) {
      staffData.password = password;
    }
    
    const result = await onSubmit(staffData);
    
    if (result?.error) {
      setErrors({ submit: result.error });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <Label htmlFor="firstname">First Name*</Label>
                <Input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full mt-1"
                  disabled={isSubmitting}
                />
                {errors.firstname && <InputError message={errors.firstname} />}
              </div>
              
              {/* Last Name */}
              <div>
                <Label htmlFor="lastname">Last Name*</Label>
                <Input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full mt-1"
                  disabled={isSubmitting}
                />
                {errors.lastname && <InputError message={errors.lastname} />}
              </div>
            </div>
            
            {/* Middle Name */}
            <div className="mb-4">
              <Label htmlFor="middlename">Middle Name</Label>
              <Input
                id="middlename"
                type="text"
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Email */}
            <div className="mb-4">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting || isEdit} // Can't edit email for existing users
              />
              {errors.email && <InputError message={errors.email} />}
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed for existing staff.</p>
              )}
            </div>
            
            {/* Contact Number */}
            <div className="mb-4">
              <Label htmlFor="contactNumber">Contact Number*</Label>
              <Input
                id="contactNumber"
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting}
              />
              {errors.contactNumber && <InputError message={errors.contactNumber} />}
            </div>
            
            {/* Address */}
            <div className="mb-4">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting}
              />
            </div>
            
            {/* Password */}
            <div className="mb-4">
              <Label htmlFor="password">
                {isEdit ? "Password (leave blank to keep unchanged)" : "Password*"}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1"
                disabled={isSubmitting}
              />
              {errors.password && <InputError message={errors.password} />}
              {isEdit && (
                <p className="text-xs text-gray-500 mt-1">
                  Only provide a password if you want to change it.
                </p>
              )}
            </div>
            
            {/* Role Selection */}
            <div className="mb-4">
              <Label htmlFor="roleId">Role*</Label>
              <select
                id="roleId"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                disabled={isSubmitting}
              >
                <option value="">Select a role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && <InputError message={errors.roleId} />}
            </div>
            
            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3">
                {errors.submit}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Update Staff' : 'Add Staff'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;

