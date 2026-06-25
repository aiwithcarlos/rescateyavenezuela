import type { IncidentType, IncidentStatus, VolunteerStatus, AbilityType } from '@/types';

// ============================================
// Etiquetas en español
// ============================================
export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  trapped: 'Personas atrapadas',
  need_tools: 'Necesitan brazos y herramientas',
  need_machinery: 'Se necesita maquinaria',
  elderly_disabled: 'Personas mayores o con movilidad reducida',
};

export const INCIDENT_TYPE_SHORT: Record<IncidentType, string> = {
  trapped: 'Atrapados',
  need_tools: 'Herramientas',
  need_machinery: 'Maquinaria',
  elderly_disabled: 'Movilidad reducida',
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  reported: 'Reportado',
  help_on_way: 'Ayuda en camino',
  resolved: 'Resuelto',
  escalated: 'Derivado a Protección Civil',
};

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  going: 'En camino',
  arrived: 'Llegó al lugar',
  cancelled: 'Cancelado',
};

export const ABILITY_LABELS: Record<AbilityType, string> = {
  arms: 'Solo brazos',
  shovel: 'Tengo pala / herramientas',
  vehicle: 'Tengo vehículo',
  machinery: 'Tengo maquinaria',
};

// ============================================
// Colores por tipo de incidente (Tailwind)
// ============================================
export const INCIDENT_TYPE_COLORS: Record<IncidentType, string> = {
  trapped: '#DC2626',          // red-600
  need_tools: '#EA580C',       // orange-600
  need_machinery: '#1F2937',   // gray-800
  elderly_disabled: '#2563EB', // blue-600
};

export const INCIDENT_TYPE_BG: Record<IncidentType, string> = {
  trapped: 'bg-red-600',
  need_tools: 'bg-orange-600',
  need_machinery: 'bg-gray-800',
  elderly_disabled: 'bg-blue-600',
};

export const INCIDENT_TYPE_BG_LIGHT: Record<IncidentType, string> = {
  trapped: 'bg-red-50 text-red-700 border-red-200',
  need_tools: 'bg-orange-50 text-orange-700 border-orange-200',
  need_machinery: 'bg-gray-100 text-gray-700 border-gray-200',
  elderly_disabled: 'bg-blue-50 text-blue-700 border-blue-200',
};

export const ABILITY_COLORS: Record<AbilityType, string> = {
  arms: '#7C3AED',      // purple-600
  shovel: '#EA580C',    // orange-600
  vehicle: '#059669',   // emerald-600
  machinery: '#1F2937', // gray-800
};

// ============================================
// Configuración
// ============================================
export const MAX_VOLUNTEERS_DEFAULT = 20;
export const DEFAULT_RADIUS_KM = 50;
export const INCIDENT_EXPIRY_HOURS = 72; // ventana de supervivencia

// Distancias disponibles para el filtro
export const DISTANCE_OPTIONS = [
  { value: 1, label: '1 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 50, label: '50 km' },
  { value: 9999, label: 'Todos' },
];

// ============================================
// Descripciones para el formulario de reporte
// ============================================
export const INCIDENT_TYPE_DESCRIPTIONS: Record<IncidentType, string> = {
  trapped: 'Hay personas atrapadas bajo escombros o en estructuras colapsadas que necesitan ser rescatadas.',
  need_tools: 'Se necesitan voluntarios con palas, picos, guantes, carretillas u otras herramientas manuales para remover escombros.',
  need_machinery: 'Se requiere maquinaria pesada: retroexcavadora, grúa, gato hidráulico, equipo de corte. Los voluntarios sin maquinaria no deben acudir.',
  elderly_disabled: 'Personas mayores, en silla de ruedas o con movilidad reducida que necesitan ayuda para evacuar un edificio dañado.',
};

// ============================================
// Iconos para los tipos (emojis como fallback simple)
// ============================================
export const INCIDENT_TYPE_ICONS: Record<IncidentType, string> = {
  trapped: '🆘',
  need_tools: '🪣',
  need_machinery: '🏗️',
  elderly_disabled: '🦽',
};

export const ABILITY_ICONS: Record<AbilityType, string> = {
  arms: '💪',
  shovel: '🪣',
  vehicle: '🚗',
  machinery: '🏗️',
};
