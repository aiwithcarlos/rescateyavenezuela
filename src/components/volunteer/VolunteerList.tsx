'use client';

import { VOLUNTEER_STATUS_LABELS, ABILITY_LABELS } from '@/lib/constants';
import { formatRelativeTime } from '@/lib/utils';
import type { Volunteer } from '@/types';

interface VolunteerListProps {
  volunteers: Volunteer[];
}

export function VolunteerList({ volunteers }: VolunteerListProps) {
  if (volunteers.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-3xl mb-2">🤝</p>
        <p className="text-sm text-gray-500">Nadie se ha registrado aún.</p>
        <p className="text-xs text-gray-400 mt-1">Sé el primero en ayudar.</p>
      </div>
    );
  }

  const active = volunteers.filter((v) => v.status === 'going');
  const arrived = volunteers.filter((v) => v.status === 'arrived');

  return (
    <div className="space-y-4">
      {/* En camino */}
      {active.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            🚶 En camino ({active.length})
          </h4>
          <div className="space-y-2">
            {active.map((v) => (
              <VolunteerRow key={v.id} volunteer={v} />
            ))}
          </div>
        </div>
      )}

      {/* Llegaron */}
      {arrived.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            ✅ En el lugar ({arrived.length})
          </h4>
          <div className="space-y-2">
            {arrived.map((v) => (
              <VolunteerRow key={v.id} volunteer={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function VolunteerRow({ volunteer }: { volunteer: Volunteer }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
        {(volunteer.display_name || 'V')[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">
          {volunteer.display_name || 'Voluntario anónimo'}
        </p>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {volunteer.abilities.map((a) => (
            <span
              key={a}
              className="inline-block px-1.5 py-0.5 bg-white rounded text-[10px] text-gray-500 border border-gray-200"
            >
              {ABILITY_LABELS[a]}
            </span>
          ))}
        </div>
      </div>
      <span className="text-[10px] text-gray-400 shrink-0">
        {formatRelativeTime(volunteer.created_at)}
      </span>
    </div>
  );
}
