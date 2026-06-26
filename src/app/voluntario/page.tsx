'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
    INCIDENT_TYPE_LABELS,
    INCIDENT_TYPE_BG,
    INCIDENT_TYPE_ICONS,
    INCIDENT_TYPE_BG_LIGHT,
} from '@/lib/constants';
import {
    formatDistance,
    haversineDistance,
    formatRelativeTime,
} from '@/lib/utils';
import type { Incident, IncidentType } from '@/types';

const TYPES: IncidentType[] = [
    'personas_atrapadas',
    'necesitan_herramientas',
    'necesitan_maquinaria',
    'movilidad_reducida',
    'insumos_medicos_y_alimentos',
];

const PAGE_SIZE = 10;

export default function VoluntarioPage() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedTypes, setSelectedTypes] = useState<Set<IncidentType>>(
        new Set(),
    );

    const fetchIncidents = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', PAGE_SIZE.toString());
            if (selectedTypes.size > 0) {
                params.set('type', [...selectedTypes].join(','));
            }
            const res = await fetch(`/api/incidents?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setIncidents(data.incidents || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
            }
        } catch {
            // Silencioso
        } finally {
            setLoading(false);
        }
    }, [page, selectedTypes]);

    useEffect(() => {
        fetchIncidents();
    }, [fetchIncidents]);

    const toggleType = (type: IncidentType) => {
        setSelectedTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
        setPage(1); // Reset a primera página al filtrar
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <Header />

            <h1 className="text-2xl font-extrabold text-gray-900 px-4 pt-5 mt-14">
                Quiero ser voluntario
            </h1>

            {/* Filtros de tipo */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    Filtrar por tipo de necesidad
                </p>
                <div className="flex flex-wrap gap-2">
                    {TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                                selectedTypes.has(type)
                                    ? `${INCIDENT_TYPE_BG[type]} text-white border-transparent shadow-sm`
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {INCIDENT_TYPE_ICONS[type]}{' '}
                            {INCIDENT_TYPE_LABELS[type]}
                        </button>
                    ))}
                </div>
                {selectedTypes.size > 0 && (
                    <button
                        onClick={() => setSelectedTypes(new Set())}
                        className="text-xs text-red-500 hover:underline mt-2"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* Lista de incidentes */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {loading && <LoadingSpinner size="md" />}

                {!loading && incidents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-sm text-gray-500">
                            No hay incidentes activos
                        </p>
                    </div>
                )}

                {!loading &&
                    incidents.map((incident) => (
                        <Link
                            key={incident.id}
                            href={`/incident/${incident.id}`}
                            className="block bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                                        INCIDENT_TYPE_BG_LIGHT[
                                            incident.incident_type
                                        ]
                                    }`}
                                >
                                    {
                                        INCIDENT_TYPE_ICONS[
                                            incident.incident_type
                                        ]
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-semibold text-gray-500">
                                        {
                                            INCIDENT_TYPE_LABELS[
                                                incident.incident_type
                                            ]
                                        }
                                    </span>
                                    <p className="text-sm text-gray-800 line-clamp-2 mt-0.5">
                                        {incident.description ||
                                            'Sin descripción'}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                                        <span>
                                            🕐{' '}
                                            {formatRelativeTime(
                                                incident.created_at,
                                            )}
                                        </span>
                                        <span>
                                            👥{' '}
                                            {incident.volunteer_count +
                                                incident.arrived_count}
                                            /
                                            {incident.max_volunteers >= 999
                                                ? '∞'
                                                : incident.max_volunteers}
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0 self-center">
                                    <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                                        Ver incidente
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        ← Anterior
                    </button>
                    <span className="text-xs text-gray-500">
                        Página {page} de {totalPages} ({total} incidentes)
                    </span>
                    <button
                        onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            {/* Regresar al mapa */}
            <div className="px-4 pb-6 pt-2">
                <Link
                    href="/"
                    className="w-full py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Regresar al mapa
                </Link>
            </div>
        </div>
    );
}
