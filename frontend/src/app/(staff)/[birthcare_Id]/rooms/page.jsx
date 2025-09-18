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

const RoomsPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  
  // State management
  const [rooms, setRooms] = useState([
    // Mock data - replace with actual API calls later
    { id: 1, name: "Room 101" },
    { id: 2, name: "Room 102" },
    { id: 3, name: "Room 201" },
    { id: 4, name: "Room 202" },
    { id: 5, name: "Room 301" },
  ]);
  
  // Separate beds state to simulate the beds table
  const [beds, setBeds] = useState([
    // Mock bed data - each bed has id, bed_no, room_id
    { id: 1, bed_no: 1, room_id: 1 },
    { id: 2, bed_no: 2, room_id: 1 },
    { id: 3, bed_no: 1, room_id: 2 },
    { id: 4, bed_no: 1, room_id: 3 },
    { id: 5, bed_no: 2, room_id: 3 },
    { id: 6, bed_no: 3, room_id: 3 },
    { id: 7, bed_no: 4, room_id: 3 },
    { id: 8, bed_no: 1, room_id: 4 },
    { id: 9, bed_no: 2, room_id: 4 },
    { id: 10, bed_no: 1, room_id: 5 },
  ]);
  
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
  
  // Helper function to count beds for a room
  const getBedCount = (roomId) => {
    return beds.filter(bed => bed.room_id === roomId).length;
  };
  
  // Helper function to get next bed ID
  const getNextBedId = () => {
    return beds.length > 0 ? Math.max(...beds.map(b => b.id)) + 1 : 1;
  };
  
  // Helper function to create bed records for a room (for new rooms)
  const createBedsForRoom = (roomId, bedCount) => {
    const newBeds = [];
    let nextBedId = getNextBedId();
    
    for (let i = 1; i <= bedCount; i++) {
      newBeds.push({
        id: nextBedId++,
        bed_no: i,
        room_id: roomId
      });
    }
    
    return newBeds;
  };
  
  // Helper function to update bed records for existing room
  const updateBedsForRoom = (roomId, newBedCount) => {
    const currentBeds = beds.filter(bed => bed.room_id === roomId);
    const currentBedCount = currentBeds.length;
    const otherBeds = beds.filter(bed => bed.room_id !== roomId);
    
    if (newBedCount === currentBedCount) {
      // No change needed
      return beds;
    } else if (newBedCount < currentBedCount) {
      // Remove beds from highest bed_no
      const sortedBeds = currentBeds.sort((a, b) => a.bed_no - b.bed_no);
      const bedsToKeep = sortedBeds.slice(0, newBedCount);
      return [...otherBeds, ...bedsToKeep];
    } else {
      // Add new beds starting from next bed number
      const maxBedNo = currentBeds.length > 0 ? Math.max(...currentBeds.map(b => b.bed_no)) : 0;
      const newBeds = [...currentBeds];
      let nextBedId = getNextBedId();
      
      for (let i = maxBedNo + 1; i <= newBedCount; i++) {
        newBeds.push({
          id: nextBedId++,
          bed_no: i,
          room_id: roomId
        });
      }
      
      return [...otherBeds, ...newBeds];
    }
  };

  // Initialize form data when editing
  useEffect(() => {
    if (currentRoom) {
      const bedCount = getBedCount(currentRoom.id);
      setFormData({
        name: currentRoom.name || "",
        beds: bedCount.toString()
      });
    } else {
      setFormData({
        name: "",
        beds: ""
      });
    }
  }, [currentRoom, beds]);

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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bedCount = parseInt(formData.beds);
      
      if (isEdit && currentRoom) {
        // Update existing room
        const roomData = {
          name: formData.name.trim()
        };
        
        const oldBedCount = getBedCount(currentRoom.id);
        const updatedBeds = updateBedsForRoom(currentRoom.id, bedCount);
        const bedsForThisRoom = updatedBeds.filter(bed => bed.room_id === currentRoom.id);
        
        // Console log for UPDATE operation
        console.log('🔄 ROOM UPDATE OPERATION:');
        console.log('Room Data:', {
          id: currentRoom.id,
          name: roomData.name,
          old_bed_count: oldBedCount,
          new_bed_count: bedCount
        });
        console.log('Bed Data for this room:', bedsForThisRoom);
        console.log('All beds after update:', updatedBeds);
        
        // Update room name
        setRooms(rooms.map(room => 
          room.id === currentRoom.id 
            ? { ...room, ...roomData }
            : room
        ));
        
        // Update beds using smart logic
        setBeds(updatedBeds);
      } else {
        // Create new room
        const newRoomId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
        const newRoom = {
          id: newRoomId,
          name: formData.name.trim()
        };
        
        // Create bed records for the new room
        const newBedsForRoom = createBedsForRoom(newRoomId, bedCount);
        
        // Console log for CREATE operation
        console.log('✅ ROOM CREATE OPERATION:');
        console.log('Room Data:', newRoom);
        console.log('Bed Data:', newBedsForRoom);
        console.log('Total beds count:', bedCount);
        
        // Add the new room
        setRooms([...rooms, newRoom]);
        
        // Add bed records
        setBeds([...beds, ...newBedsForRoom]);
      }
      
      closeModal();
    } catch (error) {
      setErrors({ submit: "Failed to save room. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!currentRoom) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const roomId = currentRoom.id;
      const bedsToDelete = beds.filter(bed => bed.room_id === roomId);
      
      // Console log for DELETE operation
      console.log('🗑️ ROOM DELETE OPERATION:');
      console.log('Room Data:', currentRoom);
      console.log('Beds to delete:', bedsToDelete);
      console.log('Total beds deleted:', bedsToDelete.length);
      
      // Remove the room
      setRooms(rooms.filter(room => room.id !== roomId));
      
      // Remove all beds associated with this room
      setBeds(beds.filter(bed => bed.room_id !== roomId));
      
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete room:", error);
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
          {filteredRooms.length > 0 ? (
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
                          const bedCount = getBedCount(room.id);
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
                This will also delete all {getBedCount(currentRoom?.id || 0)} bed{getBedCount(currentRoom?.id || 0) === 1 ? '' : 's'} associated with this room.
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
