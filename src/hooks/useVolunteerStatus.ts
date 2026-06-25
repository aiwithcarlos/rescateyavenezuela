'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface UseVolunteerStatusReturn {
  volunteerId: string | null;
  status: string | null;
  loading: boolean;
}

export function useVolunteerStatus(
  incidentId: string,
  deviceId: string
): UseVolunteerStatusReturn {
  const [volunteerId, setVolunteerId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId || !deviceId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function checkStatus() {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('id, status')
        .eq('incident_id', incidentId)
        .eq('device_id', deviceId)
        .maybeSingle();

      if (!cancelled) {
        if (!error && data) {
          setVolunteerId(data.id);
          setStatus(data.status);
        } else {
          setVolunteerId(null);
          setStatus(null);
        }
        setLoading(false);
      }
    }

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [incidentId, deviceId]);

  return { volunteerId, status, loading };
}
