"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth.jsx";
import { savePrenatalFormAsPDF, downloadPrenatalFormPDF } from "@/utils/pdfGenerator";
// Removed unused useReactToPrint import

const PrenatalFormsPage = () => {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    patient_id: "",
    form_date: new Date().toISOString().split('T')[0],
    gestational_age: "",
    weight: "",
    blood_pressure: "",
    notes: "",
    next_appointment: "",
    examined_by: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const printRef = useRef();
  const [birthCareInfo, setBirthCareInfo] = useState(null);

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
      fetchBirthCareInfo();
      fetchPatients();
    }
  }, [user, birthcare_Id]);

  const fetchBirthCareInfo = async () => {
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}`);
      setBirthCareInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching birth care info:', error);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission with PDF generation
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // First save the prenatal form
      await axios.post(`/api/birthcare/${birthcare_Id}/prenatal-forms`, formData);
      
      // Get patient data for PDF generation
      const selectedPatient = patients.find(p => p.id == formData.patient_id);
      
      if (selectedPatient) {
        // Generate PDF and save to patient documents
        const pdfData = await savePrenatalFormAsPDF(formData, selectedPatient, birthcare_Id, birthCareInfo);
        
        await axios.post(`/api/birthcare/${birthcare_Id}/patient-documents/from-data`, {
          patient_id: formData.patient_id,
          title: pdfData.title,
          document_type: pdfData.document_type,
          content: pdfData.base64PDF,
          metadata: pdfData.metadata,
        });
      }
      
      alert('Prenatal form created and saved to patient documents successfully!');
      
      // Reset form
      setFormData({
        patient_id: "",
        form_date: new Date().toISOString().split('T')[0],
        gestational_age: "",
        weight: "",
        blood_pressure: "",
        notes: "",
        next_appointment: "",
        examined_by: "",
      });
      
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Error creating form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle preview PDF
  const handlePreviewPDF = () => {
    if (!formData.patient_id) {
      alert('Please select a patient first.');
      return;
    }
    
    const selectedPatient = patients.find(p => p.id == formData.patient_id);
    if (selectedPatient) {
      try {
        downloadPrenatalFormPDF(formData, selectedPatient, birthCareInfo);
      } catch (error) {
        alert('Failed to generate PDF preview.');
      }
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
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
        
        {/* Printable Content */}
        <div ref={printRef}>
          {/* Official Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 print:shadow-none print:border-black print:rounded-none">
            <div className="p-8 text-center border-b border-gray-200 print:p-4 print:border-black">
              <div className="flex items-center justify-center space-x-4 mb-4 print:hidden">
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
              <h1 className="text-sm font-bold text-gray-800 mb-2 print:text-black">REPUBLIC OF THE PHILIPPINES</h1>
              <h2 className="text-lg font-bold text-gray-900 mb-1 print:text-black">CITY GOVERNMENT OF DAVAO</h2>
              <h3 className="text-base font-semibold text-gray-800 mb-1 print:text-black">
                {birthCareInfo?.name?.toUpperCase() || 'BIRTH CARE FACILITY'}
              </h3>
              <p className="text-sm text-gray-600 mb-4 print:text-black">
                {birthCareInfo?.description || 'Registered Birth Care Facility'}
              </p>
              <div className="border-t border-b border-gray-300 py-3 print:border-black">
                <h2 className="text-xl font-bold text-gray-900 print:text-black">PRENATAL EXAMINATION FORM</h2>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="px-6 py-6 h-full flex flex-col">
              {/* Form Header */}
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Prenatal Forms</h1>
                  <p className="text-gray-600 mt-1">
                    Fill out a new prenatal examination form
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      patient_id: "",
                      form_date: "2024-01-15",
                      gestational_age: "28 weeks, 2 days",
                      weight: "68.5 kg",
                      blood_pressure: "118/76 mmHg",
                      notes: "Patient reports normal fetal movements. No unusual symptoms or concerns. Fundal height appropriate for gestational age. Heart rate strong and regular. Discussed nutrition and exercise recommendations. Patient advised to continue prenatal vitamins and stay hydrated.",
                      next_appointment: "2024-02-12",
                      examined_by: "Dr. Sarah Johnson, MD",
                    });
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Fill Sample Data
                </button>
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

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Examination Date *
                      </label>
                      <input
                        type="date"
                        name="form_date"
                        value={formData.form_date}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gestational Age
                      </label>
                      <input
                        type="text"
                        name="gestational_age"
                        value={formData.gestational_age}
                        onChange={handleFormChange}
                        placeholder="e.g., 20 weeks, 3 days"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs & Measurements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight
                        </label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleFormChange}
                          placeholder="e.g., 65.5 kg"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          name="blood_pressure"
                          value={formData.blood_pressure}
                          onChange={handleFormChange}
                          placeholder="e.g., 120/80 mmHg"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clinical Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Notes & Observations
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      rows={6}
                      placeholder="Enter detailed clinical observations, findings, and notes..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ></textarea>
                  </div>

                  {/* Follow-up Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Follow-up & Provider Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Next Appointment Date
                        </label>
                        <input
                          type="date"
                          name="next_appointment"
                          value={formData.next_appointment}
                          onChange={handleFormChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Examined By
                        </label>
                        <input
                          type="text"
                          name="examined_by"
                          value={formData.examined_by}
                          onChange={handleFormChange}
                          placeholder="Healthcare provider name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handlePreviewPDF}
                      disabled={!formData.patient_id}
                      className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Preview PDF
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
                          Saving Form...
                        </>
                      ) : (
                        'Save to Patient Documents'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrenatalFormsPage;
