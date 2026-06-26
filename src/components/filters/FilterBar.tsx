'use client';

import { useState } from 'react';
import { useApp } from '@/providers/AppProvider';
import {
    INCIDENT_TYPE_LABELS,
    INCIDENT_TYPE_BG,
    DISTANCE_OPTIONS,
    ABILITY_LABELS,
} from '@/lib/constants';
import type { IncidentType, AbilityType } from '@/types';
import Link from 'next/link';

export function FilterBar() {
    const { filters, toggleTypeFilter, toggleAbilityFilter, setMaxDistance } =
        useApp();
    const [showDescModal, setShowDescModal] = useState(false);

    const types: IncidentType[] = [
        'personas_atrapadas',
        'necesitan_herramientas',
        'necesitan_maquinaria',
        'movilidad_reducida',
        'insumos_medicos_y_alimentos',
    ];
    const abilities: AbilityType[] = [
        'brazos',
        'pala_herramientas',
        'vehiculo',
        'maquinaria',
        'insumos_medicos',
    ];

    const descText = (
        <span>
            <span className="inline-flex items-center gap-1">
                <span className="text-base">🇻🇪</span>
                <strong className="text-red-700">RescateYA Venezuela</strong>
            </span>{' '}
            es un servicio web para coordinar rescates y ayuda humanitaria tras
            el terremoto del 24 de Junio de 2026 en Venezuela. Conecta a personas
            afectadas con voluntarios dispuestos a ayudar, en tiempo real, usando{' '}
            <span className="inline-flex items-center gap-0.5 text-red-600 font-medium">
                📍 geolocalización
            </span>
            .
        </span>
    );

    const volunteerBtn = (
        <Link
            href="/voluntario"
            className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Quiero ser voluntario
        </Link>
    );

    return (
        <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 py-1.5 space-y-1">
            {/* Banner descripción — desktop: completo, mobile: truncado */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 border border-red-100 rounded-xl px-3 py-2">
                {/* Desktop: texto completo + botón */}
                <div className="hidden md:block">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {descText}
                    </p>
                    {volunteerBtn}
                </div>

                {/* Mobile: truncado con "ver más" */}
                <div className="md:hidden">
                    <p className="text-[14px] text-gray-700 leading-relaxed line-clamp-2">
                        {descText}
                    </p>
                    <button
                        onClick={() => setShowDescModal(true)}
                        className="text-xs font-semibold text-red-600 hover:underline mt-0.5"
                    >
                        Ver más...
                    </button>
                </div>
            </div>

            {/* Modal mobile: descripción completa + botón */}
            {showDescModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center md:hidden px-4" onClick={() => setShowDescModal(false)}>
                    <div
                        className="bg-white rounded-2xl px-5 py-5 w-full max-w-sm max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-base font-bold text-gray-900">RescateYA Venezuela</h3>
                            <button
                                onClick={() => setShowDescModal(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {descText}
                        </p>
                        {volunteerBtn}
                    </div>
                </div>
            )}

            {/* Fila 1: Filtrar por Necesidad */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <span className="text-[10px] font-semibold text-red-500 uppercase tracking-wide shrink-0">
                    Filtrar por Necesidad:
                </span>
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => toggleTypeFilter(type)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            filters.types.includes(type)
                                ? `${INCIDENT_TYPE_BG[type]} text-white border-transparent shadow-sm`
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {INCIDENT_TYPE_LABELS[type]}
                    </button>
                ))}

                <div className="w-px bg-gray-200 shrink-0" />

                {/* Radio */}
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide shrink-0">
                    Radio:
                </span>
                <select
                    value={filters.maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-gray-300 cursor-pointer"
                >
                    {DISTANCE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* Fila 2: Recursos Ayudando */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <span className="text-[10px] font-semibold text-purple-500 uppercase tracking-wide shrink-0">
                    Recursos Ayudando:
                </span>
                {abilities.map((ability) => (
                    <button
                        key={ability}
                        onClick={() => toggleAbilityFilter(ability)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            filters.abilities.includes(ability)
                                ? 'bg-purple-600 text-white border-transparent shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {ABILITY_LABELS[ability]}
                    </button>
                ))}
            </div>
        </div>
    );
}
