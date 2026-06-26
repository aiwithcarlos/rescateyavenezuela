import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { haversineDistance } from '@/lib/utils';
import type { Incident, CreateIncidentPayload } from '@/types';

// ============================================
// GET /api/incidents
// Lista incidentes activos con filtros opcionales
// Query: lat, lng, radius (km), type, status
// ============================================
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const radius = parseFloat(searchParams.get('radius') || '50');
        const typeParam = searchParams.get('type'); // comma-separated
        const statusParam =
            searchParams.get('status') || 'reportado,ayuda_en_camino';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Construir query base (con count para paginación)
        let baseQuery = supabase
            .from('incidents')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        // Filtrar por estado
        if (statusParam) {
            const statuses = statusParam.split(',').map((s) => s.trim());
            baseQuery = baseQuery.in('status', statuses);
        }

        // Filtrar por tipo
        if (typeParam) {
            const types = typeParam.split(',').map((t) => t.trim());
            baseQuery = baseQuery.in('incident_type', types);
        }

        // Obtener total antes de paginar
        const { count: totalCount } = await baseQuery;

        // Aplicar paginación
        const { data, error } = await baseQuery.range(offset, offset + limit - 1);

        if (error) {
            console.error('Error fetching incidents:', error);
            return NextResponse.json(
                { error: 'Error al obtener incidentes' },
                { status: 500 },
            );
        }

        let incidents = data as Incident[];

        // Filtrar por distancia si se proporcionan coordenadas
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);

            if (!isNaN(userLat) && !isNaN(userLng)) {
                incidents = incidents
                    .map((incident) => ({
                        ...incident,
                        _distance: haversineDistance(
                            userLat,
                            userLng,
                            incident.latitude,
                            incident.longitude,
                        ),
                    }))
                    .filter((incident) => (incident as any)._distance <= radius)
                    .sort((a: any, b: any) => a._distance - b._distance);
            }
        }

        return NextResponse.json({
            incidents,
            total: totalCount || incidents.length,
            page,
            limit,
            totalPages: Math.ceil((totalCount || incidents.length) / limit),
        });
    } catch (err) {
        console.error('Unexpected error in GET /api/incidents:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}

// ============================================
// POST /api/incidents
// Crear un nuevo incidente
// ============================================
export async function POST(request: NextRequest) {
    try {
        const body: CreateIncidentPayload = await request.json();

        // Validación básica
        if (!body.device_id) {
            return NextResponse.json(
                { error: 'Se requiere device_id' },
                { status: 400 },
            );
        }
        if (!body.incident_type) {
            return NextResponse.json(
                { error: 'Se requiere el tipo de incidente' },
                { status: 400 },
            );
        }
        if (!body.latitude || !body.longitude) {
            return NextResponse.json(
                { error: 'Se requiere la ubicación (latitud y longitud)' },
                { status: 400 },
            );
        }
        if (
            ![
                'personas_atrapadas',
                'necesitan_herramientas',
                'necesitan_maquinaria',
                'movilidad_reducida',
                'insumos_medicos_y_alimentos',
            ].includes(body.incident_type)
        ) {
            return NextResponse.json(
                { error: 'Tipo de incidente inválido' },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from('incidents')
            .insert({
                device_id: body.device_id,
                incident_type: body.incident_type,
                description: body.description || '',
                latitude: body.latitude,
                longitude: body.longitude,
                address: body.address || null,
                photo_url: body.photo_url || null,
                reporter_name: body.reporter_name || null,
                reporter_phone: body.reporter_phone || null,
                status: 'reportado',
                volunteer_count: 0,
                arrived_count: 0,
                max_volunteers: body.max_volunteers || 50,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating incident:', error);
            return NextResponse.json(
                { error: 'Error al crear el incidente' },
                { status: 500 },
            );
        }

        return NextResponse.json({ incident: data }, { status: 201 });
    } catch (err) {
        console.error('Unexpected error in POST /api/incidents:', err);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 },
        );
    }
}
