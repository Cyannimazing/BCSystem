"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth.jsx";

const PatientAdmissionPage = () => {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient_id: "",
    admission_date: new Date().toISOString().split('T')[0],
    admission_time: new Date().toTimeString().slice(0, 5),
    admission_type: "regular",
    chief_complaint: "",
    reason_for_admission: "",
    medical_history: "",
    allergies: "",
    current_medications: "",
    vital_signs_temperature: "",
    vital_signs_blood_pressure: "",
    vital_signs_heart_rate: "",
    vital_signs_respiratory_rate: "",
    vital_signs_oxygen_saturation: "",
    weight: "",
    height: "",
    // Admission-specific fields
    attending_physician: "",
    primary_nurse: "",
    room_number: "",
    bed_number: "",
    ward_section: "",
    admission_source: "",
    insurance_information: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
    patient_belongings: "",
    special_dietary_requirements: "",
    mobility_assistance_needed: false,
    fall_risk_assessment: "low",
    isolation_precautions: "",
    patient_orientation_completed: false,
    family_notification_completed: false,
    advance_directives: "",
    discharge_planning_needs: "",
    physical_examination: "",
    initial_diagnosis: "",
    treatment_plan: "",
    status: "admitted",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch patients for dropdown
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/patients`
      );
      const patientsData = response.data.data || response.data;
      setPatients(patientsData);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && birthcare_Id) {
      fetchPatients();
    }
  }, [user, birthcare_Id]);

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Fill sample data for testing
  const fillSampleData = () => {
    const firstPatientId = patients.length > 0 ? patients[0].id : "";
    
    setFormData({
      ...formData,
      patient_id: firstPatientId,
      admission_type: "emergency",
      chief_complaint: "Severe abdominal pain and contractions",
      reason_for_admission: "Patient presents with regular contractions every 3-5 minutes, cervical dilation of 4cm, and rupture of membranes. Admitted for active labor management and delivery.",
      medical_history: "Previous cesarean section (2020), gestational diabetes in previous pregnancy, no other significant medical history.",
      allergies: "Penicillin (rash), Latex (contact dermatitis)",
      current_medications: "Prenatal vitamins, Iron supplements, Folic acid 400mcg daily",
      vital_signs_temperature: "37.2",
      vital_signs_blood_pressure: "130/85",
      vital_signs_heart_rate: "88",
      vital_signs_respiratory_rate: "18",
      vital_signs_oxygen_saturation: "98",
      weight: "68.5",
      height: "165.0",
      attending_physician: "Dr. Maria Santos",
      primary_nurse: "Nurse Jane Doe",
      room_number: "201",
      bed_number: "A2",
      ward_section: "labor_delivery",
      admission_source: "emergency",
      insurance_information: "PhilHealth Member - Active, Policy #: 123456789012. Coverage includes maternity benefits and newborn care.",
      emergency_contact_name: "Juan Dela Cruz",
      emergency_contact_relationship: "Spouse",
      emergency_contact_phone: "09123456789",
      patient_belongings: "Mobile phone, charger, personal toiletries, birth plan documents, insurance cards",
      special_dietary_requirements: "Diabetic diet - low sugar, high fiber. No seafood due to allergies.",
      mobility_assistance_needed: true,
      fall_risk_assessment: "moderate",
      isolation_precautions: "Standard precautions",
      patient_orientation_completed: true,
      family_notification_completed: true,
      advance_directives: "No DNR orders. Patient wishes for natural birth if possible, but consents to C-section if medically necessary.",
      discharge_planning_needs: "Postpartum care education, breastfeeding support, newborn care instructions, follow-up appointment scheduling",
      physical_examination: "Gravid uterus at 39 weeks gestation, fetal heart rate 140-150 bpm, vertex presentation, cervix 4cm dilated and 80% effaced, membranes ruptured with clear fluid.",
      initial_diagnosis: "Active labor at 39 weeks gestation, G2P1, previous C-section",
      treatment_plan: "Continuous fetal monitoring, IV hydration, pain management as requested, prepare for vaginal delivery with C-section backup plan",
      status: "admitted",
      notes: "Patient is anxious about VBAC (vaginal birth after cesarean). Discussed risks and benefits. Birth plan reviewed and documented. Partner present and supportive."
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`/api/birthcare/${birthcare_Id}/patient-admissions`, formData);
      alert('Patient admission created successfully!');
      
      // Reset form
      setFormData({
        patient_id: "",
        admission_date: new Date().toISOString().split('T')[0],
        admission_time: new Date().toTimeString().slice(0, 5),
        admission_type: "regular",
        chief_complaint: "",
        reason_for_admission: "",
        medical_history: "",
        allergies: "",
        current_medications: "",
        vital_signs_temperature: "",
        vital_signs_blood_pressure: "",
        vital_signs_heart_rate: "",
        vital_signs_respiratory_rate: "",
        vital_signs_oxygen_saturation: "",
        weight: "",
        height: "",
        attending_physician: "",
        primary_nurse: "",
        room_number: "",
        bed_number: "",
        ward_section: "",
        admission_source: "",
        insurance_information: "",
        emergency_contact_name: "",
        emergency_contact_relationship: "",
        emergency_contact_phone: "",
        patient_belongings: "",
        special_dietary_requirements: "",
        mobility_assistance_needed: false,
        fall_risk_assessment: "low",
        isolation_precautions: "",
        patient_orientation_completed: false,
        family_notification_completed: false,
        advance_directives: "",
        discharge_planning_needs: "",
        physical_examination: "",
        initial_diagnosis: "",
        treatment_plan: "",
        status: "admitted",
        notes: "",
      });
      
    } catch (error) {
      console.error('Error creating admission:', error);
      alert('Error creating admission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading patients...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="px-6 py-6 h-full flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Patient Admission</h1>
                <p className="text-gray-600 mb-4">
                  Complete patient admission form for the birthing facility
                </p>
                <button 
                  type="button" 
                  onClick={fillSampleData} 
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                >
                  Fill Sample Data (for testing)
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Patient *
                  </label>
                  <select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Choose a patient --</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {`${patient.first_name} ${patient.middle_name || ""} ${patient.last_name}`.trim()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Admission Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Admission Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admission Date *
                      </label>
                      <input
                        type="date"
                        name="admission_date"
                        value={formData.admission_date}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admission Time *
                      </label>
                      <input
                        type="time"
                        name="admission_time"
                        value={formData.admission_time}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admission Type *
                      </label>
                      <select
                        name="admission_type"
                        value={formData.admission_type}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="regular">Regular</option>
                        <option value="emergency">Emergency</option>
                        <option value="referral">Referral</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Chief Complaint & Present Illness */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chief Complaint
                      </label>
                      <input
                        type="text"
                        name="chief_complaint"
                        value={formData.chief_complaint}
                        onChange={handleFormChange}
                        placeholder="Main reason for admission"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="admitted">Admitted</option>
                        <option value="active">Active</option>
                        <option value="discharged">Discharged</option>
                        <option value="transferred">Transferred</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Admission
                    </label>
                    <textarea
                      name="reason_for_admission"
                      value={formData.reason_for_admission}
                      onChange={handleFormChange}
                      rows={4}
                      placeholder="Detailed reason for admission to the birthing facility"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical History
                      </label>
                      <textarea
                        name="medical_history"
                        value={formData.medical_history}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Past medical conditions, surgeries, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allergies
                      </label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleFormChange}
                        rows={2}
                        placeholder="Known allergies (drugs, food, environmental)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>

                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                        Current Medications
                      </label>
                      <textarea
                        name="current_medications"
                        value={formData.current_medications}
                        onChange={handleFormChange}
                        rows={2}
                        placeholder="Current medications and dosages"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Vital Signs */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature
                      </label>
                      <input
                        type="text"
                        name="vital_signs_temperature"
                        value={formData.vital_signs_temperature}
                        onChange={handleFormChange}
                        placeholder="°C"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Pressure
                      </label>
                      <input
                        type="text"
                        name="vital_signs_blood_pressure"
                        value={formData.vital_signs_blood_pressure}
                        onChange={handleFormChange}
                        placeholder="mmHg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heart Rate
                      </label>
                      <input
                        type="text"
                        name="vital_signs_heart_rate"
                        value={formData.vital_signs_heart_rate}
                        onChange={handleFormChange}
                        placeholder="bpm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Respiratory Rate
                      </label>
                      <input
                        type="text"
                        name="vital_signs_respiratory_rate"
                        value={formData.vital_signs_respiratory_rate}
                        onChange={handleFormChange}
                        placeholder="rpm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O2 Saturation
                      </label>
                      <input
                        type="text"
                        name="vital_signs_oxygen_saturation"
                        value={formData.vital_signs_oxygen_saturation}
                        onChange={handleFormChange}
                        placeholder="%"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Physical Measurements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="weight"
                        value={formData.weight}
                        onChange={handleFormChange}
                        placeholder="e.g., 65.5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="height"
                        value={formData.height}
                        onChange={handleFormChange}
                        placeholder="e.g., 165.0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Facility Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Facility & Ward Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Nurse
                      </label>
                      <input
                        type="text"
                        name="primary_nurse"
                        value={formData.primary_nurse}
                        onChange={handleFormChange}
                        placeholder="Assigned primary nurse"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ward/Section
                      </label>
                      <select
                        name="ward_section"
                        value={formData.ward_section}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select ward/section</option>
                        <option value="maternity">Maternity Ward</option>
                        <option value="labor_delivery">Labor & Delivery</option>
                        <option value="postpartum">Postpartum</option>
                        <option value="nicu">NICU</option>
                        <option value="general">General Ward</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admission Source
                      </label>
                      <select
                        name="admission_source"
                        value={formData.admission_source}
                        onChange={handleFormChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select source</option>
                        <option value="home">Home</option>
                        <option value="clinic">Clinic</option>
                        <option value="emergency">Emergency Department</option>
                        <option value="transfer">Transfer from Another Facility</option>
                        <option value="physician_referral">Physician Referral</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact & Insurance */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact & Insurance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleFormChange}
                          placeholder="Full name of emergency contact"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleFormChange}
                          placeholder="e.g., Spouse, Parent, Sibling"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleFormChange}
                          placeholder="Contact phone number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Information
                      </label>
                      <textarea
                        name="insurance_information"
                        value={formData.insurance_information}
                        onChange={handleFormChange}
                        rows={6}
                        placeholder="Insurance provider, policy number, coverage details..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Care Requirements & Precautions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Care Requirements & Precautions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Dietary Requirements
                        </label>
                        <textarea
                          name="special_dietary_requirements"
                          value={formData.special_dietary_requirements}
                          onChange={handleFormChange}
                          rows={2}
                          placeholder="Dietary restrictions, preferences, or requirements"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fall Risk Assessment
                        </label>
                        <select
                          name="fall_risk_assessment"
                          value={formData.fall_risk_assessment}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low Risk</option>
                          <option value="moderate">Moderate Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Isolation Precautions
                        </label>
                        <input
                          type="text"
                          name="isolation_precautions"
                          value={formData.isolation_precautions}
                          onChange={handleFormChange}
                          placeholder="Any isolation requirements (if applicable)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Patient Belongings
                        </label>
                        <textarea
                          name="patient_belongings"
                          value={formData.patient_belongings}
                          onChange={handleFormChange}
                          rows={2}
                          placeholder="List of personal belongings brought by patient"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                      </div>

                      <div>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            name="mobility_assistance_needed"
                            checked={formData.mobility_assistance_needed}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              mobility_assistance_needed: e.target.checked
                            }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Mobility Assistance Needed</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            name="patient_orientation_completed"
                            checked={formData.patient_orientation_completed}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              patient_orientation_completed: e.target.checked
                            }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Patient Orientation Completed</span>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="family_notification_completed"
                            checked={formData.family_notification_completed}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              family_notification_completed: e.target.checked
                            }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Family Notification Completed</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Directives & Discharge Planning */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Directives & Discharge Planning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advance Directives
                      </label>
                      <textarea
                        name="advance_directives"
                        value={formData.advance_directives}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Living will, healthcare proxy, DNR orders, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discharge Planning Needs
                      </label>
                      <textarea
                        name="discharge_planning_needs"
                        value={formData.discharge_planning_needs}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Anticipated discharge needs, home care requirements, follow-up appointments"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Clinical Assessment */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Physical Examination
                      </label>
                      <textarea
                        name="physical_examination"
                        value={formData.physical_examination}
                        onChange={handleFormChange}
                        rows={4}
                        placeholder="Physical examination findings"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Diagnosis
                      </label>
                      <textarea
                        name="initial_diagnosis"
                        value={formData.initial_diagnosis}
                        onChange={handleFormChange}
                        rows={2}
                        placeholder="Working diagnosis"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>

                      <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                        Treatment Plan
                      </label>
                      <textarea
                        name="treatment_plan"
                        value={formData.treatment_plan}
                        onChange={handleFormChange}
                        rows={2}
                        placeholder="Planned treatment and care"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Administrative Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Administrative Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attending Physician
                      </label>
                      <input
                        type="text"
                        name="attending_physician"
                        value={formData.attending_physician}
                        onChange={handleFormChange}
                        placeholder="Dr. Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room Number
                      </label>
                      <input
                        type="text"
                        name="room_number"
                        value={formData.room_number}
                        onChange={handleFormChange}
                        placeholder="e.g., 101"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bed Number
                      </label>
                      <input
                        type="text"
                        name="bed_number"
                        value={formData.bed_number}
                        onChange={handleFormChange}
                        placeholder="e.g., A1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder="Any additional notes or observations"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        patient_id: "",
                        admission_date: new Date().toISOString().split('T')[0],
                        admission_time: new Date().toTimeString().slice(0, 5),
                        admission_type: "regular",
                        chief_complaint: "",
                        reason_for_admission: "",
                        medical_history: "",
                        allergies: "",
                        current_medications: "",
                        vital_signs_temperature: "",
                        vital_signs_blood_pressure: "",
                        vital_signs_heart_rate: "",
                        vital_signs_respiratory_rate: "",
                        vital_signs_oxygen_saturation: "",
                        weight: "",
                        height: "",
                        attending_physician: "",
                        primary_nurse: "",
                        room_number: "",
                        bed_number: "",
                        ward_section: "",
                        admission_source: "",
                        insurance_information: "",
                        emergency_contact_name: "",
                        emergency_contact_relationship: "",
                        emergency_contact_phone: "",
                        patient_belongings: "",
                        special_dietary_requirements: "",
                        mobility_assistance_needed: false,
                        fall_risk_assessment: "low",
                        isolation_precautions: "",
                        patient_orientation_completed: false,
                        family_notification_completed: false,
                        advance_directives: "",
                        discharge_planning_needs: "",
                        physical_examination: "",
                        initial_diagnosis: "",
                        treatment_plan: "",
                        status: "admitted",
                        notes: "",
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Admission...
                      </>
                    ) : (
                      'Create Patient Admission'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
