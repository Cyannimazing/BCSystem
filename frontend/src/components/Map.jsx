"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon issues
// This solves the problem of marker icons not displaying
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

// Map event handler component
export const MapEventHandler = ({ onClick, onMoveEnd, onZoomEnd, onViewportChange }) => {
  const map = useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
    moveend() {
      if (onMoveEnd) {
        const center = map.getCenter();
        onMoveEnd([center.lat, center.lng]);
      }
    },
    zoomend() {
      if (onZoomEnd) {
        onZoomEnd(map.getZoom());
      }
    },
    dragend() {
      if (onViewportChange) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        const bounds = map.getBounds();
        onViewportChange({
          center: [center.lat, center.lng],
          zoom,
          bounds: {
            southWest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
            northEast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          }
        });
      }
    }
  });
  
  return null;
};

// Position marker with enhanced map centering and animation
export const LocationMarkerWithFly = ({ position, zoom = 13, animate = true }) => {
  const map = useMap();
  const [prevPosition, setPrevPosition] = useState(position);
  
  useEffect(() => {
    if (position && map) {
      try {
        if (animate) {
          const flyOptions = {
            duration: 1.5, // Animation duration in seconds
            easeLinearity: 0.25,
            noMoveStart: true
          };
          
          // Only animate if position has changed significantly
          if (!prevPosition || 
              Math.abs(position[0] - prevPosition[0]) > 0.0001 || 
              Math.abs(position[1] - prevPosition[1]) > 0.0001) {
            map.flyTo(position, zoom, flyOptions);
          }
        } else {
          // No animation, just set view
          map.setView(position, zoom);
        }
        
        setPrevPosition(position);
      } catch (error) {
        console.error('Error when centering map:', error);
        // Fallback in case animation fails
        map.setView(position, zoom);
      }
    }
    
    // Cleanup function to cancel any ongoing animations when component unmounts
    return () => {
      if (map && map._flyToFrame) {
        L.Util.cancelAnimFrame(map._flyToFrame);
      }
    };
  }, [position, map, zoom, animate, prevPosition]);

  // Custom icon setup with bouncing animation
  const customIcon = position ? new L.Icon.Default({
    className: 'leaflet-marker-bounce', // Can be styled with CSS for bounce animation
  }) : null;

  return position ? <Marker position={position} icon={customIcon} /> : null;
};

// Main map component with enhanced event handling
const Map = ({ 
  position, 
  onPositionChange, 
  onMoveEnd, 
  onZoomEnd, 
  onViewportChange,
  defaultCenter = [14.5995, 120.9842], 
  zoom = 13,
  animateMarker = true
}) => {
  const [mapReady, setMapReady] = useState(false);
  
  // Track viewport data
  const [viewport, setViewport] = useState({
    center: position || defaultCenter,
    zoom: zoom
  });

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(prev => ({
      ...prev,
      ...newViewport
    }));
    
    if (onViewportChange) {
      onViewportChange(newViewport);
    }
  }, [onViewportChange]);

  useEffect(() => {
    // Log confirmation of map initialization
    console.log('Map component initialized with Leaflet icon configuration');
    setMapReady(true);
    
    return () => {
      // Cleanup when component unmounts
      setMapReady(false);
    };
  }, []);

  return (
    <MapContainer
      center={position || defaultCenter}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      whenReady={() => setMapReady(true)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler 
        onClick={onPositionChange}
        onMoveEnd={onMoveEnd}
        onZoomEnd={onZoomEnd}
        onViewportChange={handleViewportChange}
      />
      {mapReady && (
        <LocationMarkerWithFly 
          position={position} 
          zoom={zoom}
          animate={animateMarker} 
        />
      )}
    </MapContainer>
  );
};

export default Map;

