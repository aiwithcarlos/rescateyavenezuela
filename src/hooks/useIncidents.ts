'use client';

import useSWR from 'swr';
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Incident, LatLng } from '@/types';
import { buildIncidentQuery } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseIncidentsReturn {
  incidents: Incident[];
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

export function useIncidents(
  userLocation: LatLng | null,
  radius: number = 50,
  types: string[] = []
): UseIncidentsReturn {
  const queryString = buildIncidentQuery(
    userLocation?.latitude,
    userLocation?.longitude,
    radius,
    types.length > 0 && types.length < 4 ? types : undefined
  );

  const { data, error, isLoading, mutate } = useSWR(
    `/api/incidents${queryString}`,
    fetcher,
    {
      refreshInterval: 30000, // Polling fallback cada 30s
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      fallbackData: { incidents: [], total: 0 },
    }
  );

  // Suscribirse a cambios en tiempo real de Supabase
  useEffect(() => {
    const channel = supabase
      .channel('incidents-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => {
          mutate();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Conectado a canal de incidentes');
        }
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] Canal cerrado. Reconectando...');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  return {
    incidents: data?.incidents || [],
    isLoading,
    error: error || null,
    mutate,
  };
}
