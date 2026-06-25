'use client';

import { useEffect, useMemo } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { INCIDENT_TYPE_COLORS, INCIDENT_TYPE_LABELS, INCIDENT_TYPE_SHORT } from '@/lib/constants';
import { haversineDistance, formatDistance } from '@/lib/utils';
import type { Incident, LatLng } from '@/types';
import Link from 'next/link';

interface IncidentMarkerProps {
  incident: Incident;
  userLocation: LatLng | null;
  onSelect?: (incident: Incident) => void;
}

export function IncidentMarker({ incident, userLocation, onSelect }: IncidentMarkerProps) {
  const color = INCIDENT_TYPE_COLORS[incident.incident_type];

  const icon = useMemo(
    () =>
      L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 28px; height: 38px;
            background: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
              font-weight: bold;
              line-height: 1;
            ">!</span>
          </div>
          ${
            incident.volunteer_count > 0
              ? `<div style="
                  position: absolute; top: -6px; right: -6px;
                  background: white; color: ${color};
                  width: 18px; height: 18px;
                  border-radius: 50%;
                  font-size: 10px; font-weight: bold;
                  display: flex; align-items: center; justify-content: center;
                  border: 2px solid ${color};
                  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                ">${incident.volunteer_count}</div>`
              : ''
          }
        `,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -38],
      }),
    [color, incident.volunteer_count]
  );

  const distance = userLocation
    ? haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        incident.latitude,
        incident.longitude
      )
    : null;

  return (
    <Marker
      position={[incident.latitude, incident.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect?.(incident),
      }}
    >
      <Popup>
        <div className="min-w-[200px] max-w-[280px]">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-2"
            style={{ backgroundColor: color }}
          >
            {INCIDENT_TYPE_SHORT[incident.incident_type]}
          </span>
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {incident.description || 'Sin descripción'}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>
              {incident.volunteer_count} de {incident.max_volunteers} personas en camino
            </span>
            {distance != null && <span>{formatDistance(distance)}</span>}
          </div>
          <Link
            href={`/incident/${incident.id}`}
            className="block text-center text-sm font-semibold text-red-600 hover:text-red-800 py-1"
          >
            Ver detalles →
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
