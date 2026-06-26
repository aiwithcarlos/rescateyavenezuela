'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/filters/FilterBar';
import { FabButton } from '@/components/ui/FabButton';
import { IncidentList } from '@/components/incident/IncidentList';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useApp } from '@/providers/AppProvider';
import { useIncidents } from '@/hooks/useIncidents';

// Dynamic import para el mapa (Leaflet necesita el DOM)
const IncidentMap = dynamic(
  () => import('@/components/map/IncidentMap').then((mod) => mod.IncidentMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="absolute inset-0 top-[13.5rem] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Cargando mapa...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { userLocation, filters, locationError, retryLocation, isOnline } = useApp();
  const { incidents, isLoading } = useIncidents(userLocation, filters.maxDistance, filters.types);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <FilterBar />

      {/* Banner de descripción */}
      <div className="fixed top-[7.7rem] left-0 right-0 z-30 px-3">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 shadow-sm max-w-2xl mx-auto">
          <p className="text-sm text-gray-800 leading-relaxed">
            <strong>RescateYA Venezuela</strong> es una aplicación web para coordinar rescates y
            ayuda humanitaria tras el terremoto del 24 de junio de 2026 en Venezuela. Cuentas con
            un mapa de incidentes activos para coordinar ayuda usando GeoLocalización.
          </p>
          <p className="text-sm text-gray-800 leading-relaxed mt-1.5">
            Si necesitas asistencia,{' '}
            <Link
              href="/report"
              className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full hover:bg-red-700 align-middle"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Reportar
            </Link>
            . Si puedes ayudar, elige un incidente cercano y{' '}
            <strong>regístrate como voluntario</strong>.
          </p>
        </div>
      </div>

      <IncidentMap />

      {/* Offline banner */}
      {!isOnline && (
        <div className="fixed top-28 left-4 right-4 z-50">
          <ErrorBanner
            message="Sin conexión. Mostrando últimos datos disponibles."
            onRetry={() => window.location.reload()}
          />
        </div>
      )}

      {/* Geolocation error banner */}
      {locationError && (
        <div className="fixed top-28 left-4 right-4 z-50">
          <ErrorBanner message={locationError} onRetry={retryLocation} />
        </div>
      )}

      {/* Desktop: panel lateral derecho con lista */}
      <div className="hidden md:block fixed top-[13.5rem] right-4 bottom-4 z-20 w-96">
        <div className="bg-white rounded-2xl shadow-xl h-full overflow-y-auto p-4">
          <IncidentList incidents={incidents} isLoading={isLoading} userLocation={userLocation} />
        </div>
      </div>

      {/* Mobile: Bottom Sheet */}
      <div className="block md:hidden">
        <BottomSheet defaultHeight={40}>
          <IncidentList incidents={incidents} isLoading={isLoading} userLocation={userLocation} />
        </BottomSheet>
      </div>

      {/* FAB para reportar */}
      <FabButton />
    </div>
  );
}
