'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/filters/FilterBar';
import { FabButton } from '@/components/ui/FabButton';
import { IncidentList } from '@/components/incident/IncidentList';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useApp } from '@/providers/AppProvider';

// Dynamic import para el mapa (Leaflet necesita el DOM)
const IncidentMap = dynamic(
  () => import('@/components/map/IncidentMap').then((mod) => mod.IncidentMap),
  { ssr: false, loading: () => <MapSkeleton /> }
);

function MapSkeleton() {
  return (
    <div className="absolute inset-0 top-[7.5rem] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Cargando mapa...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { locationError, retryLocation, isOnline } = useApp();

  return (
    <div className="h-full flex flex-col">
      <Header />
      <FilterBar />
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
      <div className="hidden md:block fixed top-28 right-4 bottom-4 z-20 w-96">
        <div className="bg-white rounded-2xl shadow-xl h-full overflow-y-auto p-4">
          <IncidentList />
        </div>
      </div>

      {/* Mobile: Bottom Sheet */}
      <div className="block md:hidden">
        <BottomSheet defaultHeight={40}>
          <IncidentList />
        </BottomSheet>
      </div>

      {/* FAB para reportar */}
      <FabButton />
    </div>
  );
}
