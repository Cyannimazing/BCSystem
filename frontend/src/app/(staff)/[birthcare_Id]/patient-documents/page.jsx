"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth.jsx";
import { Download, Eye, Trash2, FileText, Search } from "lucide-react";

const PatientDocumentsPage = () => {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [documents, setDocuments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Fetch patients for filter dropdown
  const fetchPatients = async () => {
    try {
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/patients`
      );
      const patientsData = response.data.data || response.data;
      setPatients(patientsData);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/patient-documents`,
        {
          params: {
            search: searchTerm,
            patient_id: selectedPatient,
            document_type: selectedType,
          }
        }
      );
      setDocuments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && birthcare_Id) {
      fetchPatients();
      fetchDocuments();
    }
  }, [user, birthcare_Id]);

  useEffect(() => {
    if (user && birthcare_Id) {
      fetchDocuments();
    }
  }, [searchTerm, selectedPatient, selectedType]);

  const handleDownload = async (documentId, filename) => {
    try {
      console.log('Downloading document:', documentId, filename);
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/patient-documents/${documentId}/download`,
        { responseType: 'blob' }
      );
      
      if (response.data.size === 0) {
        throw new Error('Document appears to be empty');
      }
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('Download completed successfully');
    } catch (error) {
      console.error('Download failed:', error);
      if (error.response?.status === 404) {
        alert('Document file not found. It may have been moved or deleted.');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to download this document.');
      } else {
        alert(`Failed to download document: ${error.message}`);
      }
    }
  };

  const handleView = async (documentId) => {
    try {
      console.log('Viewing document:', documentId);
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/patient-documents/${documentId}/view`,
        { responseType: 'blob' }
      );
      
      if (response.data.size === 0) {
        throw new Error('Document appears to be empty');
      }
      
      // Open PDF in new tab
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        alert('Please allow popups to view the document');
      }
      
      // Clean up the URL after a delay to allow the browser to load it
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      console.log('Document opened successfully');
    } catch (error) {
      console.error('View failed:', error);
      if (error.response?.status === 404) {
        alert('Document file not found. It may have been moved or deleted.');
      } else if (error.response?.status === 403) {
        alert('You do not have permission to view this document.');
      } else {
        alert(`Failed to view document: ${error.message}`);
      }
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) return;
    
    try {
      console.log('Deleting document:', documentId);
      await axios.delete(
        `/api/birthcare/${birthcare_Id}/patient-documents/${documentId}`
      );
      alert('Document deleted successfully');
      fetchDocuments(); // Refresh list
      console.log('Document deleted and list refreshed');
    } catch (error) {
      console.error('Delete failed:', error);
      if (error.response?.status === 404) {
        alert('Document not found. It may have already been deleted.');
        fetchDocuments(); // Refresh list anyway
      } else if (error.response?.status === 403) {
        alert('You do not have permission to delete this document.');
      } else {
        alert(`Failed to delete document: ${error.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'prenatal_form':
        return <FileText className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading documents...</span>
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
              <h1 className="text-2xl font-semibold text-gray-900">Patient Documents</h1>
              <p className="text-gray-600 mt-1">
                View and manage patient documents and reports
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Patient Filter */}
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Patients</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {`${patient.first_name} ${patient.middle_name || ""} ${patient.last_name}`.trim()}
                  </option>
                ))}
              </select>

              {/* Document Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="prenatal_form">Prenatal Forms</option>
                <option value="medical_report">Medical Reports</option>
                <option value="test_result">Test Results</option>
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPatient("");
                  setSelectedType("");
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>

            {/* Documents Table */}
            <div className="flex-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.length > 0 ? (
                      documents.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                {getDocumentIcon(document.document_type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {document.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {document.file_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {document.patient?.first_name} {document.patient?.middle_name || ""} {document.patient?.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {document.document_type?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(document.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleView(document.id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Document"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDownload(document.id, document.file_name)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Download Document"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(document.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Document"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            {searchTerm || selectedPatient || selectedType ? (
                              <>
                                <p className="text-lg font-medium mb-2">No documents found</p>
                                <p>Try adjusting your search terms or clear the filters to see all documents.</p>
                              </>
                            ) : (
                              <>
                                <p className="text-lg font-medium mb-2">No documents yet</p>
                                <p>Documents will appear here when they are generated from forms and reports.</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDocumentsPage;
