'use client';

import { useApp } from '@/providers/AppProvider';
import { INCIDENT_TYPE_LABELS, INCIDENT_TYPE_BG, DISTANCE_OPTIONS, ABILITY_LABELS } from '@/lib/constants';
import type { IncidentType, AbilityType } from '@/types';

export function FilterBar() {
  const { filters, toggleTypeFilter, toggleAbilityFilter, setMaxDistance } = useApp();

  const types: IncidentType[] = ['personas_atrapadas', 'necesitan_herramientas', 'necesitan_maquinaria', 'movilidad_reducida'];
  const abilities: AbilityType[] = ['brazos', 'pala_herramientas', 'vehiculo', 'maquinaria'];

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 py-1.5 space-y-1">
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
