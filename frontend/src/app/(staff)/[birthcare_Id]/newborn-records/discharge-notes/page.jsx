'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function DischargeNotes() {
    const params = useParams()
    const birthcare_Id = params.birthcare_Id
    const [templateLoaded, setTemplateLoaded] = useState(false)

    useEffect(() => {
        setTemplateLoaded(true)
    }, [])

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Official Header - Matching Labor Monitoring */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-8 text-center border-b border-gray-200">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-sm font-bold text-gray-800 mb-2">REPUBLIC OF THE PHILIPPINES</h1>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">CITY GOVERNMENT OF DAVAO</h2>
                        <h3 className="text-base font-semibold text-gray-800 mb-1">BUHANGIN HEALTH CENTER-BIRTHING HOME</h3>
                        <p className="text-sm text-gray-600 mb-4">NHA Buhangin, Buhangin District, Davao City</p>
                        <div className="border-t border-b border-gray-300 py-3">
                            <h2 className="text-xl font-bold text-gray-900">NEWBORN DISCHARGE INSTRUCTION SLIP</h2>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-end items-center">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                🖨️ Print Discharge Slip
                            </button>
                        </div>
                    </div>

                    {/* Patient Information Section */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            {/* First Row */}
                            <div className="flex items-center space-x-4">
                                <label className="w-32 text-sm font-medium text-gray-700">Name of Patient:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Patient's full name"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-20 text-sm font-medium text-gray-700">Bed #:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Bed number"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-20 text-sm font-medium text-gray-700">Case No.:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Case number"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Second Row */}
                            <div className="flex items-center space-x-4">
                                <label className="w-32 text-sm font-medium text-gray-700">Date Admitted:</label>
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-32 text-sm font-medium text-gray-700">Date/Time Discharged:</label>
                                <div className="flex-1">
                                    <input
                                        type="datetime-local"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Third Row */}
                            <div className="flex items-center space-x-4">
                                <label className="w-32 text-sm font-medium text-gray-700">Discharge Diagnosis:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Diagnosis"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="w-20 text-sm font-medium text-gray-700">Weight:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Weight"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vaccines Given Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Name of Vaccine Given</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            NAME OF VACCINE GIVEN
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            DATE
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            TIME
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            SIGNATURE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Hepa B 0.5ml, IM</td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="date" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="time" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Vit. K 0.1 ml, IM</td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="date" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="time" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Erythromycin Eye Ointment, OU</td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="date" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="time" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Others:</td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="date" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="time" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                        <td className="border border-gray-300 px-2 py-3">
                                            <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Special Instructions Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions:</h3>
                        <div className="space-y-4">
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-vertical"
                                placeholder="Enter special instructions for patient discharge..."
                            />
                        </div>
                    </div>
                </div>

                {/* Follow up Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow up check up on:</h3>
                        <div className="space-y-4">
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-vertical"
                                placeholder="Enter follow-up schedule and instructions..."
                            />
                        </div>
                    </div>
                </div>

                {/* Note and Signature Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="mb-6">
                            <p className="text-sm font-bold text-gray-900 mb-2">NOTE: PALIHOG DALAHA KINI NGA FORM SA PANAHON SA PAG FOLLOW-UP CHECK-UP.</p>
                            <div className="flex items-center space-x-4">
                                <label className="w-32 text-sm font-medium text-gray-700">Staff Giving Instructions:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Staff member name"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Signatures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="text-center">
                                <div className="border-b border-gray-400 w-64 mb-2 mx-auto"></div>
                                <p className="text-xs font-medium text-gray-700">Name and Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="border-b border-gray-400 w-64 mb-2 mx-auto"></div>
                                <p className="text-xs font-medium text-gray-700">Name of Parent/Guardian and Signature</p>
                            </div>
                        </div>

                        {/* Duplicate Form Notice */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">NEWBORN DISCHARGE INSTRUCTION SLIP</h3>
                            <p className="text-xs text-gray-600 text-center mb-4">(Duplicate Copy)</p>
                            
                            {/* Duplicate form fields - simplified */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Name of Patient:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Bed #:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Case No.:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Date Admitted:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Date/Time Discharged:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Discharge Diagnosis:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="font-medium text-gray-700">Weight:</label>
                                    <div className="border-b border-gray-300 flex-1"></div>
                                </div>
                            </div>

                            {/* Duplicate signatures */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                <div className="text-center">
                                    <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                                    <p className="text-xs font-medium text-gray-700">Name and Signature</p>
                                </div>
                                <div className="text-center">
                                    <div className="border-b border-gray-400 w-48 mb-2 mx-auto"></div>
                                    <p className="text-xs font-medium text-gray-700">Name of Parent/Guardian and Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}