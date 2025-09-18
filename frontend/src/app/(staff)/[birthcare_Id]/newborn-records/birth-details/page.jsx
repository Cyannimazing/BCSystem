"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth";

export default function BirthDetails() {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [birthCareInfo, setBirthCareInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Birth Details Form Data
  const [birthDetails, setBirthDetails] = useState({
    patient_id: '',
    // Birth Information
    baby_name: '',
    date_of_birth: new Date().toISOString().split('T')[0],
    time_of_birth: new Date().toTimeString().slice(0, 5),
    place_of_birth: '',
    delivery_type: 'normal', // normal, cesarean, assisted
    delivery_complications: '',
    
    // Baby Information
    sex: 'male', // male, female
    weight: '', // in grams
    length: '', // in centimeters
    head_circumference: '', // in centimeters
    chest_circumference: '', // in centimeters
    presentation: 'vertex', // vertex, breech, transverse
    plurality: 'single', // single, twin, triplet
    
    // Health Status
    alive_at_birth: true,
    condition_at_birth: 'good', // good, fair, poor
    resuscitation_required: false,
    resuscitation_details: '',
    
    // Birth Attendant
    attendant_name: '',
    attendant_title: 'doctor', // doctor, midwife, nurse
    attendant_license: '',
    
    // Additional Notes
    birth_defects: '',
    special_conditions: '',
    notes: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchBirthCareInfo();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}/patients`);
      setPatients(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthCareInfo = async () => {
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}`);
      setBirthCareInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching birth care info:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setBirthDetails(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === parseInt(patientId));
    setSelectedPatient(patient);
    setBirthDetails(prev => ({
      ...prev,
      patient_id: patientId
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!birthDetails.patient_id) newErrors.patient_id = 'Patient is required';
    if (!birthDetails.baby_name) newErrors.baby_name = 'Baby\'s name is required';
    if (!birthDetails.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!birthDetails.time_of_birth) newErrors.time_of_birth = 'Time of birth is required';
    if (!birthDetails.place_of_birth) newErrors.place_of_birth = 'Place of birth is required';
    if (!birthDetails.weight) newErrors.weight = 'Weight is required';
    if (!birthDetails.length) newErrors.length = 'Length is required';
    if (!birthDetails.attendant_name) newErrors.attendant_name = 'Attendant name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Here you would typically save to your API
      // const response = await axios.post(`/api/birthcare/${birthcare_Id}/birth-details`, birthDetails);
      console.log('Birth Details to save:', birthDetails);
      alert('Birth details saved successfully!');
    } catch (error) {
      console.error('Error saving birth details:', error);
      alert('Error saving birth details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-8 text-center border-b border-gray-200">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-sm font-bold text-gray-800 mb-2">REPUBLIC OF THE PHILIPPINES</h1>
            <h2 className="text-lg font-bold text-gray-900 mb-1">CITY GOVERNMENT OF DAVAO</h2>
            <h3 className="text-base font-semibold text-gray-800 mb-1">BUHANGIN HEALTH CENTER-BIRTHING HOME</h3>
            <p className="text-sm text-gray-600 mb-4">NHA Buhangin, Buhangin District, Davao City</p>
            <div className="border-t border-b border-gray-300 py-3">
              <h2 className="text-xl font-bold text-gray-900">BIRTH DETAILS RECORD</h2>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Mother/Patient</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  value={birthDetails.patient_id}
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
                {errors.patient_id && <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>}
              </div>
              {selectedPatient && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                  <p className="text-sm text-gray-600">Name: {selectedPatient.first_name} {selectedPatient.last_name}</p>
                  <p className="text-sm text-gray-600">Age: {selectedPatient.age}</p>
                  <p className="text-sm text-gray-600">Contact: {selectedPatient.contact_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Birth Details Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column - Birth Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  Birth Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Baby's Name</label>
                    <input
                      type="text"
                      placeholder="Enter baby's full name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={birthDetails.baby_name}
                      onChange={(e) => handleInputChange('baby_name', e.target.value)}
                    />
                    {errors.baby_name && <p className="text-red-500 text-xs mt-1">{errors.baby_name}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      />
                      {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
                      <input
                        type="time"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.time_of_birth}
                        onChange={(e) => handleInputChange('time_of_birth', e.target.value)}
                      />
                      {errors.time_of_birth && <p className="text-red-500 text-xs mt-1">{errors.time_of_birth}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                    <input
                      type="text"
                      placeholder="Facility name or location"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={birthDetails.place_of_birth}
                      onChange={(e) => handleInputChange('place_of_birth', e.target.value)}
                    />
                    {errors.place_of_birth && <p className="text-red-500 text-xs mt-1">{errors.place_of_birth}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.delivery_type}
                        onChange={(e) => handleInputChange('delivery_type', e.target.value)}
                      >
                        <option value="normal">Normal/Vaginal</option>
                        <option value="cesarean">Cesarean Section</option>
                        <option value="assisted">Assisted Delivery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Presentation</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.presentation}
                        onChange={(e) => handleInputChange('presentation', e.target.value)}
                      >
                        <option value="vertex">Vertex (Head Down)</option>
                        <option value="breech">Breech</option>
                        <option value="transverse">Transverse</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Complications</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows="3"
                      placeholder="Any complications during delivery..."
                      value={birthDetails.delivery_complications}
                      onChange={(e) => handleInputChange('delivery_complications', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Baby Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  Baby Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.sex}
                        onChange={(e) => handleInputChange('sex', e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plurality</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.plurality}
                        onChange={(e) => handleInputChange('plurality', e.target.value)}
                      >
                        <option value="single">Single</option>
                        <option value="twin">Twin</option>
                        <option value="triplet">Triplet</option>
                        <option value="multiple">Multiple</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                      <input
                        type="number"
                        placeholder="e.g. 3250"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                      />
                      {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 50.5"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.length}
                        onChange={(e) => handleInputChange('length', e.target.value)}
                      />
                      {errors.length && <p className="text-red-500 text-xs mt-1">{errors.length}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Head Circumference (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 35.0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.head_circumference}
                        onChange={(e) => handleInputChange('head_circumference', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chest Circumference (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 33.0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        value={birthDetails.chest_circumference}
                        onChange={(e) => handleInputChange('chest_circumference', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Status at Birth</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="alive_at_birth"
                            value="true"
                            checked={birthDetails.alive_at_birth === true}
                            onChange={() => handleInputChange('alive_at_birth', true)}
                            className="mr-2"
                          />
                          Alive at Birth
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="alive_at_birth"
                            value="false"
                            checked={birthDetails.alive_at_birth === false}
                            onChange={() => handleInputChange('alive_at_birth', false)}
                            className="mr-2"
                          />
                          Not Alive at Birth
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition at Birth</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={birthDetails.condition_at_birth}
                      onChange={(e) => handleInputChange('condition_at_birth', e.target.value)}
                    >
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={birthDetails.resuscitation_required}
                        onChange={(e) => handleInputChange('resuscitation_required', e.target.checked)}
                        className="mr-2"
                      />
                      Resuscitation Required
                    </label>
                    {birthDetails.resuscitation_required && (
                      <textarea
                        className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        rows="2"
                        placeholder="Resuscitation details..."
                        value={birthDetails.resuscitation_details}
                        onChange={(e) => handleInputChange('resuscitation_details', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Attendant Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Birth Attendant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attendant Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={birthDetails.attendant_name}
                    onChange={(e) => handleInputChange('attendant_name', e.target.value)}
                  />
                  {errors.attendant_name && <p className="text-red-500 text-xs mt-1">{errors.attendant_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={birthDetails.attendant_title}
                    onChange={(e) => handleInputChange('attendant_title', e.target.value)}
                  >
                    <option value="doctor">Doctor</option>
                    <option value="midwife">Midwife</option>
                    <option value="nurse">Nurse</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                  <input
                    type="text"
                    placeholder="Professional license number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={birthDetails.attendant_license}
                    onChange={(e) => handleInputChange('attendant_license', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Defects/Abnormalities</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows="3"
                    placeholder="Any visible birth defects or abnormalities..."
                    value={birthDetails.birth_defects}
                    onChange={(e) => handleInputChange('birth_defects', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Conditions</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows="3"
                    placeholder="Any special medical conditions or considerations..."
                    value={birthDetails.special_conditions}
                    onChange={(e) => handleInputChange('special_conditions', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    rows="4"
                    placeholder="Any additional observations or notes..."
                    value={birthDetails.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Birth Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}