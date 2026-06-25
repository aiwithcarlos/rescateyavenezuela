'use client';

import { useApp } from '@/providers/AppProvider';
import { INCIDENT_TYPE_LABELS, INCIDENT_TYPE_BG, DISTANCE_OPTIONS, ABILITY_LABELS } from '@/lib/constants';
import type { IncidentType, AbilityType } from '@/types';

export function FilterBar() {
  const { filters, toggleTypeFilter, toggleAbilityFilter, setMaxDistance } = useApp();

  const types: IncidentType[] = ['trapped', 'need_tools', 'need_machinery', 'elderly_disabled'];
  const abilities: AbilityType[] = ['arms', 'shovel', 'vehicle', 'machinery'];

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-3 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {/* Filtro de tipo */}
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

        {/* Filtro de habilidades */}
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

        <div className="w-px bg-gray-200 shrink-0" />

        {/* Filtro de distancia */}
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
    </div>
  );
}
