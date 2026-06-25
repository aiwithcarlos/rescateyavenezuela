'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/providers/AppProvider';
import type { Incident } from '@/types';

interface EscalateButtonProps {
  incident: Incident;
}

export function EscalateButton({ incident }: EscalateButtonProps) {
  const { deviceId } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyEscalated = incident.status === 'escalated';

  const handleEscalate = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/incidents/${incident.id}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: deviceId,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al escalar');
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={alreadyEscalated}
        className={`w-full py-2.5 text-sm font-semibold rounded-xl border-2 transition-all active:scale-[0.98] ${
          alreadyEscalated
            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'border-red-300 text-red-600 hover:bg-red-50'
        }`}
      >
        {alreadyEscalated ? '✓ Derivado a Protección Civil' : '🚨 Reportar a Protección Civil'}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (done) window.location.reload();
        }}
        title={done ? '✅ Incidente escalado' : 'Escalar a Protección Civil'}
      >
        {!done ? (
          <>
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-800">
                Al escalar este incidente, se enviará toda la información disponible a{' '}
                <strong>Protección Civil</strong> para que envíen rescate profesional.
              </p>
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Solo escala si los voluntarios no pueden manejar la situación solos.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Información adicional para Protección Civil..."
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEscalate}
                disabled={submitting}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300"
              >
                {submitting ? 'Escalando...' : 'Sí, escalar'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-lg font-bold text-gray-900 mb-1">
              Incidente escalado exitosamente
            </p>
            <p className="text-sm text-gray-500 mb-4">
              La información ha sido preparada para envío a Protección Civil.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Entendido
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
