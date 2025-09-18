"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth";
import { useReactToPrint } from 'react-to-print';
import { saveLaborMonitoringAsPDF, downloadLaborMonitoringPDF } from '@/utils/pdfGenerator';

export default function LaborMonitoring() {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [monitoringEntries, setMonitoringEntries] = useState([]);
  const [birthCareInfo, setBirthCareInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // Handle different date formats
      let date;
      if (dateString.includes('T')) {
        // ISO datetime string
        date = new Date(dateString);
      } else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // YYYY-MM-DD format
        date = new Date(dateString + 'T00:00:00');
      } else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.warn('Date formatting error:', error, dateString);
      return dateString; // Return original string if error
    }
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    try {
      // Handle both full datetime strings and time-only strings
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
      
      // If it's just a time string (HH:MM or HH:MM:SS), extract HH:MM
      const timeParts = timeString.split(':');
      return timeParts.slice(0, 2).join(':');
    } catch (error) {
      console.warn('Time formatting error:', error, timeString);
      return timeString; // Return original string if error
    }
  };
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    case_no: '',
    bed_no: '',
    admission_date: new Date().toISOString().split('T')[0],
    attending_physician: ''
  });
  const printRef = useRef();
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    temperature: '',
    pulse: '',
    respiration: '',
    blood_pressure: '',
    fht_location: ''
  });

  useEffect(() => {
    fetchBirthCareInfo();
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchMonitoringEntries();
    }
  }, [selectedPatient]);

  const fetchBirthCareInfo = async () => {
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}`);
      setBirthCareInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching birth care info:', error);
    }
  };

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

  const fetchMonitoringEntries = async () => {
    if (!selectedPatient) return;
    
    try {
      const response = await axios.get(`/api/birthcare/${birthcare_Id}/labor-monitoring`, {
        params: { patient_id: selectedPatient.id }
      });
      setMonitoringEntries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching monitoring entries:', error);
    }
  };

  // Fill sample data for testing
  const fillSampleData = () => {
    const currentTime = new Date();
    const timeString = currentTime.toTimeString().slice(0, 5);
    
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      time: timeString,
      temperature: '36.7',
      pulse: '82',
      respiration: '18',
      blood_pressure: '120/80',
      fht_location: 'Left lower quadrant'
    });
    
    // Also fill additional info if empty
    if (!additionalInfo.case_no) {
      setAdditionalInfo({
        ...additionalInfo,
        case_no: 'LC-2025-001',
        bed_no: 'B-12',
        attending_physician: 'Dr. Sarah Johnson, MD'
      });
    }
  };

  const addMonitoringEntry = async () => {
    if (!newEntry.date || !newEntry.time || !selectedPatient) {
      alert('Please fill in date, time, and ensure a patient is selected.');
      return;
    }

    try {
      const entryData = {
        patient_id: selectedPatient.id,
        monitoring_date: newEntry.date,
        monitoring_time: newEntry.time,
        temperature: newEntry.temperature,
        pulse: newEntry.pulse,
        respiration: newEntry.respiration,
        blood_pressure: newEntry.blood_pressure,
        fht_location: newEntry.fht_location
      };

      const response = await axios.post(`/api/birthcare/${birthcare_Id}/labor-monitoring`, entryData);
      
      // Add to local state
      setMonitoringEntries([...monitoringEntries, response.data.data]);
      
      // Reset form
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        temperature: '',
        pulse: '',
        respiration: '',
        blood_pressure: '',
        fht_location: ''
      });

      // Entry saved successfully - no alert needed as the table will update
    } catch (error) {
      console.error('Error saving monitoring entry:', error);
      alert('Error saving monitoring entry. Please try again.');
    }
  };

  const deleteMonitoringEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this monitoring entry?')) {
      return;
    }

    try {
      await axios.delete(`/api/birthcare/${birthcare_Id}/labor-monitoring/${entryId}`);
      setMonitoringEntries(monitoringEntries.filter(e => e.id !== entryId));
      // Entry deleted successfully - table will update automatically
    } catch (error) {
      console.error('Error deleting monitoring entry:', error);
      alert('Error deleting monitoring entry. Please try again.');
    }
  };

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Labor_Monitoring_${selectedPatient?.first_name}_${selectedPatient?.last_name}_${new Date().toISOString().split('T')[0]}`,
  });

  // PDF generation and save functionality
  const generatePDF = async () => {
    if (!selectedPatient) {
      alert('Please select a patient first.');
      return;
    }

    try {
      // Generate PDF and save to patient documents
      const pdfData = await saveLaborMonitoringAsPDF(
        selectedPatient,
        monitoringEntries,
        additionalInfo,
        birthcare_Id,
        birthCareInfo
      );
      
      await axios.post(`/api/birthcare/${birthcare_Id}/patient-documents/from-data`, {
        patient_id: selectedPatient.id,
        title: pdfData.title,
        document_type: pdfData.document_type,
        content: pdfData.base64PDF,
        metadata: pdfData.metadata,
      });
      
      alert('Labor monitoring PDF generated and saved to patient documents successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };
  
  // Preview PDF function
  const handlePreviewPDF = () => {
    if (!selectedPatient) {
      alert('Please select a patient first.');
      return;
    }
    
    try {
      downloadLaborMonitoringPDF(selectedPatient, monitoringEntries, additionalInfo, birthCareInfo);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      alert('Failed to generate PDF preview.');
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
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
        {/* Removed print/PDF buttons to follow prenatal forms format */}
        
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
              <h2 className="text-xl font-bold text-gray-900 print:text-black">LABOR MONITORING SHEET</h2>
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="p-6 print:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="w-20 text-sm font-medium text-gray-700 print:text-black">Name:</label>
                  <div className="flex-1">
                    {selectedPatient ? (
                      <div className="p-2 bg-gray-50 border rounded print:bg-white print:border-black">
                        {selectedPatient.first_name} {selectedPatient.last_name}
                      </div>
                    ) : (
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-black print:rounded-none"
                        onChange={(e) => {
                          const patient = patients.find(p => p.id === parseInt(e.target.value));
                          setSelectedPatient(patient);
                        }}
                        value={selectedPatient?.id || ''}
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.first_name} {patient.last_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-20 text-sm font-medium text-gray-700 print:text-black">Date of Admission:</label>
                  <div className="flex-1">
                    <input
                      type="date"
                      value={additionalInfo.admission_date}
                      onChange={(e) => setAdditionalInfo({...additionalInfo, admission_date: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-black print:rounded-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="w-20 text-sm font-medium text-gray-700 print:text-black">Case No.:</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={additionalInfo.case_no}
                      onChange={(e) => setAdditionalInfo({...additionalInfo, case_no: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-black print:rounded-none"
                      placeholder="Enter case number"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-20 text-sm font-medium text-gray-700 print:text-black">Bed No.:</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={additionalInfo.bed_no}
                      onChange={(e) => setAdditionalInfo({...additionalInfo, bed_no: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-black print:rounded-none"
                      placeholder="Enter bed number"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Attending Physician Field - Full width below the grid */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <label className="w-32 text-sm font-medium text-gray-700 print:text-black">Attending Physician:</label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={additionalInfo.attending_physician}
                    onChange={(e) => setAdditionalInfo({...additionalInfo, attending_physician: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-black print:rounded-none"
                    placeholder="Enter attending physician name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Data Entry */}
        {selectedPatient && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 print:hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Monitoring Entry</h3>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={fillSampleData}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm font-medium transition-colors"
                  >
                    Fill Sample Data
                  </button>
                  <button
                    onClick={addMonitoringEntry}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Add Entry
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">DATE</label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">TIME</label>
                  <input
                    type="time"
                    value={newEntry.time}
                    onChange={(e) => setNewEntry({...newEntry, time: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">TEMP</label>
                  <input
                    type="text"
                    placeholder="°C"
                    value={newEntry.temperature}
                    onChange={(e) => setNewEntry({...newEntry, temperature: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PULSE</label>
                  <input
                    type="text"
                    placeholder="bpm"
                    value={newEntry.pulse}
                    onChange={(e) => setNewEntry({...newEntry, pulse: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">RESP</label>
                  <input
                    type="text"
                    placeholder="/min"
                    value={newEntry.respiration}
                    onChange={(e) => setNewEntry({...newEntry, respiration: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">BP</label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={newEntry.blood_pressure}
                    onChange={(e) => setNewEntry({...newEntry, blood_pressure: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">FHT/LOCATION</label>
                  <input
                    type="text"
                    placeholder="Location"
                    value={newEntry.fht_location}
                    onChange={(e) => setNewEntry({...newEntry, fht_location: e.target.value})}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-black print:rounded-none">
          <div className="p-6 print:p-4">
            <div className="flex justify-between items-center mb-4 print:mb-2">
              <h3 className="text-lg font-semibold text-gray-900 print:text-black">Labor Monitoring Records</h3>
              {!selectedPatient && (
                <p className="text-sm text-gray-500 print:hidden">Please select a patient to start monitoring</p>
              )}
            </div>
            
            {selectedPatient ? (
              <div className="overflow-x-auto print:overflow-visible">
                <table className="min-w-full border-collapse border border-gray-300 print:border-black">
                  <thead>
                    <tr className="bg-gray-50 print:bg-white">
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        DATE
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        TIME
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        TEMP
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        PULSE
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        RESP
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        BP
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:border-black print:text-black">
                        FHT/LOCATION
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider print:hidden">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 print:divide-black">
                    {monitoringEntries.length === 0 ? (
                      Array.from({ length: 15 }, (_, index) => (
                        <tr key={index} className="hover:bg-gray-50 print:hover:bg-white">
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                          <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:hidden">&nbsp;</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        {monitoringEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50 print:hover:bg-white">
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {formatDate(entry.monitoring_date || entry.date)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {formatTime(entry.monitoring_time || entry.time)}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {entry.temperature}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {entry.pulse}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {entry.respiration}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {entry.blood_pressure}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center text-gray-900 print:border-black print:text-black">
                              {entry.fht_location}
                            </td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-center print:hidden">
                              <button
                                onClick={() => deleteMonitoringEntry(entry.id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {Array.from({ length: Math.max(0, 15 - monitoringEntries.length) }, (_, index) => (
                          <tr key={`empty-${index}`} className="hover:bg-gray-50 print:hover:bg-white">
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:border-black print:text-black">&nbsp;</td>
                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900 print:hidden">&nbsp;</td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select a patient from the dropdown above to start labor monitoring.</p>
              </div>
            )}
            
            {/* Signature Section */}
            {selectedPatient && (
              <div className="mt-8 pt-6 border-t border-gray-200 print:border-black">
                <div className="text-right">
                  <div className="inline-block">
                    <div className="border-b border-gray-400 w-64 mb-2 print:border-black"></div>
                    <p className="text-xs font-medium text-gray-700 text-center print:text-black">
                      {additionalInfo.attending_physician ? additionalInfo.attending_physician.toUpperCase() : '_____________________________'}
                    </p>
                    <p className="text-xs text-gray-600 text-center print:text-black">Attending Physician</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons - Following prenatal forms format */}
            {selectedPatient && (
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 print:hidden">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={handlePreviewPDF}
                  disabled={!selectedPatient}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Preview PDF
                </button>
                <button
                  type="button"
                  onClick={generatePDF}
                  disabled={!selectedPatient}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Save to Patient Documents
                </button>
              </div>
            )}
          </div>
        </div>
        </div> {/* Close printable content div */}
      </div>
    </div>
  );
}
