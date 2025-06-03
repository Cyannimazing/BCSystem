"use client";
import { useState } from "react";
import axios from "axios";

// Registration Component
export default function NewBirthcareRegistration() {
  const [formData, setFormData] = useState({
    facilityName: "",
    contactEmail: "",
    contactNumber: "",
    locationAddress: "",
    lat: "",
    lng: "",
  });
  const [files, setFiles] = useState({
    licenseFile: null,
    accreditationFile: null,
    insuranceFile: null,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formPayload.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post(
        "/api/birthcare/register",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000, // 10-second timeout to prevent hanging
        }
      );
      alert("Registration submitted successfully!");
      window.location.href = "/facility-dashboard";
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      setError(`Error submitting registration: ${errorMsg}`);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        New Birthcare Facility Registration
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Facility Details */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Facility Name
            </label>
            <input
              type="text"
              value={formData.facilityName}
              onChange={(e) =>
                setFormData({ ...formData, facilityName: e.target.value })
              }
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Physical Address
            </label>
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) =>
                setFormData({ ...formData, locationAddress: e.target.value })
              }
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Location Coordinates Input */}
        <div className="space-y-4">
          <h3 className="font-medium">Facility Location Coordinates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Latitude</label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., 51.5074"
                value={formData.lat}
                onChange={(e) =>
                  setFormData({ ...formData, lat: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the latitude coordinate (decimal format)
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                placeholder="e.g., -0.1278"
                value={formData.lng}
                onChange={(e) =>
                  setFormData({ ...formData, lng: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the longitude coordinate (decimal format)
              </p>
            </div>
          </div>
        </div>

        {/* Document Upload */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Facility License
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, licenseFile: e.target.files[0] })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Accreditation Document
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, accreditationFile: e.target.files[0] })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Insurance Certificate (Optional)
            </label>
            <input
              type="file"
              onChange={(e) =>
                setFiles({ ...files, insuranceFile: e.target.files[0] })
              }
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded text-white ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}
