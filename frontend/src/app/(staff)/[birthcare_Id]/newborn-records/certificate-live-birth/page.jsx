'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'


export default function CertificateLiveBirth() {
    const params = useParams()
    const birthcare_Id = params.birthcare_Id
    const [templateLoaded, setTemplateLoaded] = useState(false)

    useEffect(() => {
        setTemplateLoaded(true)
        
        // Add print styles to document head
        const printStyles = document.createElement('style')
        printStyles.textContent = `
            @media print {
                /* Hide everything */
                body * {
                    visibility: hidden;
                }
                
                /* Show only certificate */
                .print-certificate, .print-certificate * {
                    visibility: visible;
                }
                
                /* Position certificate */
                .print-certificate {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100% !important;
                    height: auto !important;
                    background: white !important;
                    margin: 0 !important;
                    padding: 15px !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                }
                
                /* Hide UI elements */
                .print-button-container {
                    display: none !important;
                }
                
                /* Page setup */
                @page {
                    margin: 0.3in;
                    size: letter;
                }
                
                /* Body styling */
                html, body {
                    width: 100%;
                    height: auto;
                    margin: 0;
                    padding: 0;
                    background: white;
                    font-size: 10pt;
                }
                
                /* Text and border colors for print */
                .print-certificate .border-black {
                    border-color: black !important;
                }
                
                .print-certificate .border-green-600 {
                    border-color: #16a34a !important;
                }
                
                .print-certificate .text-green-600 {
                    color: #16a34a !important;
                }
                
                /* Background colors for print */
                .print-certificate .bg-gray-100 {
                    background-color: #f3f4f6 !important;
                    -webkit-print-color-adjust: exact;
                }
                
                .print-certificate .bg-green-100 {
                    background-color: #dcfce7 !important;
                    -webkit-print-color-adjust: exact;
                }
                
                .print-certificate .bg-green-200 {
                    background-color: #bbf7d0 !important;
                    -webkit-print-color-adjust: exact;
                }
            }
        `
        document.head.appendChild(printStyles)
        
        return () => {
            document.head.removeChild(printStyles)
        }
    }, [])

    const handlePrint = () => {
        window.print()
    }

    return (
        <>
            <PrintStyles />
            <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Official Header */}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-sm font-bold text-gray-800 mb-2">REPUBLIC OF THE PHILIPPINES</h1>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">OFFICE OF THE CIVIL REGISTRAR-GENERAL</h2>
                        <h3 className="text-xl font-bold text-gray-900">CERTIFICATE OF LIVE BIRTH</h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-b border-gray-200 print-button-container">
                        <div className="flex justify-end items-center">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                🖨️ Print Certificate
                            </button>
                        </div>
                    </div>
                </div>

                {/* Official Certificate Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 print-certificate">
                    <div className="p-6">
                        {/* Certificate Border and Header */}
                        <div className="border-4 border-green-600 p-6">
                            {/* Header Section */}
                            <div className="text-center mb-6">
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="text-left">
                                        <p className="text-xs">Document Classification: Open/Closed Document/As prescribed/as authorized
                                            In the Administrative Regulations in this CAS and SOP File.</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold">Republic of the Philippines</p>
                                        <p className="font-bold">OFFICE OF THE CIVIL REGISTRAR-GENERAL</p>
                                        <p className="font-bold text-lg">CERTIFICATE OF LIVE BIRTH</p>
                                    </div>
                                    <div className="text-right bg-green-200 p-2 border border-green-600">
                                        <p className="font-bold text-xs">REMARKS/ANNOTATION</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="grid grid-cols-12 gap-2 text-xs">
                                {/* Left Column */}
                                <div className="col-span-8 space-y-2">
                                    {/* Province/City */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="font-bold">Province</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">City/Municipality</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="font-bold">Registry No.</label>
                                        <input type="text" className="w-full border-b border-black bg-transparent" />
                                    </div>

                                    {/* Child Section */}
                                    <div className="bg-gray-100 p-2 border border-black">
                                        <h3 className="font-bold text-center">CHILD</h3>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="font-bold">1. NAME</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-xs">(First)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Middle)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Last)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sex and Date of Birth */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="font-bold">2. SEX</label>
                                            <div className="flex gap-2">
                                                <label><input type="radio" name="sex" value="Male" /> Male</label>
                                                <label><input type="radio" name="sex" value="Female" /> Female</label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-bold">3. DATE OF BIRTH</label>
                                            <div className="grid grid-cols-3 gap-1">
                                                <input type="text" placeholder="(day)" className="border-b border-black bg-transparent text-center" />
                                                <input type="text" placeholder="(month)" className="border-b border-black bg-transparent text-center" />
                                                <input type="text" placeholder="(year)" className="border-b border-black bg-transparent text-center" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Place of Birth */}
                                    <div>
                                        <label className="font-bold">4. PLACE OF BIRTH</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            <div>
                                                <label className="text-xs">Name of Hospital/Clinic/Institution (House No., Street, Barangay)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">City/Municipality</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">Province</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type of Birth and Multiple Birth */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">5a. TYPE OF BIRTH</label>
                                            <div className="flex gap-2">
                                                <label><input type="radio" name="birth_type" value="Single" /> Single</label>
                                                <label><input type="radio" name="birth_type" value="Twin" /> Twin</label>
                                                <label><input type="radio" name="birth_type" value="Triplet" /> Triplet</label>
                                                <label><input type="radio" name="birth_type" value="etc" /> etc.</label>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-bold">5b. IF MULTIPLE BIRTH: CHILD WAS</label>
                                            <div>
                                                <label>First</label>
                                                <input type="text" className="w-8 border border-black text-center mx-1" />
                                                <label>Second</label>
                                                <input type="text" className="w-8 border border-black text-center mx-1" />
                                                <label>Third</label>
                                                <input type="text" className="w-8 border border-black text-center mx-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Birth Order and Weight */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">6. BIRTH ORDER</label>
                                            <p className="text-xs">For this birth, state birth order (including this delivery)</p>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">7. WEIGHT AT BIRTH</label>
                                            <input type="text" placeholder="grams" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Mother Section */}
                                    <div className="bg-gray-100 p-2 border border-black mt-4">
                                        <h3 className="font-bold text-center">MOTHER</h3>
                                    </div>

                                    {/* Mother's Maiden Name */}
                                    <div>
                                        <label className="font-bold">8. MAIDEN NAME</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-xs">(First)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Middle)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Last)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Citizenship and Religion */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">9. CITIZENSHIP</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">10. RELIGION</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Mother's Statistics */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="font-bold">9a. Total number of children born alive</label>
                                            <input type="text" className="w-full border border-black text-center" />
                                        </div>
                                        <div>
                                            <label className="font-bold">9b. No. of children still living including this birth</label>
                                            <input type="text" className="w-full border border-black text-center" />
                                        </div>
                                        <div>
                                            <label className="font-bold">9c. No. of children born alive now dead</label>
                                            <input type="text" className="w-full border border-black text-center" />
                                        </div>
                                    </div>

                                    {/* Occupation and Age */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">11. OCCUPATION</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">12. Age at the time of this birth</label>
                                            <input type="text" placeholder="years" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Residence */}
                                    <div>
                                        <label className="font-bold">13. RESIDENCE</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-xs">(House No., Street, Barangay)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">City/Municipality</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">Province</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Father Section */}
                                    <div className="bg-gray-100 p-2 border border-black mt-4">
                                        <h3 className="font-bold text-center">FATHER</h3>
                                    </div>

                                    {/* Father's Name */}
                                    <div>
                                        <label className="font-bold">14. NAME</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="text-xs">(First)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Middle)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label className="text-xs">(Last)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Father's Citizenship and Religion */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">15. CITIZENSHIP</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">16. RELIGION</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Father's Occupation and Age */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="font-bold">17. OCCUPATION</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                        <div>
                                            <label className="font-bold">18. Age at the time of this birth</label>
                                            <input type="text" placeholder="years" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Marriage Information */}
                                    <div>
                                        <label className="font-bold">19. DATE AND PLACE OF MARRIAGE OF PARENTS (if not married, accomplish Affidavit of Acknowledgment/Admission of Paternity at the back)</label>
                                        <input type="text" className="w-full border-b border-black bg-transparent" />
                                    </div>

                                    {/* Attendant */}
                                    <div>
                                        <label className="font-bold">20a. ATTENDANT</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label>1. Physician (Doctor of Medicine)</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>2. Nurse</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>3. Midwife</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certification */}
                                    <div className="mt-4">
                                        <label className="font-bold">20b. CERTIFICATION OF BIRTH</label>
                                        <p className="text-xs">I hereby certify that this child whose birth is herein registered was born alive at</p>
                                        <div className="flex gap-2 items-center">
                                            <input type="text" className="flex-1 border-b border-black bg-transparent" />
                                            <span>o'clock</span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-4">
                                            <div>
                                                <label>Signature</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>Address</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                        <div className="mt-2 grid grid-cols-2 gap-4">
                                            <div>
                                                <label>Name in Print</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>Date</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Title or Position</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Informant */}
                                    <div className="mt-4">
                                        <label className="font-bold">21. INFORMANT</label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <label>Signature</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>Address</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <label>Name in Print</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <label>Date</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Relationship to the child</label>
                                            <input type="text" className="w-full border-b border-black bg-transparent" />
                                        </div>
                                    </div>

                                    {/* Prepared By and Received */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="font-bold">22. PREPARED BY</label>
                                            <div className="mt-2">
                                                <label>Signature</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Name in Print</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Title or Position</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Date</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="font-bold">23. RECEIVED AT THE OFFICE OF THE CIVIL REGISTRAR</label>
                                            <div className="mt-2">
                                                <label>Signature</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Name in Print</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Title or Position</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div className="mt-2">
                                                <label>Date</label>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Remarks/Annotation */}
                                <div className="col-span-4 bg-green-100 border border-green-600 p-2">
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold">FOR OCRG USE ONLY</p>
                                        
                                        {/* Grid of numbered boxes */}
                                        <div className="grid grid-cols-4 gap-1">
                                            {[...Array(20)].map((_, i) => (
                                                <div key={i} className="border border-black h-6 flex items-center justify-center text-xs">
                                                    {i + 1}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <div className="border border-black h-8"></div>
                                            <p className="text-xs">TO BE FILLED UP AT THE OFFICE OF THE CIVIL REGISTRAR</p>
                                            
                                            <div className="grid grid-cols-2 gap-1">
                                                {[...Array(20)].map((_, i) => (
                                                    <div key={i} className="border border-black h-6"></div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-3 gap-1 mt-4">
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className="border border-black h-6"></div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-1 mt-4">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className="border border-black h-6"></div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 gap-1 mt-4">
                                                {[...Array(2)].map((_, i) => (
                                                    <div key={i} className="border border-black h-6"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back Page - Affidavit Section */}
                            <div className="mt-8 pt-8 border-t-4 border-green-600">
                                <div className="border border-green-600 p-4">
                                    <h3 className="font-bold text-center mb-4">For births before 3 August 1988/on or after 3 August 1988</h3>
                                    
                                    <h3 className="font-bold text-center text-green-600 mb-4">AFFIDAVIT OF ACKNOWLEDGEMENT/ADMISSION OF PATERNITY</h3>
                                    
                                    <div className="space-y-4 text-xs">
                                        <div className="flex items-center">
                                            <span>I,</span>
                                            <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                            <span>, of legal age, single/married</span>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <span>parents/parents of the child mentioned in this Certificate of Live Birth do hereby solemnly swear that the information contained herein are true and correct to the best of my/our knowledge and belief.</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-8">
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Signature of Father)</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Signature of Mother)</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p>Community Tax No.</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Date Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Place Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                            <div>
                                                <p>Community Tax No.</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Date Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Place Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>

                                        <div className="text-center mt-8">
                                            <p className="font-bold">SUBSCRIBED AND SWORN</p>
                                            <div className="flex items-center justify-center mt-2">
                                                <span>to before me this</span>
                                                <input type="text" className="w-12 border-b border-black bg-transparent mx-2 text-center" />
                                                <span>day of</span>
                                                <input type="text" className="w-24 border-b border-black bg-transparent mx-2" />
                                                <span>, Philippines.</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-8">
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Signature of Administering Officer)</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Title/Designation)</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Name in Print)</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Address)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delayed Registration Section */}
                                <div className="border border-green-600 p-4 mt-4">
                                    <p className="text-xs text-green-600 mb-2">Not applicable for births before 27 February 1931</p>
                                    <h3 className="font-bold text-center text-green-600 mb-4">AFFIDAVIT FOR DELAYED REGISTRATION OF BIRTH</h3>
                                    
                                    <div className="space-y-4 text-xs">
                                        <div className="flex items-center">
                                            <span>(Enter the appropriate heading and information)</span>
                                            <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <span>and with residence and postal address at</span>
                                            <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                            <span>of legal age, single/married after having been duly sworn in accordance with law, do hereby depose and say:</span>
                                        </div>

                                        <div className="space-y-2">
                                            <div>
                                                <span>1. That I am the applicant for the delayed registration of my birth of the birth of</span>
                                            </div>
                                            <div>
                                                <span>2. That the/she was born on</span>
                                                <input type="text" className="w-32 border-b border-black bg-transparent mx-2" />
                                                <span>at</span>
                                            </div>
                                            <div>
                                                <span>3. That the/she attended school/birth by</span>
                                                <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                                <span>who resides at</span>
                                            </div>
                                            <div>
                                                <span>4. That the/she is a citizen of</span>
                                                <input type="text" className="w-32 border-b border-black bg-transparent mx-2" />
                                            </div>
                                            <div className="flex items-center">
                                                <span>5. That my/her parents were</span>
                                                <label className="mx-2"><input type="checkbox" /> married on</label>
                                                <input type="text" className="w-32 border-b border-black bg-transparent" />
                                            </div>
                                            <div className="flex items-center ml-8">
                                                <label><input type="checkbox" /> not married but was acknowledged by my/his/her father whose</label>
                                            </div>
                                            <div className="flex items-center ml-8">
                                                <span>name appears on this certificate</span>
                                            </div>
                                            <div>
                                                <span>6. That the reason for the delay in registering my/his/her birth was due to</span>
                                                <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                            </div>
                                            <div>
                                                <span>7. That a copy of my/his/her birth certificate is needed for the purpose of</span>
                                                <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                            </div>
                                            <div className="flex items-center mt-4">
                                                <label><input type="checkbox" /> 8. (For the applicant only) That I am married to</label>
                                                <input type="text" className="flex-1 border-b border-black bg-transparent mx-2" />
                                            </div>
                                            <div className="flex items-center ml-8">
                                                <label><input type="checkbox" /> (For the father/mother/guardian) That I am the</label>
                                                <input type="text" className="w-32 border-b border-black bg-transparent mx-2" />
                                                <span>of the said person.</span>
                                            </div>
                                        </div>

                                        <div className="text-center mt-8">
                                            <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                            <p>(Signature of Affiant)</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p>Community Tax No.</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Date Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                                <p>Place Issued:</p>
                                                <input type="text" className="w-full border-b border-black bg-transparent" />
                                            </div>
                                        </div>

                                        <div className="text-center mt-6">
                                            <div className="flex items-center justify-center">
                                                <span>SUBSCRIBED AND SWORN</span>
                                                <span className="mx-2">to before me this</span>
                                                <input type="text" className="w-12 border-b border-black bg-transparent text-center" />
                                                <span className="mx-2">day of</span>
                                                <input type="text" className="w-24 border-b border-black bg-transparent" />
                                                <span className="mx-2">, Philippines.</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 mt-8">
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Signature of Administering Officer)</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Title/Designation)</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Name in Print)</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black w-48 mb-2 mx-auto"></div>
                                                <p>(Address)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}