"use client";
import { useAuth } from "@/hooks/auth";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, Users, AlertCircle, CheckCircle2, User, Hash, Clock as ClockIcon } from "lucide-react";
import axios from '@/lib/axios';

const PrenatalChartPage = () => {
  const { user } = useAuth({ middleware: "auth" });
  const { birthcare_Id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [todaysVisits, setTodaysVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredVisit, setHoveredVisit] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // WHO 8 Visit Schedule Reference
  const whoSchedule = [
    { number: 1, name: "First visit", week: "before 12 weeks", description: "Initial assessment, confirm pregnancy" },
    { number: 2, name: "Second visit", week: "20 weeks", description: "Anatomy scan, genetic screening" },
    { number: 3, name: "Third visit", week: "26 weeks", description: "Glucose screening, blood pressure check" },
    { number: 4, name: "Fourth visit", week: "30 weeks", description: "Growth monitoring, position check" },
    { number: 5, name: "Fifth visit", week: "34 weeks", description: "Preterm prevention, birth planning" },
    { number: 6, name: "Sixth visit", week: "36 weeks", description: "Final preparations, positioning" },
    { number: 7, name: "Seventh visit", week: "38 weeks", description: "Labor readiness, final checks" },
    { number: 8, name: "Eighth visit", week: "40 weeks", description: "Due date assessment, delivery planning" }
  ];

  // Fetch calendar data and today's visits
  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [calendarResponse, todaysResponse] = await Promise.all([
        axios.get(`/api/birthcare/${birthcare_Id}/prenatal-calendar`, {
          params: {
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString().split('T')[0],
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString().split('T')[0]
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }),
        axios.get(`/api/birthcare/${birthcare_Id}/todays-visits`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
      ]);
      
      setCalendarData(calendarResponse.data || []);
      setTodaysVisits(todaysResponse.data || []);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError('Failed to load calendar data. Please try again.');
      setCalendarData([]);
      setTodaysVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && birthcare_Id) {
      fetchData();
    }
  }, [user, birthcare_Id, selectedDate]);

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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getVisitsForDate = (day) => {
    const dateStr = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
      .toISOString().split('T')[0];
    
    const visits = calendarData.filter(visit => {
      // Handle both formats: "2025-08-05" and "2025-08-05T00:00:00.000000Z"
      const visitDate = visit.scheduled_date?.split('T')[0];
      return visitDate === dateStr;
    });
    
    return visits;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    const checkDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return checkDate.toDateString() === today.toDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMouseEnter = (visit, event) => {
    setHoveredVisit(visit);
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredVisit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Modern Tooltip */}
      {hoveredVisit && (
        <div 
          className="fixed z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700 min-w-[280px] animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="font-semibold text-sm">
                {hoveredVisit.patient.first_name} {hoveredVisit.patient.last_name}
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Hash className="h-3 w-3 text-green-400" />
              <span className="text-xs text-gray-300">
                Visit {hoveredVisit.visit_number}: {hoveredVisit.visit_name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-3 w-3 text-orange-400" />
              <span className="text-xs text-gray-300">
                Recommended at week {hoveredVisit.recommended_week}
              </span>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Pre-Natal Chart</h1>
              <p className="text-gray-600 mt-1">WHO 8-Visit Prenatal Schedule Calendar</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Today: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Calendar */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Calendar Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {formatDate(selectedDate)}
                  </h2>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Loading calendar...</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="ml-2 text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: getFirstDayOfMonth(selectedDate) }, (_, i) => (
                    <div key={`empty-${i}`} className="h-24 border border-gray-100"></div>
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: getDaysInMonth(selectedDate) }, (_, i) => {
                    const day = i + 1;
                    const visits = getVisitsForDate(day);
                    const isCurrentDay = isToday(day);
                    
                    return (
                      <div
                        key={day}
                        className={`h-24 border border-gray-100 p-1 ${
                          isCurrentDay ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`text-sm ${isCurrentDay ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
                          {day}
                        </div>
                        
                        {/* Visit indicators */}
                        <div className="mt-1 space-y-1">
                          {visits.slice(0, 2).map((visit, idx) => (
                            <div
                              key={idx}
                              className="text-xs px-1 py-0.5 rounded truncate cursor-pointer transition-all duration-200 hover:shadow-sm hover:scale-105"
                              style={{ backgroundColor: visit.status === 'Completed' ? '#dcfce7' : visit.status === 'Scheduled' ? '#dbeafe' : '#fef2f2' }}
                              onMouseEnter={(e) => handleMouseEnter(visit, e)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {visit.patient.first_name} {visit.patient.last_name}
                            </div>
                          ))}
                          {visits.length > 2 && (
                            <div className="text-xs text-gray-500">+{visits.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Visits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Today's Visits</h3>
                </div>
              </div>
              <div className="p-6">
                {todaysVisits.length > 0 ? (
                  <div className="space-y-3">
                    {todaysVisits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {visit.patient.first_name} {visit.patient.last_name}
                          </div>
                          <div className="text-sm text-gray-600">{visit.visit_name}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No visits scheduled for today</p>
                )}
              </div>
            </div>

            {/* WHO Schedule Reference */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">WHO 8-Visit Schedule</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {whoSchedule.map((visit) => (
                    <div key={visit.number} className="border-l-4 border-green-200 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm text-gray-900">
                          Visit {visit.number}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {visit.week}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {visit.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Legend</h3>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Scheduled</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Missed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrenatalChartPage;
