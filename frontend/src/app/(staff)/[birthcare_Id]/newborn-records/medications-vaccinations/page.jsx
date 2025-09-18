'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function MedicationsVaccinations() {
    const params = useParams()
    const birthcare_Id = params.birthcare_Id
    const [templateLoaded, setTemplateLoaded] = useState(false)

    useEffect(() => {
        // Load the template in an iframe for better integration
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
                        <h3 className="text-base font-semibold text-gray-800 mb-1">BUHANGIN HEALTH CENTER-BIRTHING HOME</h3>
                        <p className="text-sm text-gray-600 mb-4">NHA Buhangin, Buhangin District, Davao City</p>
                        <div className="border-t border-b border-gray-300 py-3">
                            <h2 className="text-xl font-bold text-gray-900">MEDICATION SHEET (BABY)</h2>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-end items-center">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                🖨️ Print Template
                            </button>
                        </div>
                    </div>

                    {/* Patient Information Section - Matching Labor Monitoring */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <label className="w-20 text-sm font-medium text-gray-700">Name:</label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Patient's full name"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <label className="w-20 text-sm font-medium text-gray-700">Case No.:</label>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter case number"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Bed Number */}
                            <div className="flex items-center space-x-4">
                                <label className="w-20 text-sm font-medium text-gray-700">Bed No.:</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter bed number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Medication Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Administration Records</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider" rowSpan="2">
                                            MEDICATION
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider" rowSpan="2">
                                            TIME
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider" colSpan="4">
                                            DATE
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            DATE
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            DATE
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            DATE
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            DATE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[...Array(12)].map((_, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                            <td className="border border-gray-300 px-4 py-4 text-sm text-center text-gray-900">&nbsp;</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Single Dose Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Single Dose Medications</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Side - Single Dose Table */}
                            <div>
                                <h4 className="text-center font-bold bg-gray-100 p-2 rounded-t border text-gray-900">SINGLE DOSE</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                                                    MEDICATION
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
                                                <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Vit. K 0.1 ml @</td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="date" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="time" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-900">Hep B 0.5ml @</td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="date" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="time" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-3 text-xs font-semibold text-gray-900">Erythromycin eye ointment on both eyes</td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="date" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="time" className="w-full text-xs bg-transparent border-none focus:outline-none" />
                                                </td>
                                                <td className="border border-gray-300 px-2 py-3">
                                                    <input type="text" className="w-full bg-transparent border-none focus:outline-none" />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {/* Right Side - Name & Sample Signature */}
                            <div>
                                <h4 className="text-center font-bold bg-gray-100 p-2 rounded-t border text-gray-900">NAME & SAMPLE SIGNATURE</h4>
                                <div className="border border-gray-300 rounded-b h-48 p-4 bg-white">
                                    <p className="text-xs text-gray-500 mb-2">Healthcare provider signatures and sample signatures:</p>
                                    {/* Signature space */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Section - Matching Labor Monitoring */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <label className="w-24 text-sm font-medium text-gray-700">Attended by:</label>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Healthcare provider name"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-block">
                                        <div className="border-b border-gray-400 w-64 mb-2"></div>
                                        <p className="text-xs font-medium text-gray-700 text-center">EVELYN D. BANO, MD</p>
                                        <p className="text-xs text-gray-600 text-center">Attending Physician</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
