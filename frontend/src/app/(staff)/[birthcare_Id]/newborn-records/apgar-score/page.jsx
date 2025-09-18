"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/auth";

export default function ApgarScoreSheet() {
  const { birthcare_Id } = useParams();
  const { user } = useAuth({ middleware: "auth" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Patient Information (renamed from babyInfo for consistency)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    case_no: '',
    age: '',
    sex: '',
    bed_no: '',
    address: '',
    religion: '',
    birthday: ''
  });

  // APGAR Scores - 1 minute and 5 minutes
  const [apgarScores, setApgarScores] = useState({
    one_minute: {
      activity: 0, // A - Activity (Muscle Tone)
      pulse: 0,    // P - Pulse
      grimace: 0,  // G - Grimace (Reflex Irritability)
      appearance: 0, // A - Appearance (Skin Color)
      respiration: 0 // R - Respiration
    },
    five_minutes: {
      activity: 0,
      pulse: 0,
      grimace: 0,
      appearance: 0,
      respiration: 0
    }
  });

  const scoringCriteria = {
    activity: {
      0: { label: 'Absent', description: 'No movement, muscle tone absent' },
      1: { label: 'Arms and Legs Flexed', description: 'Some flexion of extremities' },
      2: { label: 'Active Movements', description: 'Active motion, good muscle tone' }
    },
    pulse: {
      0: { label: 'Absent', description: 'No heart rate' },
      1: { label: 'Below 100bpm', description: 'Heart rate less than 100 beats per minute' },
      2: { label: 'Above 100bpm', description: 'Heart rate over 100 beats per minute' }
    },
    grimace: {
      0: { label: 'No Response', description: 'No response to stimulation' },
      1: { label: 'Grimace', description: 'Grimace or weak cry with stimulation' },
      2: { label: 'Sneeze, Cough, Pulls Away', description: 'Good response, sneeze, cough, pulls away' }
    },
    appearance: {
      0: { label: 'Blue-Gray Pale All Over', description: 'Completely blue or pale' },
      1: { label: 'Normal Except for Extremities', description: 'Body pink, extremities blue' },
      2: { label: 'Normal Over Entire Body', description: 'Completely pink or normal color' }
    },
    respiration: {
      0: { label: 'Absent', description: 'No breathing effort' },
      1: { label: 'Slow, Irregular', description: 'Weak cry, irregular breathing' },
      2: { label: 'Good, Crying', description: 'Strong cry, regular breathing' }
    }
  };

  const handleScoreChange = (timeframe, category, score) => {
    setApgarScores(prev => ({
      ...prev,
      [timeframe]: {
        ...prev[timeframe],
        [category]: parseInt(score)
      }
    }));
  };

  const calculateTotal = (timeframe) => {
    const scores = apgarScores[timeframe];
    return scores.activity + scores.pulse + scores.grimace + scores.appearance + scores.respiration;
  };

  const getScoreInterpretation = (total) => {
    if (total >= 7) return { text: 'Normal', color: 'text-green-600' };
    if (total >= 4) return { text: 'Might require some resuscitative measures', color: 'text-yellow-600' };
    return { text: 'Immediate Resuscitation', color: 'text-red-600' };
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!patientInfo.name.trim()) {
      newErrors.baby_name = 'Baby\'s name is required';
    }
    
    if (!patientInfo.case_no.trim()) {
      newErrors.case_no = 'Case number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});
    
    try {
      const dataToSave = {
        baby_name: patientInfo.name,
        case_no: patientInfo.case_no,
        apgar_scores: {
          one_minute: {
            activity: apgarScores.one_minute.activity,
            pulse: apgarScores.one_minute.pulse,
            grimace: apgarScores.one_minute.grimace,
            appearance: apgarScores.one_minute.appearance,
            respiration: apgarScores.one_minute.respiration,
            total: calculateTotal('one_minute')
          },
          five_minutes: {
            activity: apgarScores.five_minutes.activity,
            pulse: apgarScores.five_minutes.pulse,
            grimace: apgarScores.five_minutes.grimace,
            appearance: apgarScores.five_minutes.appearance,
            respiration: apgarScores.five_minutes.respiration,
            total: calculateTotal('five_minutes')
          }
        },
        evaluated_by: user.id,
        evaluation_date: new Date().toISOString()
      };
      
      const response = await axios.post(`/api/birthcare/${birthcare_Id}/apgar-scores`, dataToSave);
      
      if (response.data.success) {
        alert('APGAR Score Sheet saved successfully!');
        // Optionally reset form or redirect
      } else {
        throw new Error(response.data.message || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving APGAR scores:', error);
      
      let errorMessage = 'Error saving APGAR scores. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 422) {
        errorMessage = 'Validation error. Please check your input.';
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setErrors(prev => ({...prev, save: errorMessage}));
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="ml-3 text-gray-600">Authenticating...</p>
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
            <h1 className="text-sm font-bold text-gray-800 mb-2">REPUBLIC OF THE PHILIPPINES</h1>
            <h2 className="text-lg font-bold text-gray-900 mb-1">CITY GOVERNMENT OF DAVAO</h2>
            <h3 className="text-base font-semibold text-gray-800 mb-1">BUHANGIN HEALTH CENTER- BIRTHING HOME</h3>
            <p className="text-sm text-gray-600 mb-4">NHA Buhangin, Buhangin District, Davao City</p>
            <div className="border-t border-b border-gray-300 py-3">
              <h2 className="text-xl font-bold text-gray-900">APGAR SCORE SHEET</h2>
            </div>
          </div>

          {/* Error Messages */}
          {errors.save && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.save}</p>
            </div>
          )}

          {/* Patient Information Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Baby Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter Baby's Name</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.baby_name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter baby's full name"
                />
                {errors.baby_name && <p className="mt-1 text-sm text-red-600">{errors.baby_name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case No.</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.case_no 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  value={patientInfo.case_no}
                  onChange={(e) => setPatientInfo(prev => ({...prev, case_no: e.target.value}))}
                  placeholder="Enter case number"
                />
                {errors.case_no && <p className="mt-1 text-sm text-red-600">{errors.case_no}</p>}
              </div>
            </div>

            {/* Patient Details Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo(prev => ({...prev, age: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.sex}
                  onChange={(e) => setPatientInfo(prev => ({...prev, sex: e.target.value}))}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bed No.</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.bed_no}
                  onChange={(e) => setPatientInfo(prev => ({...prev, bed_no: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.religion}
                  onChange={(e) => setPatientInfo(prev => ({...prev, religion: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.birthday}
                  onChange={(e) => setPatientInfo(prev => ({...prev, birthday: e.target.value}))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={patientInfo.address}
                  onChange={(e) => setPatientInfo(prev => ({...prev, address: e.target.value}))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* APGAR Score Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border-2 border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900 w-20"></th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                      SIGN<br/>
                      <span className="font-normal text-sm">Activity<br/>(Muscle Tone)</span>
                    </th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">0 POINT</th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">1 POINT</th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">2 POINT</th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">1 MINUTE</th>
                    <th className="border-2 border-gray-300 px-4 py-3 text-center font-bold text-gray-900">5 MINUTES</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Activity Row */}
                  <tr>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold bg-gray-50">A</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <strong>Activity</strong><br/>
                      <span className="text-sm">(Muscle Tone)</span>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Absent</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Arms and<br/>Legs Flexed</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Active<br/>Movements</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.one_minute.activity}
                        onChange={(e) => handleScoreChange('one_minute', 'activity', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.five_minutes.activity}
                        onChange={(e) => handleScoreChange('five_minutes', 'activity', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                  </tr>

                  {/* Pulse Row */}
                  <tr>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold bg-gray-50">P</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <strong>Pulse</strong>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Absent</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Below<br/>100bpm</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Above 100bpm</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.one_minute.pulse}
                        onChange={(e) => handleScoreChange('one_minute', 'pulse', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.five_minutes.pulse}
                        onChange={(e) => handleScoreChange('five_minutes', 'pulse', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                  </tr>

                  {/* Grimace Row */}
                  <tr>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold bg-gray-50">G</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <strong>Grimace</strong><br/>
                      <span className="text-sm">(Reflex Irritability)</span>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">No Response</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Grimace</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Sneeze, Cough,<br/>Pulls Away</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.one_minute.grimace}
                        onChange={(e) => handleScoreChange('one_minute', 'grimace', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.five_minutes.grimace}
                        onChange={(e) => handleScoreChange('five_minutes', 'grimace', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                  </tr>

                  {/* Appearance Row */}
                  <tr>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold bg-gray-50">A</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <strong>Appearance</strong><br/>
                      <span className="text-sm">(Skin Color)</span>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Blue-Gray<br/>Pale All Over</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Normal<br/>Except for<br/>Extremities</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Normal Over<br/>Entire Body</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.one_minute.appearance}
                        onChange={(e) => handleScoreChange('one_minute', 'appearance', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.five_minutes.appearance}
                        onChange={(e) => handleScoreChange('five_minutes', 'appearance', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                  </tr>

                  {/* Respiration Row */}
                  <tr>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold bg-gray-50">R</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <strong>Respiration</strong>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Absent</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Slow,<br/>Irregular</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center text-sm">Good, Crying</td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.one_minute.respiration}
                        onChange={(e) => handleScoreChange('one_minute', 'respiration', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <select 
                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={apgarScores.five_minutes.respiration}
                        onChange={(e) => handleScoreChange('five_minutes', 'respiration', e.target.value)}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>
                  </tr>

                  {/* Total Row */}
                  <tr className="bg-gray-100">
                    <td className="border-2 border-gray-300 px-4 py-3 text-center font-bold" colSpan={5}>
                      <strong>TOTAL</strong>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateTotal('one_minute')}
                      </div>
                    </td>
                    <td className="border-2 border-gray-300 px-4 py-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateTotal('five_minutes')}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Score Interpretation */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SCORE OF:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-medium">➤ 7 to 10</span>
                  <span className="text-green-600 font-medium">Normal</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-medium">➤ 4 to 6</span>
                  <span className="text-yellow-600 font-medium">Might require some resuscitative measures</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-medium">➤ 0 to 3</span>
                  <span className="text-red-600 font-medium">Immediate Resuscitation</span>
                </div>
              </div>

              {/* Current Scores Display */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border-2 border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">1 Minute Score</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {calculateTotal('one_minute')}
                  </div>
                  <div className={`font-medium ${getScoreInterpretation(calculateTotal('one_minute')).color}`}>
                    {getScoreInterpretation(calculateTotal('one_minute')).text}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border-2 border-green-200">
                  <h4 className="font-semibold text-gray-900 mb-2">5 Minutes Score</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {calculateTotal('five_minutes')}
                  </div>
                  <div className={`font-medium ${getScoreInterpretation(calculateTotal('five_minutes')).color}`}>
                    {getScoreInterpretation(calculateTotal('five_minutes')).text}
                  </div>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save APGAR Score'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}