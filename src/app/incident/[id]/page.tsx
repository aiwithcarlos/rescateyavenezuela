'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useApp } from '@/providers/AppProvider';
import { VolunteerButton } from '@/components/volunteer/VolunteerButton';

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
import { Footer } from '@/components/layout/Footer';

export default function IncidentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { userLocation } = useApp();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = useCallback(async () => {
    try {
      // cache: 'no-store' evita que el navegador devuelva datos cacheados
      // al hacer clic en "Llegué al lugar" o "Confirmar"
      const res = await fetch(`/api/incidents/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setIncident(data.incident);
        setVolunteers(data.volunteers || []);
      }
    } catch {
      // Silencioso — los datos viejos son mejores que nada
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchIncident().finally(() => setLoading(false));
  }, [id, fetchIncident]);

  // Polling ligero cada 5s para mantener datos frescos
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(fetchIncident, 5000);
    return () => clearInterval(interval);
  }, [id, fetchIncident]);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="h-full flex flex-col">
        <Header />
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
      <Header />

      <h1 className="text-2xl font-extrabold text-gray-900 px-4 pt-5 pb-2 mt-14">
        Detalle del incidente
      </h1>

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

          {/* Tags de insumos médicos */}
          {incident.incident_type === 'insumos_medicos_y_alimentos' &&
            incident.description?.startsWith('Insumos solicitados:') && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                  🏥 Insumos solicitados
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {incident.description
                    .replace('Insumos solicitados: ', '')
                    .split('.')[0] // El primer "." separa los tags del resto de la descripción
                    .split(', ')
                    .filter(Boolean)
                    .map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            )}

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
            <div className="space-y-3">
              {/* En camino */}
              <div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>
                    🚶 {incident.volunteer_count} persona{incident.volunteer_count !== 1 ? 's' : ''} en camino
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-yellow-500"
                    style={{ width: `${Math.min(100, (incident.volunteer_count / incident.max_volunteers) * 100)}%` }}
                  />
                </div>
              </div>
              {/* En el lugar */}
              <div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>
                    ✅ {incident.arrived_count} persona{incident.arrived_count !== 1 ? 's' : ''} en el lugar
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-green-500"
                    style={{ width: `${Math.min(100, (incident.arrived_count / incident.max_volunteers) * 100)}%` }}
                  />
                </div>
              </div>
              {/* Total */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-100">
                <span>Total: {incident.volunteer_count + incident.arrived_count} de {incident.max_volunteers >= 999 ? '∞' : incident.max_volunteers}</span>
                {incident.volunteer_count + incident.arrived_count >= incident.max_volunteers && (
                  <span className="text-green-600 font-semibold">✓ Suficiente ayuda</span>
                )}
              </div>
            </div>
            <div className="mt-3">
              <VolunteerList volunteers={volunteers} />
            </div>
          </div>

          {/* Acciones */}
          {isActive && (
            <div className="space-y-3">
              <VolunteerButton incident={incident} size="lg" onVolunteerChange={fetchIncident} />
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
        <Footer />
      </div>
    </div>
  );
}
