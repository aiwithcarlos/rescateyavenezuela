'use client';

import Link from 'next/link';
import { INCIDENT_TYPE_LABELS, INCIDENT_TYPE_BG_LIGHT } from '@/lib/constants';
import {
    formatDistance,
    haversineDistance,
    formatRelativeTime,
} from '@/lib/utils';
import type { Incident, LatLng } from '@/types';

interface IncidentCardProps {
    incident: Incident;
    userLocation: LatLng | null;
    compact?: boolean;
}

export function IncidentCard({
    incident,
    userLocation,
    compact = false,
}: IncidentCardProps) {
    const distance = userLocation
        ? haversineDistance(
              userLocation.latitude,
              userLocation.longitude,
              incident.latitude,
              incident.longitude,
          )
        : null;

    const isActive =
        incident.status === 'reportado' ||
        incident.status === 'ayuda_en_camino';
    const maxDisplay =
        incident.max_volunteers >= 999 ? '∞' : incident.max_volunteers;
    const totalActive = incident.volunteer_count + incident.arrived_count;
    const totalPct = incident.max_volunteers >= 999
        ? Math.min(100, (totalActive / 50) * 100)
        : Math.min(100, (totalActive / incident.max_volunteers) * 100);

    // Color de la barra de progreso (basado en total)
    const progressColor =
        totalPct >= 100 ? 'bg-red-500' : totalPct > 70 ? 'bg-yellow-500' : 'bg-green-500';

    // Color del badge contador (basado en total)
    const halfNeeded = incident.max_volunteers / 2;
    const counterBg =
        totalActive >= halfNeeded
            ? 'bg-green-500 text-white'
            : totalActive >= 1
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white';

    // ¿Ya hay suficientes?
    const isFull = totalActive >= incident.max_volunteers;

    if (compact) {
        return (
            <div className="block bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
                <div className="flex items-start gap-3">
                    <div
                        className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                            INCIDENT_TYPE_BG_LIGHT[incident.incident_type]
                        }`}
                    >
                        {incident.incident_type === 'personas_atrapadas'
                            ? '🆘'
                            : incident.incident_type ===
                                'necesitan_herramientas'
                              ? '🪣'
                              : incident.incident_type ===
                                  'necesitan_maquinaria'
                                ? '🏗️'
                                : '🦽'}
                    </div>

                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-700">
                            {INCIDENT_TYPE_LABELS[incident.incident_type]}
                        </span>
                        <p className="text-sm text-gray-800 line-clamp-2 mt-0.5">
                            {incident.description || 'Sin descripción'}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                            {distance != null && (
                                <span>📍 {formatDistance(distance)}</span>
                            )}
                            <span>
                                🕐 {formatRelativeTime(incident.created_at)}
                            </span>
                        </div>

                        {/* Voluntarios: label + badge + barras */}
                        <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-600">
                                    N° voluntarios:
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${counterBg}`}
                                >
                                    {totalActive}/{maxDisplay}
                                </span>
                                {isFull && (
                                    <span className="text-[10px] font-semibold text-green-600">✓ Suficiente</span>
                                )}
                            </div>
                            {/* Barras separadas */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500 w-16 shrink-0">En camino:</span>
                                <span className="text-[10px] font-bold text-gray-700 w-4">{incident.volunteer_count}</span>
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${incident.volunteer_count > 0 ? 'bg-yellow-500' : ''}`}
                                        style={{ width: `${incident.max_volunteers >= 999 ? 0 : Math.min(100, (incident.volunteer_count / incident.max_volunteers) * 100)}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500 w-16 shrink-0">En el lugar:</span>
                                <span className="text-[10px] font-bold text-gray-700 w-4">{incident.arrived_count}</span>
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${incident.arrived_count > 0 ? 'bg-green-500' : ''}`}
                                        style={{ width: `${incident.max_volunteers >= 999 ? 0 : Math.min(100, (incident.arrived_count / incident.max_volunteers) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Botón Ver incidente */}
                        <Link
                            href={`/incident/${incident.id}`}
                            className="inline-flex items-center gap-1.5 mt-2 bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-red-700 active:scale-95 transition-all"
                        >
                            Ver incidente
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
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
                    <span>
                        Voluntarios: {incident.volunteer_count}/
                        {incident.max_volunteers}
                    </span>
                    <span>
                        {incident.volunteer_count >= incident.max_volunteers
                            ? 'Suficiente ayuda'
                            : `${incident.max_volunteers - incident.volunteer_count} espacios`}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${progressColor}`}
                        style={{ width: `${totalPct}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                    {distance != null ? `📍 ${formatDistance(distance)}` : ''}
                </span>
                <span>🕐 {formatRelativeTime(incident.created_at)}</span>
            </div>
        </Link>
    );
}
