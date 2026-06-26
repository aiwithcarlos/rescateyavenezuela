import type {
    IncidentType,
    IncidentStatus,
    VolunteerStatus,
    AbilityType,
} from '@/types';

// ============================================
// Etiquetas en español
// ============================================
export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
    personas_atrapadas: 'Personas atrapadas',
    necesitan_herramientas: 'Necesitan brazos y herramientas',
    necesitan_maquinaria: 'Se necesita maquinaria',
    movilidad_reducida: 'Personas mayores o con movilidad reducida',
    insumos_medicos_y_alimentos: 'Insumos médicos y alimentos',
};

export const INCIDENT_TYPE_SHORT: Record<IncidentType, string> = {
    personas_atrapadas: 'Atrapados',
    necesitan_herramientas: 'Herramientas',
    necesitan_maquinaria: 'Maquinaria',
    movilidad_reducida: 'Movilidad reducida',
    insumos_medicos_y_alimentos: 'Insumos médicos',
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
    reportado: 'Reportado',
    ayuda_en_camino: 'Ayuda en camino',
    resuelto: 'Resuelto',
    escalado: 'Derivado a Protección Civil',
};

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
    en_camino: 'En camino',
    llego_al_lugar: 'Llegó al lugar',
    cancelado: 'Cancelado',
};

export const ABILITY_LABELS: Record<AbilityType, string> = {
    brazos: 'Solo brazos',
    pala_herramientas: 'Tengo pala / herramientas',
    vehiculo: 'Tengo vehículo',
    maquinaria: 'Tengo maquinaria',
};

// ============================================
// Colores por tipo de incidente (Tailwind)
// ============================================
export const INCIDENT_TYPE_COLORS: Record<IncidentType, string> = {
    personas_atrapadas: '#DC2626', // red-600
    necesitan_herramientas: '#EA580C', // orange-600
    necesitan_maquinaria: '#1F2937', // gray-800
    movilidad_reducida: '#2563EB', // blue-600
    insumos_medicos_y_alimentos: '#059669', // emerald-600
};

export const INCIDENT_TYPE_BG: Record<IncidentType, string> = {
    personas_atrapadas: 'bg-red-600',
    necesitan_herramientas: 'bg-orange-600',
    necesitan_maquinaria: 'bg-gray-800',
    movilidad_reducida: 'bg-blue-600',
    insumos_medicos_y_alimentos: 'bg-emerald-600',
};

export const INCIDENT_TYPE_BG_LIGHT: Record<IncidentType, string> = {
    personas_atrapadas: 'bg-red-50 text-red-700 border-red-200',
    necesitan_herramientas: 'bg-orange-50 text-orange-700 border-orange-200',
    necesitan_maquinaria: 'bg-gray-100 text-gray-700 border-gray-200',
    movilidad_reducida: 'bg-blue-50 text-blue-700 border-blue-200',
    insumos_medicos_y_alimentos: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const ABILITY_COLORS: Record<AbilityType, string> = {
    brazos: '#7C3AED', // purple-600
    pala_herramientas: '#EA580C', // orange-600
    vehiculo: '#059669', // emerald-600
    maquinaria: '#1F2937', // gray-800
};

// ============================================
// Configuración
// ============================================
export const MAX_VOLUNTEERS_DEFAULT = 50;
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
    personas_atrapadas:
        'Hay personas atrapadas bajo escombros o en estructuras colapsadas que necesitan ser rescatadas.',
    necesitan_herramientas:
        'Se necesitan voluntarios con palas, picos, guantes, carretillas u otras herramientas manuales para remover escombros.',
    necesitan_maquinaria:
        'Se requiere maquinaria pesada: retroexcavadora, grúa, gato hidráulico, equipo de corte. Los voluntarios sin maquinaria no deben acudir.',
    movilidad_reducida:
        'Personas mayores, en silla de ruedas o con movilidad reducida que necesitan ayuda para evacuar un edificio dañado.',
    insumos_medicos_y_alimentos:
        'Se necesitan insumos médicos, medicinas, alimentos no perecederos y artículos de primera necesidad para los damnificados.',
};

// ============================================
// Iconos para los tipos (emojis como fallback simple)
// ============================================
export const INCIDENT_TYPE_ICONS: Record<IncidentType, string> = {
    personas_atrapadas: '🆘',
    necesitan_herramientas: '🪣',
    necesitan_maquinaria: '🏗️',
    movilidad_reducida: '🦽',
    insumos_medicos_y_alimentos: '🏥',
};

export const ABILITY_ICONS: Record<AbilityType, string> = {
    brazos: '💪',
    pala_herramientas: '🪣',
    vehiculo: '🚗',
    maquinaria: '🏗️',
};
