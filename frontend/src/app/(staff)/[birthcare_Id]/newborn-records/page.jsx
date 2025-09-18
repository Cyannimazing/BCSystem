'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function NewbornRecords() {
    const params = useParams()
    const birthcare_Id = params.birthcare_Id

    const records = [
        {
            id: 'medications-vaccinations',
            title: 'Medications & Vaccinations',
            description: 'Official medication sheet for baby - Track medications and vaccinations',
            icon: '💉',
            path: `/${birthcare_Id}/newborn-records/medications-vaccinations`,
            color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
        },
        {
            id: 'discharge-notes',
            title: 'Discharge Notes',
            description: 'Newborn discharge instruction slip with vaccine records',
            icon: '📋',
            path: `/${birthcare_Id}/newborn-records/discharge-notes`,
            color: 'bg-purple-50 border-purple-200 hover:border-purple-300'
        },
        {
            id: 'apgar-score',
            title: 'APGAR Score',
            description: 'Newborn assessment scoring system',
            icon: '📊',
            path: `/${birthcare_Id}/newborn-records/apgar-score`,
            color: 'bg-green-50 border-green-200 hover:border-green-300'
        },
        {
            id: 'birth-details',
            title: 'Birth Details',
            description: 'Complete birth information and medical details',
            icon: '👶',
            path: `/${birthcare_Id}/newborn-records/birth-details`,
            color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Newborn Records
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Comprehensive newborn medical documentation and tracking system.
                        Select a record type below to get started.
                    </p>
                </div>

                {/* Navigation Back */}
                <div className="mb-8">
                    <Link
                        href={`/${birthcare_Id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Record Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {records.map((record) => (
                        <Link
                            key={record.id}
                            href={record.path}
                            className={`block border-2 rounded-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${record.color}`}
                        >
                            <div className="text-center">
                                <div className="text-6xl mb-4">{record.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {record.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {record.description}
                                </p>
                            </div>
                            <div className="mt-6 text-center">
                                <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
                                    Open Record
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Record Management Guidelines
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                📋 Documentation Requirements
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">•</span>
                                    Complete all required fields accurately
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">•</span>
                                    Record medications within 1 hour of administration
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">•</span>
                                    Obtain proper healthcare provider signatures
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">•</span>
                                    Print copies for patient records
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                ⚖️ Compliance Notes
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Follow DOH and local health department guidelines
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Maintain patient confidentiality at all times
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Store records securely per facility protocol
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Report any adverse reactions immediately
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}