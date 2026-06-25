'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/AppProvider';
import { useVolunteerStatus } from '@/hooks/useVolunteerStatus';
import { Modal } from '@/components/ui/Modal';
import { ABILITY_LABELS, ABILITY_ICONS } from '@/lib/constants';
import type { AbilityType, Incident } from '@/types';

interface VolunteerButtonProps {
  incident: Incident;
  size?: 'sm' | 'lg';
}

export function VolunteerButton({ incident, size = 'sm' }: VolunteerButtonProps) {
  const router = useRouter();
  const { deviceId, addVolunteer, updateVolunteerStatus } = useApp();
  const { volunteerId, status, loading } = useVolunteerStatus(incident.id, deviceId);

  const [showAbilities, setShowAbilities] = useState(false);
  const [selectedAbilities, setSelectedAbilities] = useState<AbilityType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFull = incident.volunteer_count >= incident.max_volunteers;
  const isResolved = incident.status === 'resuelto' || incident.status === 'escalado';

  const toggleAbility = (ability: AbilityType) => {
    setSelectedAbilities((prev) =>
      prev.includes(ability) ? prev.filter((a) => a !== ability) : [...prev, ability]
    );
  };

  const handleVolunteer = async () => {
    if (selectedAbilities.length === 0) {
      setError('Selecciona al menos una habilidad');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/incidents/${incident.id}/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          abilities: selectedAbilities,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al registrarse');
      }

      const { volunteer } = await res.json();
      addVolunteer(incident.id, volunteer.id);
      setShowAbilities(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'llego_al_lugar' | 'cancelado') => {
    if (!volunteerId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/volunteers/${volunteerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al actualizar estado');
      }

      if (newStatus === 'cancelado') {
        updateVolunteerStatus(volunteerId, 'cancelado');
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <button disabled className={`${sizeClasses[size]} bg-gray-200 text-gray-400`}>
        Cargando...
      </button>
    );
  }

  // Estado: incidente resuelto/escalado
  if (isResolved) {
    return (
      <button disabled className={`${sizeClasses[size]} bg-gray-200 text-gray-500`}>
        {incident.status === 'resuelto' ? '✓ Resuelto' : 'Derivado a Protección Civil'}
      </button>
    );
  }

  // Estado: usuario ya es voluntario
  if (status && volunteerId) {
    if (status === 'en_camino') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusUpdate('llego_al_lugar')}
              disabled={submitting}
              className={`${sizeClasses[size]} bg-green-600 text-white hover:bg-green-700`}
            >
              {submitting ? '...' : '✓ Llegué al lugar'}
            </button>
          </div>
          <button
            onClick={() => handleStatusUpdate('cancelado')}
            disabled={submitting}
            className="text-xs text-gray-400 hover:text-red-500 underline"
          >
            Ya no puedo ir
          </button>
        </div>
      );
    }

    if (status === 'llego_al_lugar') {
      return (
        <button disabled className={`${sizeClasses[size]} bg-green-100 text-green-700 border border-green-300`}>
          ✓ Asistencia completada
        </button>
      );
    }
  }

  // Estado: lleno
  if (isFull) {
    return (
      <button disabled className={`${sizeClasses[size]} bg-yellow-50 text-yellow-700 border border-yellow-300`}>
        Suficientes personas en camino
      </button>
    );
  }

  // Estado: disponible para voluntariar
  return (
    <>
      <button
        onClick={() => setShowAbilities(true)}
        disabled={submitting}
        className={`${sizeClasses[size]} bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-400`}
      >
        Voy para allá
      </button>

      {/* Modal de habilidades */}
      <Modal
        isOpen={showAbilities}
        onClose={() => setShowAbilities(false)}
        title="¿Con qué puedes ayudar?"
      >
        <div className="space-y-3 mb-4">
          {(Object.entries(ABILITY_LABELS) as [AbilityType, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleAbility(key)}
              className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                selectedAbilities.includes(key)
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ABILITY_ICONS[key]}</span>
                <span className="text-sm font-medium text-gray-800">{label}</span>
                {selectedAbilities.includes(key) && (
                  <span className="ml-auto text-purple-600">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        <button
          onClick={handleVolunteer}
          disabled={submitting}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 disabled:bg-gray-300 transition-all"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registrando...
            </span>
          ) : (
            'Confirmar'
          )}
        </button>
      </Modal>
    </>
  );
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:active:scale-100 w-full',
  lg: 'px-6 py-3.5 text-base font-bold rounded-xl transition-all active:scale-[0.98] disabled:active:scale-100 w-full shadow-lg',
};
