'use client';

import { IncidentCard } from './IncidentCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Incident, LatLng } from '@/types';
import Link from 'next/link';

interface IncidentListProps {
    incidents: Incident[];
    isLoading: boolean;
    userLocation?: LatLng | null;
}

/** Componente presentacional — recibe datos vía props, no hace fetch ni suscripciones */
export function IncidentList({
    incidents,
    isLoading,
    userLocation,
}: IncidentListProps) {
    const filtered = incidents.filter(
        (inc) => inc.status === 'reportado' || inc.status === 'ayuda_en_camino',
    );

    return (
        <div className="space-y-3 mt-5 pb-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">
                    {filtered.length} incidente
                    {filtered.length !== 1 ? 's' : ''} activo
                    {filtered.length !== 1 ? 's' : ''}
                </h2>
            </div>

            {/* Botón Quiero ser voluntario */}
            <Link
                href="/voluntario"
                className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Quiero ser voluntario
            </Link>

            {isLoading && <LoadingSpinner size="md" />}

            {!isLoading && filtered.length === 0 && (
                <EmptyState
                    icon="🤝"
                    title="No hay incidentes activos cerca"
                    description="Si ves a alguien que necesita ayuda, repórtalo para que los voluntarios cercanos puedan acudir."
                    action={
                        <Link
                            href="/report"
                            className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors"
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Reportar incidente
                        </Link>
                    }
                />
            )}

            {!isLoading &&
                filtered.map((incident) => (
                    <IncidentCard
                        key={incident.id}
                        incident={incident}
                        userLocation={userLocation ?? null}
                        compact
                    />
                ))}
        </div>
    );
}
