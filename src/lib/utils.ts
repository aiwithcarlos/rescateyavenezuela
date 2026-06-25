import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// ============================================
// Fórmula de Haversine para distancia entre
// dos puntos geográficos (en km)
// ============================================
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ============================================
// Formateo de distancia
// ============================================
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}

// ============================================
// Formateo de tiempo relativo en español
// ============================================
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

// ============================================
// Generar ID de dispositivo
// ============================================
export function generateDeviceId(): string {
  if (typeof window !== 'undefined') {
    const existing = localStorage.getItem('hv_device_id');
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem('hv_device_id', id);
    return id;
  }
  return '';
}

// ============================================
// Truncar texto
// ============================================
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// ============================================
// Construir query string desde filtros
// ============================================
export function buildIncidentQuery(
  lat?: number | null,
  lng?: number | null,
  radius?: number,
  types?: string[],
  status?: string
): string {
  const params = new URLSearchParams();
  if (lat != null && lng != null) {
    params.set('lat', lat.toString());
    params.set('lng', lng.toString());
    params.set('radius', (radius || 50).toString());
  }
  if (types && types.length > 0 && types.length < 4) {
    params.set('type', types.join(','));
  }
  if (status) {
    params.set('status', status);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
