"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Button from "./Button";

// Dynamically import Map component with no SSR
const MapComponent = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
});

const LocationPicker = ({ value, onChange, error }) => {
  const [position, setPosition] = useState(value || null);
  
  // Default center (can be customized as needed)
  const defaultCenter = [14.5995, 120.9842]; // Manila, Philippines

  useEffect(() => {
    if (position) {
      onChange(position);
    }
  }, [position, onChange]);

  const handleSetPosition = (newPosition) => {
    setPosition(newPosition);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert(
            "Could not get your current location. Please allow location access or select manually on the map."
          );
        }
      );
    } else {
      alert(
        "Geolocation is not supported by your browser. Please select location manually on the map."
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="h-96 relative border rounded-md overflow-hidden">
        <MapComponent
          position={position}
          onPositionChange={handleSetPosition}
          onViewportChange={(viewport) => {
            console.log('Viewport changed:', viewport);
            // Optionally do something with the new viewport
          }}
          defaultCenter={defaultCenter}
          zoom={13}
          animateMarker={true}
          key={`map-${position?.[0]}-${position?.[1]}`}
        />

        <div className="absolute top-2 right-2 z-[1000]">
          <Button
            type="button"
            onClick={handleCurrentLocation}
            className="bg-blue-600 hover:bg-blue-700 text-sm"
          >
            Get Current Location
          </Button>
        </div>
      </div>

      {position && (
        <div className="text-sm text-gray-600">
          Selected location: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      <div className="text-sm text-gray-500">
        Click on the map to set your location or use the "Get Current Location"
        button.
      </div>
    </div>
  );
};

export default LocationPicker;
