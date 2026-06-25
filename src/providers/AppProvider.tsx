'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LatLng, IncidentFilters, IncidentType, AbilityType } from '@/types';
import { useDeviceId } from '@/hooks/useDeviceId';
import { useGeolocation } from '@/hooks/useGeolocation';

interface AppContextType {
  deviceId: string;
  userLocation: LatLng | null;
  locationError: string | null;
  locationLoading: boolean;
  retryLocation: () => void;
  filters: IncidentFilters;
  setFilters: (filters: IncidentFilters) => void;
  toggleTypeFilter: (type: IncidentType) => void;
  toggleAbilityFilter: (ability: AbilityType) => void;
  setMaxDistance: (km: number) => void;
  volunteerMap: Record<string, string>;
  addVolunteer: (incidentId: string, volunteerId: string) => void;
  updateVolunteerStatus: (volunteerId: string, status: string) => void;
  isOnline: boolean;
}

const defaultFilters: IncidentFilters = {
  types: [],
  abilities: [],
  maxDistance: 50,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const deviceId = useDeviceId();
  const { location, error: locError, loading: locLoading, retry } = useGeolocation();
  const [filters, setFilters] = useState<IncidentFilters>(defaultFilters);
  const [volunteerMap, setVolunteerMap] = useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTypeFilter = useCallback((type: IncidentType) => {
    setFilters((prev) => {
      const types = prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  }, []);

  const toggleAbilityFilter = useCallback((ability: AbilityType) => {
    setFilters((prev) => {
      const abilities = prev.abilities.includes(ability)
        ? prev.abilities.filter((a) => a !== ability)
        : [...prev.abilities, ability];
      return { ...prev, abilities };
    });
  }, []);

  const setMaxDistance = useCallback((km: number) => {
    setFilters((prev) => ({ ...prev, maxDistance: km }));
  }, []);

  const addVolunteer = useCallback(
    (incidentId: string, volunteerId: string) => {
      setVolunteerMap((prev) => ({ ...prev, [incidentId]: volunteerId }));
    },
    []
  );

  const updateVolunteerStatus = useCallback(
    (volunteerId: string, status: string) => {
      if (status === 'cancelled') {
        setVolunteerMap((prev) => {
          const next = { ...prev };
          Object.keys(next).forEach((key) => {
            if (next[key] === volunteerId) delete next[key];
          });
          return next;
        });
      }
    },
    []
  );

  const value: AppContextType = {
    deviceId,
    userLocation: location,
    locationError: locError,
    locationLoading: locLoading,
    retryLocation: retry,
    filters,
    setFilters,
    toggleTypeFilter,
    toggleAbilityFilter,
    setMaxDistance,
    volunteerMap,
    addVolunteer,
    updateVolunteerStatus,
    isOnline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de un <AppProvider>');
  }
  return ctx;
}
