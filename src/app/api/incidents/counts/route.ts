import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { IncidentType } from '@/types';

const ALL_TYPES: IncidentType[] = [
    'personas_atrapadas',
    'necesitan_herramientas',
    'necesitan_maquinaria',
    'movilidad_reducida',
    'insumos_medicos_y_alimentos',
];

// ============================================
// GET /api/incidents/counts
// Devuelve cantidad de incidentes por tipo
// ============================================
export async function GET() {
    try {
        const counts: Record<string, number> = {};

        for (const type of ALL_TYPES) {
            const { count, error } = await supabase
                .from('incidents')
                .select('*', { count: 'exact', head: true })
                .eq('incident_type', type);

            if (!error) {
                counts[type] = count || 0;
            } else {
                counts[type] = 0;
            }
        }

        return NextResponse.json({ counts });
    } catch (err) {
        console.error('Error in GET /api/incidents/counts:', err);
        return NextResponse.json({ counts: {} }, { status: 500 });
    }
}
