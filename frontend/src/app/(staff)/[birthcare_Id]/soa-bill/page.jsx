"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function SOABillPage() {
  const { birthcare_Id } = useParams();
  
  // State management
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientBills, setPatientBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatingBill, setGeneratingBill] = useState(false);
  
  // SOA Configuration
  const [soaConfig, setSoaConfig] = useState({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    includeUnpaid: true,
    includePaid: false,
    includePartiallyPaid: true
  });
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Fetch patients from database
  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching patients from database...');
      console.log('Birthcare ID:', birthcare_Id);
      console.log('API URL:', `${API_BASE_URL}/birthcare/${birthcare_Id}/patients`);
      
      const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/patients`, {
        headers: getAuthHeaders(),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `Failed to fetch patients (${response.status})`);
      }

      const data = await response.json();
      console.log('Full API Response:', data);
      
      // Handle both paginated and direct data formats
      const patientData = data.data || data || [];
      
      console.log(`Successfully fetched ${patientData.length} patients from database:`, patientData);
      
      // Map patient data to ensure consistent field names
      const mappedPatients = patientData.map(patient => ({
        ...patient,
        phone: patient.contact_number || patient.phone,
        email: patient.email || null,
        address: patient.address || null
      }));
      
      setPatients(mappedPatients);
      
      if (mappedPatients.length === 0) {
        setError('No patients found in the database. Please add patients first by going to Patient List → Patient Registration.');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(`Unable to load patients from database: ${err.message}. Please check if patients have been added to the system.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient bills
  const fetchPatientBills = async (patientId) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        patient_id: patientId,
        date_from: soaConfig.dateFrom,
        date_to: soaConfig.dateTo,
      });

      const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/payments?${queryParams}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch patient bills');

      const data = await response.json();
      let bills = data.data.data || [];
      
      // Filter bills based on status configuration
      bills = bills.filter(bill => {
        if (soaConfig.includeUnpaid && ['sent', 'overdue'].includes(bill.status)) return true;
        if (soaConfig.includePaid && bill.status === 'paid') return true;
        if (soaConfig.includePartiallyPaid && bill.status === 'partial') return true;
        return false;
      });
      
      setPatientBills(bills);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search with enhanced search criteria
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPatients(patients);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = patients.filter(patient => {
        const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        const phone = patient.phone || '';
        const email = patient.email || '';
        const address = patient.address || '';
        
        return (
          fullName.includes(searchLower) ||
          phone.includes(searchTerm) ||
          email.toLowerCase().includes(searchLower) ||
          address.toLowerCase().includes(searchLower) ||
          patient.first_name.toLowerCase().includes(searchLower) ||
          patient.last_name.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPatients(filtered);
    }
  }, [patients, searchTerm]);

  useEffect(() => {
    if (birthcare_Id) {
      fetchPatients();
    }
  }, [birthcare_Id]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientBills(selectedPatient.id);
    }
  }, [selectedPatient, soaConfig]);

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientBills([]);
  };

  // Add sample patients for testing
  const addSamplePatients = async () => {
    const samplePatients = [
      {
        facility_name: "Sample Birth Care Center",
        first_name: "Maria",
        middle_name: "Santos",
        last_name: "Cruz",
        date_of_birth: "1995-03-15",
        age: 28,
        civil_status: "Married",
        address: "123 Barangay Street, Manila, Philippines",
        contact_number: "09123456789",
        philhealth_number: "123456789012",
        status: "Active"
      },
      {
        facility_name: "Sample Birth Care Center", 
        first_name: "Ana",
        middle_name: "Garcia",
        last_name: "Reyes",
        date_of_birth: "1992-08-22",
        age: 31,
        civil_status: "Single",
        address: "456 Poblacion Ave, Quezon City, Philippines",
        contact_number: "09987654321",
        philhealth_number: "987654321098",
        status: "Active"
      },
      {
        facility_name: "Sample Birth Care Center",
        first_name: "Carmen",
        middle_name: "Flores",
        last_name: "Lopez",
        date_of_birth: "1990-12-10",
        age: 33,
        civil_status: "Married",
        address: "789 Main Street, Makati, Philippines",
        contact_number: "09111222333",
        philhealth_number: "111222333444",
        status: "Active"
      }
    ];

    setLoading(true);
    try {
      for (const patient of samplePatients) {
        const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/patients`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(patient)
        });
        
        if (!response.ok) {
          console.error('Failed to create patient:', await response.text());
        }
      }
      
      setSuccess('Sample patients added successfully!');
      await fetchPatients(); // Refresh the patient list
    } catch (err) {
      console.error('Error adding sample patients:', err);
      setError('Failed to add sample patients: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate SOA/Bill
  const handleGenerateBill = async () => {
    if (!selectedPatient || patientBills.length === 0) {
      setError('Please select a patient with outstanding bills');
      return;
    }

    setGeneratingBill(true);
    try {
      // Here you would typically call an API endpoint to generate the SOA/Bill
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setSuccess(`SOA/Bill generated successfully for ${selectedPatient.first_name} ${selectedPatient.last_name}`);
      
      // You could also trigger a PDF download here
      // window.open(`${API_BASE_URL}/birthcare/${birthcare_Id}/soa/${selectedPatient.id}/pdf`);
      
    } catch (err) {
      setError('Failed to generate SOA/Bill');
    } finally {
      setGeneratingBill(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const total = patientBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount || 0), 0);
    const paid = patientBills.reduce((sum, bill) => sum + parseFloat(bill.paid_amount || 0), 0);
    const balance = patientBills.reduce((sum, bill) => sum + parseFloat(bill.balance_amount || 0), 0);
    
    return { total, paid, balance };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statement of Account (SOA) / Bill Generator</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive billing statements for patients from database</p>
        {patients.length > 0 && (
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            📊 {patients.length} patient{patients.length !== 1 ? 's' : ''} loaded from database
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Patient Selection & Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Search & Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Patient</h2>
              <button
                onClick={fetchPatients}
                disabled={loading}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            {/* Search */}
            <div className="mb-4">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Patients
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Patient List */}
            <div className="max-h-80 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Fetching patients from database...</p>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-900 mt-2">No patients found in database</p>
                  <p className="text-xs text-gray-500 mb-4">Add patients to the database to generate SOA</p>
                  
                  {patients.length === 0 && (
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={addSamplePatients}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            📄 Add Sample Patients
                          </>
                        )}
                      </button>
                      <p className="text-xs text-gray-400">Or go to Patient List → Patient Registration</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="mb-2 px-2">
                    <p className="text-xs text-gray-500">{filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found in database</p>
                  </div>
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPatient?.id === patient.id
                          ? 'bg-blue-50 border-blue-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {patient.first_name.charAt(0)}{patient.last_name.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="font-medium text-sm text-gray-900">
                                {patient.first_name} {patient.last_name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                ID: {patient.id} • {patient.phone || 'No phone'}
                              </div>
                              {patient.email && (
                                <div className="text-xs text-gray-400">
                                  {patient.email}
                                </div>
                              )}
                              {patient.address && (
                                <div className="text-xs text-gray-400 truncate mt-1">
                                  📍 {patient.address}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedPatient?.id === patient.id && (
                          <div className="flex-shrink-0 ml-2">
                            <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* SOA Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SOA Configuration</h2>
            
            {/* Date Range */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={soaConfig.dateFrom}
                  onChange={(e) => setSoaConfig({...soaConfig, dateFrom: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={soaConfig.dateTo}
                  onChange={(e) => setSoaConfig({...soaConfig, dateTo: e.target.value})}
                />
              </div>
            </div>

            {/* Include Options */}
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium text-gray-700">Include Bills:</p>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={soaConfig.includeUnpaid}
                  onChange={(e) => setSoaConfig({...soaConfig, includeUnpaid: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-700">Unpaid Bills</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={soaConfig.includePartiallyPaid}
                  onChange={(e) => setSoaConfig({...soaConfig, includePartiallyPaid: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-700">Partially Paid Bills</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={soaConfig.includePaid}
                  onChange={(e) => setSoaConfig({...soaConfig, includePaid: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-700">Paid Bills</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Panel - SOA Preview & Generation */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* SOA Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Statement of Account</h2>
                  {selectedPatient ? (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-blue-600">
                              {selectedPatient.first_name.charAt(0)}{selectedPatient.last_name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {selectedPatient.first_name} {selectedPatient.last_name}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              ID: {selectedPatient.id}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{selectedPatient.phone || 'No phone number'}</span>
                            </div>
                            {selectedPatient.email && (
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate">{selectedPatient.email}</span>
                              </div>
                            )}
                            {selectedPatient.address && (
                              <div className="flex items-start sm:col-span-2">
                                <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs">{selectedPatient.address}</span>
                              </div>
                            )}
                            <div className="flex items-center sm:col-span-2">
                              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v6h6v-6M8 11V8a2 2 0 012-2h4a2 2 0 012 2v3" />
                              </svg>
                              <span>Statement Period: <strong>{formatDate(soaConfig.dateFrom)}</strong> to <strong>{formatDate(soaConfig.dateTo)}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <p className="text-sm text-yellow-800">Please select a patient from the database to generate SOA</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Generate Bill Button */}
                <button
                  onClick={handleGenerateBill}
                  disabled={!selectedPatient || patientBills.length === 0 || generatingBill}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedPatient && patientBills.length > 0 && !generatingBill
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {generatingBill ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Bill'
                  )}
                </button>
              </div>
            </div>

            {/* SOA Content */}
            <div className="p-6">
              {!selectedPatient ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No patient selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select a patient from the list to generate SOA</p>
                </div>
              ) : patientBills.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bills found</h3>
                  <p className="mt-1 text-sm text-gray-500">No bills found for the selected criteria</p>
                </div>
              ) : (
                <div>
                  {/* Bills Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bill #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Paid
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Balance
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patientBills.map((bill) => (
                          <tr key={bill.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {bill.bill_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(bill.bill_date)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {bill.notes || 'Medical Services'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(bill.total_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {formatCurrency(bill.paid_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              {formatCurrency(bill.balance_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                                bill.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {bill.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(totals.total)}</div>
                        <div className="text-sm text-gray-500">Total Billed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totals.paid)}</div>
                        <div className="text-sm text-gray-500">Total Paid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totals.balance)}</div>
                        <div className="text-sm text-gray-500">Outstanding Balance</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}