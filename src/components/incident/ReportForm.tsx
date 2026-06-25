'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/providers/AppProvider';
import { PhotoUploader } from '@/components/ui/PhotoUploader';
import {
  INCIDENT_TYPE_LABELS,
  INCIDENT_TYPE_DESCRIPTIONS,
  INCIDENT_TYPE_BG,
  INCIDENT_TYPE_ICONS,
} from '@/lib/constants';
import type { IncidentType, LatLng } from '@/types';

type FormStep = 'location' | 'type' | 'details';

export function ReportForm() {
  const router = useRouter();
  const { deviceId, userLocation } = useApp();

  const [step, setStep] = useState<FormStep>('type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [location, setLocation] = useState<LatLng | null>(userLocation);
  const [error, setError] = useState<string | null>(null);

  // Usar la ubicación del GPS por defecto, o Caracas
  const defaultLat = userLocation?.latitude || 10.5;
  const defaultLng = userLocation?.longitude || -66.85;

  const handleSubmit = useCallback(async () => {
    if (!incidentType || !deviceId) return;

    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Subir foto si hay
      let photoUrl: string | null = null;
      if (photo) {
        const formData = new FormData();
        formData.append('file', photo);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          photoUrl = data.url;
        }
      }

      // 2. Crear incidente
      const payload = {
        device_id: deviceId,
        incident_type: incidentType,
        description,
        latitude: location?.latitude || defaultLat,
        longitude: location?.longitude || defaultLng,
        photo_url: photoUrl,
      };

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al crear el incidente');
      }

      // 3. Redirigir al home
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error al enviar el reporte');
      setIsSubmitting(false);
    }
  }, [incidentType, deviceId, description, photo, location, defaultLat, defaultLng, router]);

  const isValid =
    incidentType && description.trim().length >= 10;

  const types: IncidentType[] = ['trapped', 'need_tools', 'need_machinery', 'elderly_disabled'];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Step indicator */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100">
        {(['type', 'details'] as FormStep[]).map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                step === s || (isSubmitting && s === 'details')
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            {i < 2 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-2">
          {isSubmitting ? 'Enviando...' : step === 'type' ? 'Selecciona el tipo' : 'Describe la situación'}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step: Type */}
      {step === 'type' && (
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-1">¿Qué tipo de ayuda se necesita?</h2>
          <p className="text-sm text-gray-500 mb-4">Selecciona la opción que mejor describa la situación</p>

          <div className="space-y-3">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setIncidentType(type);
                  setStep('details');
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                  incidentType === type
                    ? `${INCIDENT_TYPE_BG[type]} text-white border-transparent shadow-lg`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{INCIDENT_TYPE_ICONS[type]}</span>
                  <div>
                    <h3 className={`font-bold ${incidentType === type ? 'text-white' : 'text-gray-900'}`}>
                      {INCIDENT_TYPE_LABELS[type]}
                    </h3>
                    <p className={`text-sm mt-0.5 ${incidentType === type ? 'text-white/80' : 'text-gray-500'}`}>
                      {INCIDENT_TYPE_DESCRIPTIONS[type]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Details */}
      {step === 'details' && incidentType && (
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <button
            onClick={() => setStep('type')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Volver
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{INCIDENT_TYPE_ICONS[incidentType]}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${INCIDENT_TYPE_BG[incidentType]}`}>
              {INCIDENT_TYPE_LABELS[incidentType]}
            </span>
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Describe la situación *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Familia de 4 personas atrapada en el 2do piso de un edificio derrumbado. Se escuchan voces. Calle Los Mangos, Los Palos Grandes."
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1">
              {description.length} caracteres {description.length < 10 ? '(mínimo 10)' : ''}
            </p>
          </div>

          {/* Foto (opcional) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Foto (opcional)
            </label>
            <PhotoUploader onPhotoChange={setPhoto} />
          </div>

          {/* Coordenadas (informativas) */}
          <div className="mb-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">📍 Ubicación</p>
            <p>
              {userLocation
                ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`
                : 'Caracas, Venezuela (por defecto)'}
            </p>
            <p className="mt-1 text-gray-400">
              Se usará tu ubicación GPS actual. Asegúrate de estar cerca del incidente.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-red-700 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando reporte...
              </span>
            ) : (
              'Reportar incidente'
            )}
          </button>

          {!isValid && description.length > 0 && description.length < 10 && (
            <p className="text-xs text-red-500 text-center mt-2">
              La descripción debe tener al menos 10 caracteres
            </p>
          )}
        </div>
      )}

      {/* Submitting overlay */}
      {isSubmitting && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">Enviando reporte...</p>
            <p className="text-sm text-gray-500 mt-1">Esto tomará unos segundos</p>
          </div>
        </div>
      )}
    </div>
  );
}
