'use client';

import { useEffect, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng } from '@/types';

interface UserLocationMarkerProps {
  position: LatLng;
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  const map = useMap();

  const icon = useMemo(
    () =>
      L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="position: relative;">
            <div style="
              width: 18px; height: 18px;
              background: #3B82F6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
            "></div>
            <div style="
              position: absolute; top: -2px; left: -2px;
              width: 22px; height: 22px;
              border-radius: 50%;
              background: rgba(59, 130, 246, 0.15);
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      }),
    []
  );

  return <Marker position={[position.latitude, position.longitude]} icon={icon} />;
}
