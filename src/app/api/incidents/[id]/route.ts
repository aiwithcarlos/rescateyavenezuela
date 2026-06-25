import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { UpdateIncidentPayload } from '@/types';

// ============================================
// GET /api/incidents/[id]
// Obtener detalle de un incidente con sus voluntarios
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Obtener el incidente
    const { data: incident, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !incident) {
      return NextResponse.json(
        { error: 'Incidente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener los voluntarios asociados
    const { data: volunteers, error: volError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('incident_id', id)
      .order('created_at', { ascending: true });

    if (volError) {
      console.error('Error fetching volunteers:', volError);
    }

    return NextResponse.json({
      incident,
      volunteers: volunteers || [],
    });
  } catch (err) {
    console.error('Unexpected error in GET /api/incidents/[id]:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH /api/incidents/[id]
// Actualizar estado del incidente (resolver/escalar)
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateIncidentPayload = await request.json();

    if (!body.device_id) {
      return NextResponse.json(
        { error: 'Se requiere device_id' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.status) {
      if (
        !['reported', 'help_on_way', 'resolved', 'escalated'].includes(
          body.status
        )
      ) {
        return NextResponse.json(
          { error: 'Estado inválido' },
          { status: 400 }
        );
      }
      updates.status = body.status;

      if (body.status === 'resolved') {
        updates.resolved_at = new Date().toISOString();
      }
      if (body.status === 'escalated') {
        updates.escalated_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('incidents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating incident:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el incidente' },
        { status: 500 }
      );
    }

    return NextResponse.json({ incident: data });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/incidents/[id]:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
