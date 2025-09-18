'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CertificateLiveBirth() {
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
                        <title>Certificate of Live Birth</title>
                        <style>
                            body { font-family: 'Times New Roman', serif; margin: 20px; line-height: 1.4; }
                            table { border-collapse: collapse; width: 100%; }
                            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
                            th { background-color: #f0f0f0; }
                            input, textarea, select { border: none; background: transparent; width: 100%; }
                            .border-2 { border: 2px solid; }
                            .border-4 { border: 4px solid; }
                            .border { border: 1px solid; }
                            .border-black { border-color: #000; }
                            .bg-gray-50 { background-color: #f9f9f9; }
                            .bg-gray-200 { background-color: #e5e5e5; }
                            .p-2 { padding: 8px; }
                            .p-3 { padding: 12px; }
                            .p-4 { padding: 16px; }
                            .p-6 { padding: 24px; }
                            .mb-2 { margin-bottom: 8px; }
                            .mb-4 { margin-bottom: 16px; }
                            .mb-6 { margin-bottom: 24px; }
                            .mb-8 { margin-bottom: 32px; }
                            .text-center { text-align: center; }
                            .text-right { text-right: right; }
                            .font-bold { font-weight: bold; }
                            .text-xs { font-size: 12px; }
                            .text-sm { font-size: 14px; }
                            .text-xl { font-size: 20px; }
                            .text-3xl { font-size: 28px; }
                            .uppercase { text-transform: uppercase; }
                            .tracking-wider { letter-spacing: 0.1em; }
                            .grid { display: grid; }
                            .grid-cols-2 { grid-template-columns: 1fr 1fr; }
                            .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
                            .gap-4 { gap: 16px; }
                            .gap-8 { gap: 32px; }
                            .space-y-4 > * + * { margin-top: 16px; }
                            .leading-tight { line-height: 1.25; }
                            .text-justify { text-align: justify; }
                            @media print {
                                body { margin: 0.5in; }
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
        link.href = '/templates/certificate_live_birth.html'
        link.download = 'certificate_live_birth_template.html'
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
                                    📋 Certificate of Live Birth Template
                                </h1>
                                <p className="text-gray-600">
                                    Official document for birth registration and legal documentation
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                🖨️ Print Certificate
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-green-900 mb-3">
                        📋 Certificate Instructions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                        <div>
                            <h3 className="font-semibold mb-2">Required Information:</h3>
                            <ul className="space-y-1">
                                <li>• <strong>Child Details:</strong> Full name, sex, birth date/time</li>
                                <li>• <strong>Birth Location:</strong> Hospital, city, state, country</li>
                                <li>• <strong>Parents' Info:</strong> Complete names, ages, addresses</li>
                                <li>• <strong>Medical Data:</strong> Weight, length, delivery method</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Legal Requirements:</h3>
                            <ul className="space-y-1">
                                <li>• <strong>Signatures:</strong> Parents, medical attendant, informant</li>
                                <li>• <strong>Official Seal:</strong> Local civil registrar certification</li>
                                <li>• <strong>Timeline:</strong> Must be filed within 30 days</li>
                                <li>• <strong>Accuracy:</strong> All information must be verifiable</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Template Frame */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Official Certificate Form
                        </h3>
                        <p className="text-sm text-gray-600">
                            Complete all sections for official birth registration
                        </p>
                    </div>
                    <div className="p-6">
                        {/* Embedded Certificate Template */}
                        <div id="template-content" className="certificate-template">
                            {/* Certificate Header */}
                            <div className="text-right mb-4">
                                <strong>Certificate No:</strong> <input type="text" className="w-32 border-b border-black bg-transparent inline" />
                            </div>

                            <div className="text-center border-4 border-black p-6 mb-8 bg-gray-50">
                                <h1 className="text-3xl font-bold mb-2 tracking-wider">CERTIFICATE OF LIVE BIRTH</h1>
                                <h2 className="text-xl">State/Province Birth Registration</h2>
                            </div>

                            {/* Child Information */}
                            <div className="mb-6 border border-gray-400 rounded">
                                <div className="bg-gray-200 p-3 font-bold text-sm uppercase border-b border-gray-400">
                                    Child Information
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-48">Full Name of Child</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-20">Sex</label>
                                            <select className="flex-1 border-b-2 border-black bg-transparent p-1">
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Intersex">Intersex</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Date of Birth</label>
                                            <input type="date" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Time of Birth</label>
                                            <input type="time" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-48">Place of Birth (Hospital/Facility)</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">City/Municipality</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">State/Province</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-20">Country</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" defaultValue="Philippines" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Birth Details */}
                            <div className="mb-6 border border-gray-400 rounded">
                                <div className="bg-gray-200 p-3 font-bold text-sm uppercase border-b border-gray-400">
                                    Birth Details
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Birth Weight (grams)</label>
                                            <input type="number" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-20">Length (cm)</label>
                                            <input type="number" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Gestational Age (weeks)</label>
                                            <input type="number" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Type of Birth</label>
                                            <select className="flex-1 border-b-2 border-black bg-transparent p-1">
                                                <option value="">Select</option>
                                                <option value="Single">Single</option>
                                                <option value="Twin">Twin</option>
                                                <option value="Triplet">Triplet</option>
                                                <option value="Multiple">Other Multiple</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Method of Delivery</label>
                                            <select className="flex-1 border-b-2 border-black bg-transparent p-1">
                                                <option value="">Select</option>
                                                <option value="Vaginal">Vaginal</option>
                                                <option value="Cesarean">Cesarean Section</option>
                                                <option value="Assisted">Assisted Delivery</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex space-x-8">
                                        <label className="flex items-center text-xs">
                                            <input type="checkbox" className="mr-2" /> Premature Birth
                                        </label>
                                        <label className="flex items-center text-xs">
                                            <input type="checkbox" className="mr-2" /> Birth Complications
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Mother's Information */}
                            <div className="mb-6 border border-gray-400 rounded">
                                <div className="bg-gray-200 p-3 font-bold text-sm uppercase border-b border-gray-400">
                                    Mother's Information
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-48">Mother's Full Name (Maiden Name)</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-48">Mother's Full Name (Current)</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Date of Birth</label>
                                            <input type="date" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Age at Time of Birth</label>
                                            <input type="number" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Place of Birth</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-24">Nationality</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-24">Occupation</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-32">Mother's Address</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Father's Information */}
                            <div className="mb-6 border border-gray-400 rounded">
                                <div className="bg-gray-200 p-3 font-bold text-sm uppercase border-b border-gray-400">
                                    Father's Information
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-32">Father's Full Name</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Date of Birth</label>
                                            <input type="date" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Age at Time of Birth</label>
                                            <input type="number" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Place of Birth</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-24">Nationality</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-24">Occupation</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-32">Father's Address</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Medical Attendant Information */}
                            <div className="mb-6 border border-gray-400 rounded">
                                <div className="bg-gray-200 p-3 font-bold text-sm uppercase border-b border-gray-400">
                                    Medical Attendant Information
                                </div>
                                <div className="p-4 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Name of Attendant</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Title/Position</label>
                                            <select className="flex-1 border-b-2 border-black bg-transparent p-1">
                                                <option value="">Select</option>
                                                <option value="Physician">Physician (MD)</option>
                                                <option value="Midwife">Certified Midwife</option>
                                                <option value="Nurse">Registered Nurse</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">License Number</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="font-bold text-xs uppercase w-32">Hospital/Clinic Name</label>
                                            <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="font-bold text-xs uppercase w-32">Facility Address</label>
                                        <input type="text" className="flex-1 border-b-2 border-black bg-transparent p-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Certification and Signatures */}
                            <div className="border-2 border-black p-6">
                                <div className="bg-gray-200 p-3 mb-6 font-bold text-sm uppercase border-b border-black">
                                    Certification and Signatures
                                </div>
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <div className="border-b border-black h-12 mb-2"></div>
                                        <div className="text-center text-xs font-bold">Mother's Signature</div>
                                        <div className="text-center mt-2">
                                            <label className="text-xs">Date:</label>
                                            <input type="date" className="w-24 text-xs bg-transparent" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-b border-black h-12 mb-2"></div>
                                        <div className="text-center text-xs font-bold">Father's Signature</div>
                                        <div className="text-center mt-2">
                                            <label className="text-xs">Date:</label>
                                            <input type="date" className="w-24 text-xs bg-transparent" />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <div className="border-b border-black h-12 mb-2"></div>
                                        <div className="text-center text-xs font-bold">Medical Attendant Signature</div>
                                        <div className="text-center mt-2">
                                            <label className="text-xs">Date:</label>
                                            <input type="date" className="w-24 text-xs bg-transparent" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-b border-black h-12 mb-2"></div>
                                        <div className="text-center text-xs font-bold">Informant's Signature</div>
                                        <div className="text-center mt-2">
                                            <label className="text-xs">Date:</label>
                                            <input type="date" className="w-24 text-xs bg-transparent" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-justify mb-4 leading-tight">
                                    I hereby certify that the above information is true and correct based on the facts presented to me 
                                    and that this birth occurred as stated above. This certificate is issued in accordance with the 
                                    vital statistics laws of this jurisdiction.
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="border-b border-black h-12 mb-2"></div>
                                        <div className="text-center text-xs font-bold">Local Civil Registrar</div>
                                        <div className="flex justify-between mt-2">
                                            <div>
                                                <label className="text-xs">Date:</label>
                                                <input type="date" className="w-24 text-xs bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">Registration No:</label>
                                                <input type="text" className="w-20 text-xs bg-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="border-2 border-black h-24 flex items-center justify-center text-xs text-gray-500">
                                            OFFICIAL<br />SEAL
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-8 text-xs text-gray-600">
                                <p><strong>IMPORTANT:</strong> This certificate is valid only when bearing the official seal and signature of the Local Civil Registrar.</p>
                                <p>Any alteration or erasure will invalidate this certificate. Report any discrepancies to the issuing office immediately.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            ⚖️ Legal Considerations
                        </h3>
                        <ul className="space-y-3 text-gray-700 text-sm">
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span><strong>Filing Deadline:</strong> Must be completed within 30 days of birth</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span><strong>Required Witnesses:</strong> Medical attendant and informant must sign</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span><strong>Official Registration:</strong> Certified by Local Civil Registrar</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-blue-500 mr-2 mt-1">•</span>
                                <span><strong>Document Integrity:</strong> Any alterations will invalidate certificate</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            📋 Section Checklist
                        </h3>
                        <ul className="space-y-3 text-gray-700 text-sm">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Child Information:</strong> Name, sex, birth details</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Birth Details:</strong> Weight, length, delivery method</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Mother's Information:</strong> Complete personal details</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Father's Information:</strong> Personal details and acknowledgment</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Marriage Information:</strong> Legal status documentation</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Medical Attendant:</strong> Healthcare provider certification</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">☐</span>
                                <span><strong>Signatures:</strong> All required parties have signed</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <span className="text-yellow-400 text-2xl">⚠️</span>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-yellow-800">
                                Important Notice
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p className="mb-2">
                                    <strong>This is a sample template.</strong> Always consult your local civil registration office for official requirements and procedures specific to your jurisdiction.
                                </p>
                                <p>
                                    Birth registration laws and requirements may vary by location. Ensure compliance with local regulations before using this template for official purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}