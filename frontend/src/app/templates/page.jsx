'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Templates() {
    const [activeCard, setActiveCard] = useState(null)

    const templates = [
        {
            id: 'medications-vaccinations',
            title: 'Medications & Vaccinations',
            description: 'Track medications and vaccinations administered to newborns and infants',
            features: [
                'Vitamin K administration tracking',
                'BCG (TB Prevention) vaccination records',
                'Hepatitis B vaccination tracking',
                'Comprehensive vaccine schedule',
                'Adverse reactions monitoring',
                'Healthcare provider certification'
            ],
            icon: '💉',
            path: '/templates/medications-vaccinations',
            color: 'bg-blue-50 border-blue-200 hover:border-blue-300'
        },
        {
            id: 'certificate-live-birth',
            title: 'Certificate of Live Birth',
            description: 'Official document for birth registration and legal documentation',
            features: [
                'Complete child information',
                'Parent details and marriage status',
                'Birth circumstances and medical data',
                'Medical attendant certification',
                'Official registration numbers',
                'Legal signature requirements'
            ],
            icon: '📋',
            path: '/templates/certificate-live-birth',
            color: 'bg-green-50 border-green-200 hover:border-green-300'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Medical Templates
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Professional templates for birth registration, medical documentation, 
                        and vaccination tracking. Choose a template below to get started.
                    </p>
                </div>

                {/* Template Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`border-2 rounded-xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${template.color}`}
                            onMouseEnter={() => setActiveCard(template.id)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">{template.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {template.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {template.description}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-900 mb-4">Key Features:</h3>
                                <ul className="space-y-2">
                                    {template.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <span className="text-green-500 mr-3">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href={template.path}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
                                >
                                    Open Template
                                </Link>
                                <a
                                    href={`/templates/${template.id.replace('-', '_')}.html`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
                                >
                                    View Raw Template
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Template Usage Guidelines
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                📋 How to Use Templates
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">1.</span>
                                    Click "Open Template" to access the interactive form
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">2.</span>
                                    Fill in all required fields with accurate information
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">3.</span>
                                    Print the completed template on quality paper
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-500 mr-3 mt-1">4.</span>
                                    Obtain required signatures and official seals
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                ⚖️ Legal Requirements
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    All information must be accurate and verifiable
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Signatures must be witnessed and authenticated
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Submit within required timeframes per local law
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-3 mt-1">•</span>
                                    Keep copies for personal and medical records
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation Back */}
                <div className="text-center mt-12">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}