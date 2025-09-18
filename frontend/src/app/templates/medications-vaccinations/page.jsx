'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MedicationsVaccinations() {
    const [templateLoaded, setTemplateLoaded] = useState(false)

    useEffect(() => {
        // Load the template in an iframe for better integration
        setTemplateLoaded(true)
    }, [])

    const handlePrint = () => {
        const templateContent = document.getElementById('template-content')
        if (templateContent) {
            const printWindow = window.open('', '_blank')
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Medications & Vaccinations Record</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            table { border-collapse: collapse; width: 100%; }
                            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                            th { background-color: #f0f0f0; }
                            input, textarea { border: none; background: transparent; width: 100%; }
                            .border-2 { border: 2px solid; }
                            .border { border: 1px solid; }
                            .bg-gray-200 { background-color: #e5e5e5; }
                            .p-2 { padding: 8px; }
                            .p-3 { padding: 12px; }
                            .p-4 { padding: 16px; }
                            .p-6 { padding: 24px; }
                            .mb-2 { margin-bottom: 8px; }
                            .mb-4 { margin-bottom: 16px; }
                            .mb-6 { margin-bottom: 24px; }
                            .text-center { text-align: center; }
                            .font-bold { font-weight: bold; }
                            .grid { display: grid; }
                            .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                            .gap-6 { gap: 24px; }
                            .gap-8 { gap: 32px; }
                            .space-y-4 > * + * { margin-top: 16px; }
                            @media print {
                                body { margin: 0; }
                                .no-print { display: none; }
                            }
                        </style>
                    </head>
                    <body>
                        ${templateContent.innerHTML}
                    </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()
            printWindow.close()
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = '/templates/medications_vaccinations.html'
        link.download = 'medications_vaccinations_template.html'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/templates"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                ← Back to Templates
                            </Link>
                            <div className="border-l border-gray-300 pl-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    💉 Medications & Vaccinations Template
                                </h1>
                                <p className="text-gray-600">
                                    Track medications and vaccinations for newborns and infants
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                🖨️ Print Template
                            </button>
                            <button
                                onClick={handleDownload}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                📥 Download HTML
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Template Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Instructions Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-3">
                        📋 Instructions for Use
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                            <h3 className="font-semibold mb-2">Essential Medications:</h3>
                            <ul className="space-y-1">
                                <li>• <strong>Vitamin K (1mg IM)</strong> - Within 1 hour of birth</li>
                                <li>• <strong>Eye Prophylaxis</strong> - Prevents infections</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Key Vaccinations:</h3>
                            <ul className="space-y-1">
                                <li>• <strong>Hepatitis B</strong> - Birth dose within 24 hours</li>
                                <li>• <strong>BCG</strong> - TB prevention (single dose)</li>
                                <li>• <strong>Other vaccines</strong> - Per national schedule</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Template Frame */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Template Form
                        </h3>
                        <p className="text-sm text-gray-600">
                            Fill out the form below and print for official use
                        </p>
                    </div>
                    <div className="p-6">
                        {/* Embedded Template Content - Official Davao City Format */}
                        <div id="template-content" className="medication-template bg-white">
                            {/* Header - Official Format */}
                            <div className="text-center mb-6">
                                <div className="mb-2">
                                    <p className="text-sm font-bold">REPUBLIC OF THE PHILIPPINES</p>
                                    <p className="text-lg font-bold">CITY GOVERNMENT OF DAVAO</p>
                                    <p className="text-sm">BUHANGIN HEALTH CENTER - BIRTHING HOME</p>
                                    <p className="text-xs">NHA Buhangin, Buhangin District, Davao City</p>
                                </div>
                                
                                <div className="mt-6 mb-4">
                                    <h1 className="text-xl font-bold underline">MEDICATION SHEET (BABY)</h1>
                                </div>
                                
                                <div className="flex justify-between items-center mb-6 text-sm">
                                    <div className="flex items-center">
                                        <span className="mr-2">Case No.:</span>
                                        <input type="text" className="border-b border-black bg-transparent w-24" />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-2">Bed No.:</span>
                                        <input type="text" className="border-b border-black bg-transparent w-24" />
                                    </div>
                                </div>
                                
                                <div className="mb-6 text-left">
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm">Name:</span>
                                        <input type="text" className="border-b border-black bg-transparent flex-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Main Medication Table */}
                            <div className="mb-6">
                                <table className="w-full border-collapse border border-black">
                                    <thead>
                                        <tr>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100" rowSpan="2">MEDICATION</th>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100" rowSpan="2">TIME</th>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100" colSpan="4">DATE</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100">DATE</th>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100">DATE</th>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100">DATE</th>
                                            <th className="border border-black p-2 text-center font-bold bg-gray-100">DATE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Empty rows for medication entries */}
                                        {[...Array(12)].map((_, index) => (
                                            <tr key={index} className="h-8">
                                                <td className="border border-black p-1"></td>
                                                <td className="border border-black p-1"></td>
                                                <td className="border border-black p-1"></td>
                                                <td className="border border-black p-1"></td>
                                                <td className="border border-black p-1"></td>
                                                <td className="border border-black p-1"></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Single Dose Section */}
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Left Side - Single Dose */}
                                    <div>
                                        <h3 className="font-bold text-center mb-2 bg-gray-100 p-1 border border-black">SINGLE DOSE</h3>
                                        <table className="w-full border-collapse border border-black">
                                            <tbody>
                                                <tr>
                                                    <td className="border border-black p-2 font-semibold bg-gray-50">Vit. K 0.1 ml @</td>
                                                    <td className="border border-black p-1 w-20">
                                                        <span className="text-xs">Date</span><br/>
                                                        <input type="date" className="w-full bg-transparent text-xs mt-1" />
                                                    </td>
                                                    <td className="border border-black p-1 w-20">
                                                        <span className="text-xs">Time</span><br/>
                                                        <input type="time" className="w-full bg-transparent text-xs mt-1" />
                                                    </td>
                                                    <td className="border border-black p-1">
                                                        <span className="text-xs">Signature</span><br/>
                                                        <input type="text" className="w-full bg-transparent mt-1" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-black p-2 font-semibold bg-gray-50">Hep B 0.5ml @</td>
                                                    <td className="border border-black p-1">
                                                        <input type="date" className="w-full bg-transparent text-xs" />
                                                    </td>
                                                    <td className="border border-black p-1">
                                                        <input type="time" className="w-full bg-transparent text-xs" />
                                                    </td>
                                                    <td className="border border-black p-1">
                                                        <input type="text" className="w-full bg-transparent" />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border border-black p-2 font-semibold bg-gray-50" style={{fontSize: '11px'}}>Erythromycin eye ointment on both eyes</td>
                                                    <td className="border border-black p-1">
                                                        <input type="date" className="w-full bg-transparent text-xs" />
                                                    </td>
                                                    <td className="border border-black p-1">
                                                        <input type="time" className="w-full bg-transparent text-xs" />
                                                    </td>
                                                    <td className="border border-black p-1">
                                                        <input type="text" className="w-full bg-transparent" />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                    {/* Right Side - Name & Sample Signature */}
                                    <div>
                                        <h3 className="font-bold text-center mb-2 bg-gray-100 p-1 border border-black">Name & Sample Signature</h3>
                                        <div className="border border-black h-32 p-2">
                                            {/* This space is for signatures as per the original form */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Attended by Section */}
                            <div className="mt-8">
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">Attended by:</span>
                                    <input type="text" className="border-b border-black bg-transparent flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            ⚠️ Safety Guidelines
                        </h3>
                        <ul className="space-y-3 text-gray-700 text-sm">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span><strong>Allergies:</strong> Always check for known allergies before administration</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span><strong>Contraindications:</strong> Review medical history for any contraindications</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span><strong>Lot Numbers:</strong> Always record vaccine lot numbers for tracking</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2 mt-1">•</span>
                                <span><strong>Monitoring:</strong> Watch for adverse reactions post-administration</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            📅 Follow-up Schedule
                        </h3>
                        <ul className="space-y-3 text-gray-700 text-sm">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">•</span>
                                <span><strong>2 months:</strong> DTaP, Hib, PCV13, IPV, RV</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">•</span>
                                <span><strong>4 months:</strong> DTaP, Hib, PCV13, IPV, RV</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">•</span>
                                <span><strong>6 months:</strong> DTaP, Hib, PCV13, Hepatitis B</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">•</span>
                                <span><strong>12 months:</strong> MMR, Varicella, PCV13, Hib</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}