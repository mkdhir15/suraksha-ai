import { useState, useEffect } from 'react';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 12.9716, // Default urban coordinates
    longitude: 77.5946,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  }, []);

  return location;
}
