"use client";
import { useAuth } from "@/hooks/auth";
import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, X } from "lucide-react";

const AddPatientPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [birthCareInfo, setBirthCareInfo] = useState(null);
  
  // Form state - Facility information, basic information and PhilHealth
  const [formData, setFormData] = useState({
    // Facility Information
    facilityName: '',
    
    // Basic Patient Information
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    age: '',
    civilStatus: 'Single',
    address: '',
    contactNo: '',

    // PhilHealth Information
    philhealthNo: '',
    philhealthCategory: 'Direct',
    philhealthDependentName: '',
    philhealthDependentRelation: '',
    philhealthDependentId: ''
  });

  // Fetch birthcare info when component mounts
  useEffect(() => {
    fetchBirthCareInfo();
  }, []);

  const fetchBirthCareInfo = async () => {
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      setBirthCareInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching birth care info:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Authorization check
  if (
    user.system_role_id !== 2 &&
    (user.system_role_id !== 3 ||
      !user.permissions?.includes("manage_appointment"))
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 font-semibold">Unauthorized Access</div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    router.push(`/${birthcare_Id}/patients`);
  };

  const fillSampleData = () => {
    setFormData({
      ...formData,
      lastName: 'Dela Cruz',
      firstName: 'Maria',
      middleName: 'Santos',
      birthDate: '1995-03-15',
      age: '29',
      civilStatus: 'Married',
      address: '123 Barangay Street, City, Province',
      contactNo: '09123456789',
      philhealthNo: '123456789012'
    });
  };

  const handleSave = async () => {
    // Check if facility information is loaded
    if (!birthCareInfo?.name) {
      alert('Facility information is not loaded yet. Please wait.');
      return;
    }
    
    if (!formData.firstName.trim()) {
      alert('Please enter the First Name');
      return;
    }

    if (!formData.lastName.trim()) {
      alert('Please enter the Last Name');
      return;
    }

    if (!formData.birthDate) {
      alert('Please enter the date of birth');
      return;
    }

    if (!formData.age) {
      alert('Please enter the age');
      return;
    }

    if (!formData.address.trim()) {
      alert('Please enter the address');
      return;
    }

    setIsLoading(true);
    
    // Prepare data for backend API matching the simplified Patient model
    const patientData = {
      // Facility information
      facility_name: birthCareInfo.name,
      
      // Patient basic information
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName,
      date_of_birth: formData.birthDate,
      age: parseInt(formData.age),
      civil_status: formData.civilStatus || 'Single',
      address: formData.address,
      contact_number: formData.contactNo || null,
      
      // PhilHealth information
      philhealth_number: formData.philhealthNo || null,
      philhealth_category: formData.philhealthCategory || null,
      philhealth_dependent_name: formData.philhealthDependentName || null,
      philhealth_dependent_relation: formData.philhealthDependentRelation || null,
      philhealth_dependent_id: formData.philhealthDependentId || null,
      
      // Status
      status: 'Active'
    };

    try {
      // Save to backend
      const response = await axios.post(`/api/birthcare/${birthcare_Id}/patients`, patientData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 201) {
        setSuccessMessage('Patient registered successfully!');
        setShowSuccess(true);
        
        // Hide success message and redirect after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          router.push(`/${birthcare_Id}/patients`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        setErrorMessage(`Validation errors:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else {
        setErrorMessage('Error registering patient. Please try again.');
      }
      
      setShowError(true);
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 max-w-md">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{successMessage}</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to patient list...</p>
            </div>
            <button onClick={() => setShowSuccess(false)} className="text-green-400 hover:text-green-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start space-x-3 max-w-md">
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1 whitespace-pre-line">{errorMessage}</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-red-400 hover:text-red-600 flex-shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-8 text-center border-b border-gray-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-4a1 1 0 00-1 1z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-sm font-bold text-gray-800 mb-2">REPUBLIC OF THE PHILIPPINES</h1>
            <h2 className="text-lg font-bold text-gray-900 mb-1">CITY GOVERNMENT OF DAVAO</h2>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              {birthCareInfo?.name?.toUpperCase() || 'BIRTH CARE FACILITY'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {birthCareInfo?.description || 'Loading facility address...'}
            </p>
            <div className="border-t border-b border-gray-300 py-3">
              <h2 className="text-xl font-bold text-gray-900">PATIENT REGISTRATION</h2>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-6">
            {/* Subheader */}
            <div className="mb-8 text-center">
              <button type="button" onClick={fillSampleData} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm">
                Fill Sample Data (for testing)
              </button>
            </div>

            <form className="space-y-8">
              {/* Facility Information */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-6 text-blue-800">Facility Information</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name</label>
                    <input 
                      type="text" 
                      name="facilityName" 
                      value={birthCareInfo?.name || 'Loading facility information...'} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600" 
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">This patient will be registered to the above facility</p>
                  </div>
                </div>
              </div>
              
              {/* Basic Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-gray-800">Basic Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status *</label>
                    <select name="civilStatus" value={formData.civilStatus} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input type="text" name="contactNo" value={formData.contactNo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* PhilHealth Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-gray-800">PhilHealth Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Number</label>
                    <input type="text" name="philhealthNo" value={formData.philhealthNo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Category</label>
                    <select name="philhealthCategory" value={formData.philhealthCategory} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                      <option value="Direct">Direct</option>
                      <option value="Indirect">Indirect</option>
                    </select>
                  </div>
                </div>

                {/* Dependent Information - Only show if Indirect */}
                {formData.philhealthCategory === 'Indirect' && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-4 text-gray-700">Dependent Information</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dependent Name</label>
                        <input type="text" name="philhealthDependentName" value={formData.philhealthDependentName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Member</label>
                        <input type="text" name="philhealthDependentRelation" value={formData.philhealthDependentRelation} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dependent ID</label>
                      <input type="text" name="philhealthDependentId" value={formData.philhealthDependentId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center">
                <button type="button" onClick={handleSave} disabled={isLoading} className={`px-8 py-3 text-white font-semibold rounded-lg ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    'Register Patient'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientPage;
