'use client';

import Link from 'next/link';
import { INCIDENT_TYPE_LABELS, INCIDENT_TYPE_BG_LIGHT } from '@/lib/constants';
import { formatDistance, haversineDistance, formatRelativeTime } from '@/lib/utils';
import type { Incident, LatLng } from '@/types';

interface IncidentCardProps {
  incident: Incident;
  userLocation: LatLng | null;
  compact?: boolean;
}

export function IncidentCard({ incident, userLocation, compact = false }: IncidentCardProps) {
  const distance = userLocation
    ? haversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        incident.latitude,
        incident.longitude
      )
    : null;

  const volunteerPct = Math.min(
    100,
    (incident.volunteer_count / incident.max_volunteers) * 100
  );

  const progressColor =
    volunteerPct >= 100 ? 'bg-red-500' : volunteerPct > 70 ? 'bg-yellow-500' : 'bg-green-500';

  const isActive = incident.status === 'reported' || incident.status === 'help_on_way';

  if (compact) {
    return (
      <Link
        href={`/incident/${incident.id}`}
        className="block bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
      >
        <div className="flex items-start gap-3">
          <div
            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
              INCIDENT_TYPE_BG_LIGHT[incident.incident_type]
            }`}
          >
            {incident.incident_type === 'trapped'
              ? '🆘'
              : incident.incident_type === 'need_tools'
              ? '🪣'
              : incident.incident_type === 'need_machinery'
              ? '🏗️'
              : '🦽'}
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-gray-500">
              {INCIDENT_TYPE_LABELS[incident.incident_type]}
            </span>
            <p className="text-sm text-gray-800 line-clamp-2 mt-0.5">
              {incident.description || 'Sin descripción'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              {distance != null && <span>📍 {formatDistance(distance)}</span>}
              <span>🕐 {formatRelativeTime(incident.created_at)}</span>
            </div>
          </div>

          {/* Volunteer counter mini */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center relative">
              <span className="text-xs font-bold text-gray-700">{incident.volunteer_count}</span>
              <svg className="absolute inset-0 w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="none"
                  stroke={progressColor}
                  strokeWidth="3"
                  strokeDasharray={`${(volunteerPct / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-[10px] text-gray-400 mt-0.5">/{incident.max_volunteers}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/incident/${incident.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            INCIDENT_TYPE_BG_LIGHT[incident.incident_type]
          }`}
        >
          {INCIDENT_TYPE_LABELS[incident.incident_type]}
        </span>
        {!isActive && (
          <span className="text-xs text-gray-400">Completado</span>
        )}
      </div>

      <p className="text-sm text-gray-800 line-clamp-3 mb-3">
        {incident.description || 'Sin descripción'}
      </p>

      {/* Barra de progreso de voluntarios */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{incident.volunteer_count} personas en camino</span>
          <span>
            {incident.volunteer_count >= incident.max_volunteers
              ? 'Suficiente ayuda'
              : `${incident.max_volunteers - incident.volunteer_count} espacios`}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${volunteerPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{distance != null ? `📍 ${formatDistance(distance)}` : ''}</span>
        <span>🕐 {formatRelativeTime(incident.created_at)}</span>
      </div>
    </Link>
  );
}
