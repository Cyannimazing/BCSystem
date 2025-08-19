"use client";
import { useAuth } from "@/hooks/auth";
import React, { useState } from "react";
import axios from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, X } from "lucide-react";

const AddPatientPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    // Patient Information
    lastName: '',
    firstName: '',
    middleName: '',
    birthDate: '',
    age: '',
    civilStatus: 'Single',
    birthPlace: '',
    education: '',
    occupation: '',
    employmentStatus: '',
    monthlyIncome: '',
    tin: '',
    lmp: '',
    edc: '',
    gpad: '',
    term: '',
    preterm: '',
    menarche: '',
    periodDuration: '',
    intervalCycle: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Husband Information
    husbandLastName: '',
    husbandFirstName: '',
    husbandMiddleName: '',
    husbandBirthDate: '',
    husbandAge: '',
    husbandOccupation: '',
    husbandEmployment: '',
    religion: '',
    address: '',
    contactNo: '',
    facilityHouseholdNumber: '',
    familySerialNumber: '',
    tribe: '',
    
    // Marriage Information
    maidenLastName: '',
    maidenMiddleName: '',
    
    // PhilHealth Information
    philhealthNo: '',
    philhealthCategory: '',
    
    // Dependent Information
    relationshipToMember: '',
    memberFirstName: '',
    memberLastName: '',
    memberMiddleName: '',
    memberSuffix: '',
    memberBirthDate: '',
    philhealthMemberNo: '',
    philhealthDependentNo: '',
    philhealthDependentCategory: ''
  });
  
  // Tracking table rows
  const [trackingRows, setTrackingRows] = useState([
    { date: '', wt: '', ht: '', bp: '', aog: '', ttStatus: '', fh: '', fht: '', remarks: '' }
  ]);

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
  
  const handleTrackingChange = (index, field, value) => {
    const newRows = [...trackingRows];
    newRows[index][field] = value;
    setTrackingRows(newRows);
  };
  
  const addTrackingRow = () => {
    setTrackingRows([...trackingRows, 
      { date: '', wt: '', ht: '', bp: '', aog: '', ttStatus: '', fh: '', fht: '', remarks: '' }
    ]);
  };
  
  const removeTrackingRow = (index) => {
    if (trackingRows.length > 1) {
      const newRows = trackingRows.filter((_, i) => i !== index);
      setTrackingRows(newRows);
    }
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
      lmp: '2024-01-15',
      religion: 'Roman Catholic',
      occupation: 'Housewife'
    });
  };

  const handleSave = async () => {
    // Simple validation - only truly required fields
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

    // Calculate EDC from LMP if available
    let edcDate = null;
    if (formData.lmp) {
      const lmpDate = new Date(formData.lmp);
      const edcCalculated = new Date(lmpDate);
      edcCalculated.setDate(lmpDate.getDate() + 280); // 40 weeks
      edcDate = edcCalculated.toISOString().split('T')[0];
    }
    
    // Prepare data for backend API matching the Patient model
    const patientData = {
      // Patient basic information
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName,
      date_of_birth: formData.birthDate,
      age: parseInt(formData.age),
      civil_status: formData.civilStatus || 'Single',
      religion: formData.religion || null,
      occupation: formData.occupation || null,
      address: formData.address,
      contact_number: formData.contactNo || null,
      emergency_contact_name: formData.emergencyContactName || null,
      emergency_contact_number: formData.emergencyContactNumber || null,
      
      // Husband information
      husband_first_name: formData.husbandFirstName || null,
      husband_middle_name: formData.husbandMiddleName || null,
      husband_last_name: formData.husbandLastName || null,
      husband_date_of_birth: formData.husbandBirthDate || null,
      husband_age: formData.husbandAge ? parseInt(formData.husbandAge) : null,
      husband_occupation: formData.husbandOccupation || null,
      
      // Medical information
      lmp: formData.lmp || null,
      edc: edcDate || formData.edc || null,
      gravida: formData.gpad ? parseInt(formData.gpad) : 0,
      para: formData.para ? parseInt(formData.para) : 0,
      term: formData.term ? parseInt(formData.term) : 0,
      preterm: formData.preterm ? parseInt(formData.preterm) : 0,
      abortion: formData.abortion ? parseInt(formData.abortion) : 0,
      living_children: formData.livingChildren ? parseInt(formData.livingChildren) : 0,
      
      // PhilHealth information
      philhealth_number: formData.philhealthNo || null,
      philhealth_category: formData.philhealthCategory || null,
      philhealth_dependent_name: formData.memberFirstName ? 
        `${formData.memberFirstName} ${formData.memberMiddleName || ''} ${formData.memberLastName}`.trim() : null,
      philhealth_dependent_relation: formData.relationshipToMember || null,
      philhealth_dependent_id: formData.philhealthDependentNo || null,
      
      // Additional medical history
      medical_history: formData.medicalHistory || null,
      allergies: formData.allergies || null,
      current_medications: formData.currentMedications || null,
      previous_pregnancies: formData.previousPregnancies || null,
      
      // Status
      status: 'Active',
      notes: formData.remarks || null
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
        setSuccessMessage('Patient added successfully!');
        setShowSuccess(true);
        
        // Hide success message and redirect after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          router.push(`/${birthcare_Id}/patients`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      console.error('Request data:', patientData);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        setErrorMessage(`Validation errors:\n${errorMessages}`);
      } else if (error.response?.data?.message) {
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else if (error.message) {
        setErrorMessage(`Network Error: ${error.message}`);
      } else {
        setErrorMessage('Error saving patient. Please try again.');
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
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 max-w-md">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">{successMessage}</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to patient list...</p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-green-400 hover:text-green-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
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
            <button
              onClick={() => setShowError(false)}
              className="text-red-400 hover:text-red-600 flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="px-6 py-6 h-full flex flex-col">
            {/* Back button and Header */}
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4 font-medium"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Patient List
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">ADD NEW PATIENT</h1>
                <p className="text-gray-600 mb-4">Complete the pre-natal form to add a new patient</p>
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Fill Sample Data (for testing)
                </button>
              </div>
            </div>

            <form className="space-y-8">
              {/* Patient Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Last Name</label>
                    <input
                      type="text"
                      name="husbandLastName"
                      value={formData.husbandLastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's First Name</label>
                    <input
                      type="text"
                      name="husbandFirstName"
                      value={formData.husbandFirstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Middle Name</label>
                    <input
                      type="text"
                      name="husbandMiddleName"
                      value={formData.husbandMiddleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Birth Date</label>
                    <input
                      type="date"
                      name="husbandBirthDate"
                      value={formData.husbandBirthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Age</label>
                    <input
                      type="number"
                      name="husbandAge"
                      value={formData.husbandAge}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Occupation</label>
                    <input
                      type="text"
                      name="husbandOccupation"
                      value={formData.husbandOccupation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Educational Attainment</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Husband's Employment Status</label>
                    <input
                      type="text"
                      name="husbandEmployment"
                      value={formData.husbandEmployment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status *</label>
                    <select
                      name="civilStatus"
                      value={formData.civilStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
                    <input
                      type="text"
                      name="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label>
                    <input
                      type="text"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
                    <input
                      type="text"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TIN</label>
                    <input
                      type="text"
                      name="tin"
                      value={formData.tin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facility Household Number</label>
                    <input
                      type="text"
                      name="facilityHouseholdNumber"
                      value={formData.facilityHouseholdNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Family Serial Number</label>
                    <input
                      type="text"
                      name="familySerialNumber"
                      value={formData.familySerialNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LMP</label>
                    <input
                      type="date"
                      name="lmp"
                      value={formData.lmp}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">EDC</label>
                    <input
                      type="date"
                      name="edc"
                      value={formData.edc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tribe</label>
                    <input
                      type="text"
                      name="tribe"
                      value={formData.tribe}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPAD</label>
                    <input
                      type="text"
                      name="gpad"
                      value={formData.gpad}
                      onChange={handleInputChange}
                      placeholder="G___ P___ A___ D___"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                    <input
                      type="text"
                      name="term"
                      value={formData.term}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preterm</label>
                    <input
                      type="text"
                      name="preterm"
                      value={formData.preterm}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menarche</label>
                    <input
                      type="text"
                      name="menarche"
                      value={formData.menarche}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period Duration</label>
                    <input
                      type="text"
                      name="periodDuration"
                      value={formData.periodDuration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interval/Cycle</label>
                    <input
                      type="text"
                      name="intervalCycle"
                      value={formData.intervalCycle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Marriage Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Marriage Information (For Married)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maiden Last Name</label>
                    <input
                      type="text"
                      name="maidenLastName"
                      value={formData.maidenLastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maiden Middle Name</label>
                    <input
                      type="text"
                      name="maidenMiddleName"
                      value={formData.maidenMiddleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* PhilHealth Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">PhilHealth Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth No.</label>
                    <input
                      type="text"
                      name="philhealthNo"
                      value={formData.philhealthNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Category</label>
                    <input
                      type="text"
                      name="philhealthCategory"
                      value={formData.philhealthCategory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Dependent Information */}
                <h4 className="text-md font-semibold mt-6 mb-4 text-gray-700">If Dependent (Ask for MDR)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Member</label>
                    <input
                      type="text"
                      name="relationshipToMember"
                      value={formData.relationshipToMember}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member's Birth Date</label>
                    <input
                      type="date"
                      name="memberBirthDate"
                      value={formData.memberBirthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member's First Name</label>
                    <input
                      type="text"
                      name="memberFirstName"
                      value={formData.memberFirstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member's Last Name</label>
                    <input
                      type="text"
                      name="memberLastName"
                      value={formData.memberLastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member's Middle Name</label>
                    <input
                      type="text"
                      name="memberMiddleName"
                      value={formData.memberMiddleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Member's Suffix</label>
                    <input
                      type="text"
                      name="memberSuffix"
                      value={formData.memberSuffix}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Member No.</label>
                    <input
                      type="text"
                      name="philhealthMemberNo"
                      value={formData.philhealthMemberNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Dependent No.</label>
                    <input
                      type="text"
                      name="philhealthDependentNo"
                      value={formData.philhealthDependentNo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">PhilHealth Dependent Category</label>
                  <input
                    type="text"
                    name="philhealthDependentCategory"
                    value={formData.philhealthDependentCategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Tracking Table */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Initial Tracking Information</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">Date</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">WT</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">HT</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">B/P</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">AOG</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">TT Status</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">FH</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">FHT</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">Remarks</th>
                        <th className="border border-gray-300 px-2 py-1 text-xs font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingRows.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="date"
                              value={row.date}
                              onChange={(e) => handleTrackingChange(index, 'date', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.wt}
                              onChange={(e) => handleTrackingChange(index, 'wt', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.ht}
                              onChange={(e) => handleTrackingChange(index, 'ht', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.bp}
                              onChange={(e) => handleTrackingChange(index, 'bp', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.aog}
                              onChange={(e) => handleTrackingChange(index, 'aog', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.ttStatus}
                              onChange={(e) => handleTrackingChange(index, 'ttStatus', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.fh}
                              onChange={(e) => handleTrackingChange(index, 'fh', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.fht}
                              onChange={(e) => handleTrackingChange(index, 'fht', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1">
                            <input
                              type="text"
                              value={row.remarks}
                              onChange={(e) => handleTrackingChange(index, 'remarks', e.target.value)}
                              className="w-full px-1 py-1 text-xs border-0 focus:outline-none"
                            />
                          </td>
                          <td className="border border-gray-300 p-1 text-center">
                            {trackingRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTrackingRow(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <button
                  type="button"
                  onClick={addTrackingRow}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Row
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`px-8 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Patient...
                    </div>
                  ) : (
                    'Add Patient'
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
