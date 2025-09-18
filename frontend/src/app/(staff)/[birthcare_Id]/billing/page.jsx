"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function BillingPage() {
  const { birthcare_Id } = useParams();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedService, setSelectedService] = useState(null);
  const [showSampleData, setShowSampleData] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    price: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sample template data for demonstration
  const sampleServices = [
    {
      id: 1,
      service_name: "Prenatal Consultation",
      description: "Comprehensive prenatal check-up including physical examination, fetal monitoring, and health assessment",
      price: 1500.00,
      is_active: true,
      category: "Consultation"
    },
    {
      id: 2,
      service_name: "Ultrasound (2D)",
      description: "Basic 2D ultrasound examination for fetal development monitoring",
      price: 800.00,
      is_active: true,
      category: "Diagnostic"
    },
    {
      id: 3,
      service_name: "Ultrasound (4D)",
      description: "Advanced 4D ultrasound imaging with detailed fetal visualization",
      price: 2500.00,
      is_active: true,
      category: "Diagnostic"
    },
    {
      id: 4,
      service_name: "Laboratory Tests Package",
      description: "Complete blood count, urinalysis, blood sugar, and other essential lab tests",
      price: 1200.00,
      is_active: true,
      category: "Laboratory"
    },
    {
      id: 5,
      service_name: "Normal Delivery",
      description: "Standard vaginal delivery including labor monitoring and post-delivery care",
      price: 25000.00,
      is_active: true,
      category: "Delivery"
    },
    {
      id: 6,
      service_name: "Cesarean Section",
      description: "Surgical delivery procedure including pre-op, surgery, and post-op care",
      price: 45000.00,
      is_active: true,
      category: "Surgery"
    },
    {
      id: 7,
      service_name: "Newborn Care Package",
      description: "Complete newborn examination, vaccinations, and initial care services",
      price: 3500.00,
      is_active: true,
      category: "Pediatric"
    },
    {
      id: 8,
      service_name: "Room Accommodation (Private)",
      description: "Private room with air conditioning, private bathroom, and amenities (per day)",
      price: 2500.00,
      is_active: true,
      category: "Accommodation"
    },
    {
      id: 9,
      service_name: "Room Accommodation (Semi-Private)",
      description: "Semi-private room with shared facilities (per day)",
      price: 1800.00,
      is_active: true,
      category: "Accommodation"
    },
    {
      id: 10,
      service_name: "Postpartum Care",
      description: "Post-delivery care including wound care, breastfeeding support, and recovery monitoring",
      price: 2000.00,
      is_active: true,
      category: "Care"
    },
    {
      id: 11,
      service_name: "Family Planning Consultation",
      description: "Consultation and guidance on contraceptive methods and family planning",
      price: 800.00,
      is_active: true,
      category: "Consultation"
    },
    {
      id: 12,
      service_name: "Emergency Consultation",
      description: "After-hours emergency consultation and immediate care",
      price: 3000.00,
      is_active: true,
      category: "Emergency"
    }
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/billing`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      const fetchedServices = data.data || [];
      
      // If no services are fetched and sample data is not shown, show sample data
      if (fetchedServices.length === 0 && !showSampleData) {
        setShowSampleData(true);
        setServices(sampleServices);
      } else {
        setServices(fetchedServices);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
      // Show sample data on API error
      if (!showSampleData) {
        setShowSampleData(true);
        setServices(sampleServices);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setShowSampleData(true);
    setServices(sampleServices);
    setSuccess('Sample template data loaded successfully!');
  };

  const clearSampleData = () => {
    setShowSampleData(false);
    setServices([]);
    setSuccess('Sample data cleared. Ready for real data.');
  };

  // Filter services based on search and active status
  useEffect(() => {
    let filtered = services;
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (showActiveOnly) {
      filtered = filtered.filter(service => service.is_active);
    }
    
    setFilteredServices(filtered);
  }, [services, searchTerm, showActiveOnly]);

  useEffect(() => {
    if (birthcare_Id) {
      fetchServices();
    }
  }, [birthcare_Id]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.service_name.trim()) {
      errors.service_name = 'Service name is required';
    }
    
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Valid price is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      service_name: '',
      description: '',
      price: '',
      is_active: true
    });
    setFormErrors({});
    setSelectedService(null);
  };

  // Open modal functions
  const openCreateModal = () => {
    resetForm();
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setFormData({
      service_name: service.service_name,
      description: service.description || '',
      price: service.price.toString(),
      is_active: service.is_active
    });
    setSelectedService(service);
    setModalType('edit');
    setShowModal(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setModalType('delete');
    setShowModal(true);
  };

  // CRUD Operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      let url = `${API_BASE_URL}/birthcare/${birthcare_Id}/billing`;
      let method = 'POST';
      
      if (modalType === 'edit') {
        url += `/${selectedService.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          service_name: formData.service_name.trim(),
          description: formData.description.trim() || null,
          price: parseFloat(formData.price),
          is_active: formData.is_active
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalType} service`);
      }
      
      setSuccess(`Service ${modalType === 'create' ? 'created' : 'updated'} successfully`);
      setShowModal(false);
      fetchServices();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/billing/${selectedService.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete service');
      }
      
      setSuccess('Service deleted successfully');
      setShowModal(false);
      fetchServices();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading patient charges...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Charges Management</h1>
            <p className="text-gray-600 mt-2">Manage medical services, procedures, and billing rates</p>
            {showSampleData && (
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                📋 Sample Template Data Active
              </div>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex gap-2">
            {showSampleData ? (
              <button
                onClick={clearSampleData}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                🗑️ Clear Sample Data
              </button>
            ) : (
              <button
                onClick={loadSampleData}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                📋 Load Sample Template
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{filteredServices.length}</p>
              <p className="text-sm text-gray-600">Total Services</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{filteredServices.filter(s => s.is_active).length}</p>
              <p className="text-sm text-gray-600">Active Services</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">₱{filteredServices.reduce((sum, s) => sum + parseFloat(s.price || 0), 0).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">
                {filteredServices.length > 0 ? [...new Set(filteredServices.map(s => s.category).filter(Boolean))].length : 0}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services..."
              className="w-full sm:w-80 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 pl-4 pr-10 py-2.5"
            />
            <svg className="absolute right-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active only</span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Service
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Medical Services & Charges ({filteredServices.length})</h2>
          <p className="text-sm text-gray-600 mt-1">Manage healthcare services and their corresponding billing rates</p>
        </div>

        {filteredServices.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h0a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first medical service or load sample template data.</p>
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={loadSampleData}
                className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
              >
                📋 Load Sample Data
              </button>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                + Add Service
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service, index) => (
                  <tr key={service.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mr-3"></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.service_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {service.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {service.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-500 truncate">
                        {service.description || 'No description provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        ₱{parseFloat(service.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          service.is_active ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        {!showSampleData && (
                          <button
                            onClick={() => openDeleteModal(service)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg">
            {(modalType === 'create' || modalType === 'edit') && (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalType === 'create' ? 'Add Service' : 'Edit Service'}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Name</label>
                  <input
                    type="text"
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {formErrors.service_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.service_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">Active</label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : (modalType === 'create' ? 'Create' : 'Save changes')}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'delete' && (
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Service</h3>
                <p className="text-gray-700">Are you sure you want to delete "{selectedService?.service_name}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-3 pt-6">
                  <button onClick={closeModal} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={submitting} className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50">
                    {submitting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
