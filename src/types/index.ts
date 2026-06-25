// ============================================
// Tipos de incidente
// ============================================
export type IncidentType =
  | 'trapped'
  | 'need_tools'
  | 'need_machinery'
  | 'elderly_disabled';

export type IncidentStatus =
  | 'reported'
  | 'help_on_way'
  | 'resolved'
  | 'escalated';

export type VolunteerStatus = 'going' | 'arrived' | 'cancelled';

export type AbilityType = 'arms' | 'shovel' | 'vehicle' | 'machinery';

// ============================================
// Entidades principales
// ============================================
export interface Incident {
  id: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  escalated_at: string | null;
  device_id: string;
  incident_type: IncidentType;
  description: string;
  photo_url: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  status: IncidentStatus;
  volunteer_count: number;
  max_volunteers: number;
  escalated_notes: string | null;
}

export interface Volunteer {
  id: string;
  created_at: string;
  updated_at: string;
  arrived_at: string | null;
  incident_id: string;
  device_id: string;
  display_name: string | null;
  abilities: AbilityType[];
  status: VolunteerStatus;
}

// ============================================
// Para la API
// ============================================
export interface IncidentWithVolunteers extends Incident {
  volunteers: Volunteer[];
}

export interface CreateIncidentPayload {
  device_id: string;
  incident_type: IncidentType;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  photo_url?: string;
}

export interface CreateVolunteerPayload {
  device_id: string;
  display_name?: string;
  abilities: AbilityType[];
}

export interface UpdateIncidentPayload {
  status?: IncidentStatus;
  device_id: string;
}

export interface UpdateVolunteerPayload {
  status: VolunteerStatus;
  device_id: string;
}

export interface EscalatePayload {
  device_id: string;
  notes?: string;
}

// ============================================
// Filtros
// ============================================
export interface IncidentFilters {
  types: IncidentType[];
  abilities: AbilityType[];
  maxDistance: number;
}

// ============================================
// Geolocalización
// ============================================
export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface AppState {
  deviceId: string;
  userLocation: LatLng | null;
  locationError: string | null;
  locationLoading: boolean;
  filters: IncidentFilters;
  volunteerMap: Record<string, string>; // incident_id -> volunteer_id
}
