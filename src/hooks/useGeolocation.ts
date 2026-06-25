'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LatLng } from '@/types';

interface UseGeolocationReturn {
  location: LatLng | null;
  error: string | null;
  loading: boolean;
  retry: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              'Activa tu ubicación en la configuración del navegador para ver incidentes cercanos'
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError('No se pudo obtener tu ubicación. Verifica tu conexión.');
            break;
          case err.TIMEOUT:
            setError('Se agotó el tiempo para obtener tu ubicación. Intenta de nuevo.');
            break;
          default:
            setError('Error al obtener tu ubicación');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // 1 minuto de caché
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { location, error, loading, retry: requestLocation };
}
