import { NextRequest, NextResponse } from 'next/server';

// ============================================
// GET /api/geocode?lat=10.5&lng=-66.9
// Reverse geocoding usando Nominatim (OpenStreetMap)
// ============================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Se requieren lat y lng' },
                { status: 400 }
            );
        }

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=es`;

        const res = await fetch(url, {
            headers: {
                'User-Agent': 'RescateYA-Venezuela/1.0 (emergencia; contacto@rescateyavenezuela.com)',
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Error al consultar el servicio de geocodificación' },
                { status: 502 }
            );
        }

        const data = await res.json();

        // Intentar usar display_name primero
        if (data.display_name) {
            return NextResponse.json({ address: data.display_name });
        }

        // Si no hay display_name, armar dirección con los campos del objeto address
        if (data.address) {
            const addr = data.address;
            const parts = [
                addr.road,
                addr.neighbourhood,
                addr.suburb,
                addr.city || addr.town || addr.village,
                addr.municipality,
                addr.state,
                addr.country,
            ].filter(Boolean);
            const address = parts.join(', ');
            if (address) {
                return NextResponse.json({ address });
            }
        }

        return NextResponse.json({ address: null });
    } catch (err) {
        console.error('Error in GET /api/geocode:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
