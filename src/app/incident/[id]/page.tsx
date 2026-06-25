'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/providers/AppProvider';
import { VolunteerButton } from '@/components/volunteer/VolunteerButton';
import { VolunteerCounter } from '@/components/volunteer/VolunteerCounter';
import { VolunteerList } from '@/components/volunteer/VolunteerList';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import {
  INCIDENT_TYPE_LABELS,
  INCIDENT_TYPE_BG,
  INCIDENT_STATUS_LABELS,
  INCIDENT_TYPE_ICONS,
} from '@/lib/constants';
import { formatRelativeTime, formatDistance, haversineDistance } from '@/lib/utils';
import type { Incident, Volunteer } from '@/types';

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { userLocation } = useApp();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIncident() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/incidents/${id}`);
        if (!res.ok) throw new Error('Incidente no encontrado');
        const data = await res.json();
        setIncident(data.incident);
        setVolunteers(data.volunteers || []);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el incidente');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchIncident();
  }, [id]);

  // Suscribirse a cambios en tiempo real para este incidente
  useEffect(() => {
    if (!id) return;

    // Polling cada 15s para mantener datos frescos (fallback simple)
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/incidents/${id}`);
        if (res.ok) {
          const data = await res.json();
          setIncident(data.incident);
          setVolunteers(data.volunteers || []);
        }
      } catch {
        // Silencioso — los datos viejos son mejores que nada
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <DetailHeader />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="h-full flex flex-col">
        <DetailHeader />
        <ErrorBanner
          message={error || 'Incidente no encontrado'}
          onRetry={() => window.location.reload()}
        />
        <div className="flex-1 flex items-center justify-center">
          <Link href="/" className="text-red-600 font-semibold hover:underline">
            ← Volver al mapa
          </Link>
        </div>
      </div>
    );
  }

  const distance = userLocation
    ? haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        incident.latitude,
        incident.longitude
      )
    : null;

  const isActive = incident.status === 'reportado' || incident.status === 'ayuda_en_camino';

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <DetailHeader />

      <div className="flex-1 overflow-y-auto">
        {/* Foto */}
        {incident.photo_url ? (
          <div className="w-full h-64 bg-gray-200">
            <img
              src={incident.photo_url}
              alt="Foto del incidente"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
            <p className="text-sm text-gray-400">Sin foto del incidente</p>
          </div>
        )}

        <div className="px-4 py-4 space-y-4">
          {/* Tipo y estado */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white ${
                INCIDENT_TYPE_BG[incident.incident_type]
              }`}
            >
              {INCIDENT_TYPE_ICONS[incident.incident_type]}
              {INCIDENT_TYPE_LABELS[incident.incident_type]}
            </span>
            <span className="text-xs text-gray-500">
              {INCIDENT_STATUS_LABELS[incident.status]}
            </span>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Descripción</h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              {incident.description || 'Sin descripción'}
            </p>
          </div>

          {/* Datos de quien reporta */}
          {(incident.reporter_name || incident.reporter_phone) && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">📞 Contacto</h2>
              <div className="space-y-2 text-sm">
                {incident.reporter_name && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>👤</span>
                    <span>{incident.reporter_name}</span>
                  </div>
                )}
                {incident.reporter_phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>📱</span>
                    <a href={`tel:${incident.reporter_phone}`} className="text-red-600 hover:underline">
                      {incident.reporter_phone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Información</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>
                  {incident.latitude.toFixed(5)}, {incident.longitude.toFixed(5)}
                  {distance != null && (
                    <span className="text-gray-400 ml-1">({formatDistance(distance)})</span>
                  )}
                </span>
              </div>
              {incident.address && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span>🏠</span>
                  <span>{incident.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <span>🕐</span>
                <span>Reportado {formatRelativeTime(incident.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Contador de voluntarios */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
              Voluntarios
            </h2>
            <VolunteerCounter
              current={incident.volunteer_count}
              max={incident.max_volunteers}
              size="lg"
            />
            <div className="mt-3">
              <VolunteerList volunteers={volunteers} />
            </div>
          </div>

          {/* Acciones */}
          {isActive && (
            <div className="space-y-3">
              <VolunteerButton incident={incident} size="lg" />
            </div>
          )}

          {/* Regresar al mapa */}
          <Link
            href="/"
            className="w-full py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar al mapa
          </Link>

          {/* Espacio inferior */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

function DetailHeader() {
  return (
    <header className="flex items-center px-4 h-14 border-b border-gray-200 bg-white safe-area-top shrink-0">
      <Link href="/" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Mapa
      </Link>
      <h1 className="flex-1 text-center text-sm font-bold text-gray-900">Detalle</h1>
      <div className="w-16" />
    </header>
  );
}
