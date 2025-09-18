"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function PaymentsReportsPage() {
  const { birthcare_Id } = useParams();
  
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/birthcare/${birthcare_Id}/payments/dashboard`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');

      const data = await response.json();
      setDashboardData(data.data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (birthcare_Id) {
      fetchDashboardData();
    }
  }, [birthcare_Id]);

  const generateMonthlyChart = () => {
    const monthlyRevenue = dashboardData.monthly_revenue || {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => ({
      month,
      revenue: parseFloat(monthlyRevenue[index + 1] || 0)
    }));
  };

  const getStatusSummary = () => {
    const billsByStatus = dashboardData.summary?.bills_by_status || {};
    return [
      { status: 'Draft', count: billsByStatus.draft || 0, color: 'bg-gray-100 text-gray-800' },
      { status: 'Sent', count: billsByStatus.sent || 0, color: 'bg-blue-100 text-blue-800' },
      { status: 'Partially Paid', count: billsByStatus.partially_paid || 0, color: 'bg-yellow-100 text-yellow-800' },
      { status: 'Paid', count: billsByStatus.paid || 0, color: 'bg-green-100 text-green-800' },
      { status: 'Overdue', count: billsByStatus.overdue || 0, color: 'bg-red-100 text-red-800' },
      { status: 'Cancelled', count: billsByStatus.cancelled || 0, color: 'bg-gray-100 text-gray-800' },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading payment reports...</div>
      </div>
    );
  }

  const summary = dashboardData.summary || {};
  const recentBills = dashboardData.recent_bills || [];
  const monthlyData = generateMonthlyChart();
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Comprehensive payment analytics and financial insights</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Payments</h3>
              <p className="text-3xl font-bold text-gray-900">{summary.total_bills || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">₱{parseFloat(summary.total_revenue || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Outstanding</h3>
              <p className="text-3xl font-bold text-yellow-600">₱{parseFloat(summary.total_outstanding || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Overdue Amount</h3>
              <p className="text-3xl font-bold text-red-600">₱{parseFloat(summary.overdue_amount || 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-20 text-right">
                  ₱{data.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payments by Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments by Status</h3>
          <div className="space-y-3">
            {getStatusSummary().map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.color} mr-3`}>
                    {item.status}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Rate and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Collection Rate */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Collected</span>
                <span>{summary.total_revenue ? ((summary.total_paid / summary.total_revenue) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full" 
                  style={{ 
                    width: summary.total_revenue ? 
                      `${(summary.total_paid / summary.total_revenue) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">₱{parseFloat(summary.total_paid || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Collected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">₱{parseFloat(summary.total_outstanding || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Outstanding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Payment Amount</span>
              <span className="font-semibold">
                ₱{summary.total_bills ? (summary.total_revenue / summary.total_bills).toLocaleString() : '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue Payments</span>
              <span className="font-semibold text-red-600">{dashboardData.overdue_count || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-semibold text-green-600">
                {summary.total_revenue ? ((summary.total_paid / summary.total_revenue) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payments This Month</span>
              <span className="font-semibold">{monthlyData[new Date().getMonth()]?.revenue ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No recent payments found.
                  </td>
                </tr>
              ) : (
                recentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.bill_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bill.patient?.first_name} {bill.patient?.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bill.bill_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₱{parseFloat(bill.total_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                        bill.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        bill.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {bill.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>
    </div>
  );
}