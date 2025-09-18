"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth.jsx";
import { Download, Eye, Trash2, Edit3 } from "lucide-react";
import Link from "next/link";

const ReferralsPage = () => {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch referrals
  const fetchReferrals = async () => {
    try {
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/referrals`
      );
      const referralsData = response.data.data || response.data;
      setReferrals(referralsData);
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && birthcare_Id) {
      fetchReferrals();
    }
  }, [user, birthcare_Id]);

  // Filter referrals based on search term  
  const filteredReferrals = referrals.filter(referral =>
    referral.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referring_facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.receiving_facility?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.reason_for_referral?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (referralId) => {
    try {
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/referrals/${referralId}/pdf`,
        { responseType: 'blob' }
      );
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `referral-${referralId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleViewPDF = async (referralId) => {
    try {
      const response = await axios.get(
        `/api/birthcare/${birthcare_Id}/referrals/${referralId}/pdf`,
        { responseType: 'blob' }
      );
      
      // Open PDF in new tab
      const url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error viewing PDF:', error);
      alert('Failed to view PDF. Please try again.');
    }
  };

  const handleDelete = async (referralId) => {
    if (!confirm('Are you sure you want to delete this referral?')) return;
    
    try {
      await axios.delete(
        `/api/birthcare/${birthcare_Id}/referrals/${referralId}`
      );
      alert('Referral deleted successfully');
      fetchReferrals(); // Refresh list
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete referral');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-4rem)]">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Loading referrals...</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Patient Referrals</h1>
                <p className="text-gray-600 mt-1">
                  Manage patient referrals and download referral documents
                </p>
              </div>
              <Link
                href={`/${birthcare_Id}/referrals/create`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Referral
              </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search referrals by patient name, facility, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Referrals List */}
            <div className="flex-1">
              {filteredReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No referrals found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? "Try adjusting your search criteria." : "Get started by creating a new referral."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          From
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReferrals.map((referral) => (
                        <tr key={referral.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {referral.patient ? `${referral.patient.first_name} ${referral.patient.middle_name || ''} ${referral.patient.last_name}`.trim() : 'Unknown Patient'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {referral.patient_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{referral.referring_facility}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{referral.receiving_facility}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {referral.reason_for_referral}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(referral.referral_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              referral.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              referral.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              referral.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {referral.status?.charAt(0).toUpperCase() + referral.status?.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewPDF(referral.id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="View Referral"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(referral.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Download PDF"
                              >
                                <Download size={16} />
                              </button>
                              <Link
                                href={`/${birthcare_Id}/referrals/${referral.id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900 p-1 inline-block"
                                title="Edit Referral"
                              >
                                <Edit3 size={16} />
                              </Link>
                              <button
                                onClick={() => handleDelete(referral.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Referral"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
