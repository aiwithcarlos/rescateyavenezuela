'use client';

import useSWR from 'swr';
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Incident, LatLng } from '@/types';
import { buildIncidentQuery } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// ── Canal de Supabase Realtime (singleton a nivel de módulo) ──────────
// Se crea una sola vez y vive durante toda la sesión de la app.
// Así React Strict Mode puede montar/desmontar componentes sin interferir.
// ──────────────────────────────────────────────────────────────────────
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
let onDataChange: (() => void) | null = null;

function ensureRealtimeChannel(): void {
  if (realtimeChannel) return;

  realtimeChannel = supabase
    .channel('incidents-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'incidents' },
      () => {
        onDataChange?.();
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
}

// ── Hook ────────────────────────────────────────────────────────────

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

  // Mantener la referencia a mutate actualizada para el callback del canal
  const mutateRef = useRef(mutate);
  mutateRef.current = mutate;

  // El canal se crea una sola vez a nivel de módulo, sin depender del
  // ciclo de vida de React. Así Strict Mode no causa colisiones.
  useEffect(() => {
    onDataChange = () => mutateRef.current();
    ensureRealtimeChannel();

    // Sin cleanup: el canal pertenece a la sesión, no al componente
    return () => {
      onDataChange = null;
    };
  }, []);

  return {
    incidents: data?.incidents || [],
    isLoading,
    error: error || null,
    mutate,
  };
}
