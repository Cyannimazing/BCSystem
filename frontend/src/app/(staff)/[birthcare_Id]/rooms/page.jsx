"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Label from "@/components/Label";
import InputError from "@/components/InputError";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "@/lib/axios";

const RoomsPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  
  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    beds: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Functions
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/birthcare/${birthcare_Id}/rooms`);
      if (response.data.success) {
        setRooms(response.data.data);
        setLoadingError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoadingError(error.response?.data?.message || error.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (roomData) => {
    try {
      const response = await axios.post(`/api/birthcare/${birthcare_Id}/rooms`, roomData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create room');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateRoom = async (roomId, roomData) => {
    try {
      const response = await axios.put(`/api/birthcare/${birthcare_Id}/rooms/${roomId}`, roomData);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update room');
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(`/api/birthcare/${birthcare_Id}/rooms/${roomId}`);
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete room');
      }
    } catch (error) {
      throw error;
    }
  };

  // Load rooms on component mount
  useEffect(() => {
    if (user && birthcare_Id) {
      fetchRooms();
    }
  }, [user, birthcare_Id]);

  // Initialize form data when editing
  useEffect(() => {
    if (currentRoom) {
      setFormData({
        name: currentRoom.name || "",
        beds: currentRoom.bed_count?.toString() || ""
      });
    } else {
      setFormData({
        name: "",
        beds: ""
      });
    }
  }, [currentRoom]);

  // Filter rooms based on search
  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const openCreateModal = () => {
    setCurrentRoom(null);
    setIsEdit(false);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const openEditModal = (room) => {
    setCurrentRoom(room);
    setIsEdit(true);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentRoom(null);
    setErrors({});
    document.body.style.overflow = 'unset';
  };
  
  // Delete modal handlers
  const openDeleteModal = (room) => {
    setCurrentRoom(room);
    setShowDeleteModal(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentRoom(null);
    document.body.style.overflow = 'unset';
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
    }
    
    if (!formData.beds || formData.beds < 1) {
      newErrors.beds = "Number of beds must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const roomData = {
        name: formData.name.trim(),
        beds: parseInt(formData.beds)
      };
      
      if (isEdit && currentRoom) {
        // Update existing room
        console.log('🔄 Updating room:', currentRoom.id, roomData);
        const updatedRoom = await updateRoom(currentRoom.id, roomData);
        
        // Update room in state
        setRooms(rooms.map(room => 
          room.id === currentRoom.id ? updatedRoom : room
        ));
        
        console.log('✅ Room updated successfully:', updatedRoom);
      } else {
        // Create new room
        console.log('✅ Creating new room:', roomData);
        const newRoom = await createRoom(roomData);
        
        // Add new room to state
        setRooms([...rooms, newRoom]);
        
        console.log('✅ Room created successfully:', newRoom);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error saving room:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          submit: error.response?.data?.message || error.message || "Failed to save room. Please try again." 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!currentRoom) return;
    
    try {
      console.log('🗑️ Deleting room:', currentRoom.id);
      await deleteRoom(currentRoom.id);
      
      // Remove the room from state
      setRooms(rooms.filter(room => room.id !== currentRoom.id));
      
      console.log('✅ Room deleted successfully');
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete room:", error);
      // You might want to show an error message to the user here
      alert(error.response?.data?.message || error.message || 'Failed to delete room');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Effect to add/remove blur effect to entire app layout
  useEffect(() => {
    const appLayout = document.getElementById('app-layout');
    if ((showModal || showDeleteModal) && appLayout) {
      appLayout.style.filter = 'blur(4px)';
      appLayout.style.pointerEvents = 'none';
    } else if (appLayout) {
      appLayout.style.filter = 'none';
      appLayout.style.pointerEvents = 'auto';
    }
    return () => {
      if (appLayout) {
        appLayout.style.filter = 'none';
        appLayout.style.pointerEvents = 'auto';
      }
    };
  }, [showModal, showDeleteModal]);

  return (
    <>
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Room Management
          </h1>
          <Button
            onClick={openCreateModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Room</span>
          </Button>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search rooms by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2"
          />
        </div>

        {/* Rooms Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading rooms...</p>
            </div>
          ) : loadingError ? (
            <div className="py-8 text-center text-red-500">
              <p>Error: {loadingError}</p>
              <button 
                onClick={fetchRooms}
                className="mt-2 text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Try again
              </button>
            </div>
          ) : filteredRooms.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number of Beds
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {room.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {room.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {(() => {
                          const bedCount = room.bed_count || 0;
                          return `${bedCount} ${bedCount === 1 ? 'bed' : 'beds'}`;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Edit Room"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(room)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Room"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-gray-500">
              {searchTerm ? (
                <p>No rooms match your search criteria.</p>
              ) : (
                <p>No rooms found. Add a new room to get started.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Room Modal - Rendered outside app layout using portal */}
      {showModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Room Name */}
                <div>
                  <Label htmlFor="name">Room Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full mt-1"
                    placeholder="e.g., Room 101"
                    disabled={isSubmitting}
                  />
                  {errors.name && <InputError message={errors.name} />}
                </div>

                {/* Number of Beds */}
                <div>
                  <Label htmlFor="beds">Number of Beds *</Label>
                  <Input
                    id="beds"
                    type="number"
                    min="1"
                    value={formData.beds}
                    onChange={(e) => setFormData({...formData, beds: e.target.value})}
                    className="w-full mt-1"
                    placeholder="e.g., 2"
                    disabled={isSubmitting}
                  />
                  {errors.beds && <InputError message={errors.beds} />}
                </div>

                {errors.submit && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                    {errors.submit}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      
      {/* Delete Confirmation Modal - Rendered outside app layout using portal */}
      {showDeleteModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={closeDeleteModal}
        >
          <div 
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Delete Room
              </h3>
              
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{currentRoom?.name}</span>? 
                This will also delete all {currentRoom?.bed_count || 0} bed{(currentRoom?.bed_count || 0) === 1 ? '' : 's'} associated with this room.
                This action cannot be undone.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Room
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default RoomsPage;
