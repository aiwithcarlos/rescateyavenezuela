'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '@/providers/AppProvider';
import { useIncidents } from '@/hooks/useIncidents';
import { IncidentMarker } from './IncidentMarker';
import { UserLocationMarker } from './UserLocationMarker';
import type { Incident } from '@/types';

// Componente interno para controlar el mapa programáticamente
function MapFlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1 });
    }
  }, [map, center]);

  return null;
}

// Fix para los iconos por defecto de Leaflet en Next.js
function fixLeafletIcons() {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface IncidentMapProps {
  onIncidentSelect?: (incident: Incident) => void;
}

export function IncidentMap({ onIncidentSelect }: IncidentMapProps) {
  const { userLocation, filters } = useApp();
  const { incidents, isLoading } = useIncidents(userLocation, filters.maxDistance, filters.types);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    fixLeafletIcons();
  }, []);

  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [10.5000, -66.8500]; // Caracas centro

  return (
    <div className="absolute inset-0 top-[7.5rem]">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFlyTo center={defaultCenter} />

        {/* Marcador de ubicación del usuario */}
        {userLocation && <UserLocationMarker position={userLocation} />}

        {/* Marcadores de incidentes */}
        {incidents
          .filter((inc) => inc.status === 'reported' || inc.status === 'help_on_way')
          .map((incident) => (
            <IncidentMarker
              key={incident.id}
              incident={incident}
              userLocation={userLocation}
              onSelect={onIncidentSelect}
            />
          ))}
      </MapContainer>

      {/* Indicador de carga */}
      {isLoading && !mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-gray-600">
            Cargando incidentes...
          </div>
        </div>
      )}
    </div>
  );
}
