import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { EscalatePayload } from '@/types';

// ============================================
// POST /api/incidents/[id]/escalate
// Escalar incidente a Protección Civil
// ============================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: EscalatePayload = await request.json();

    if (!body.device_id) {
      return NextResponse.json(
        { error: 'Se requiere device_id' },
        { status: 400 }
      );
    }

    // Verificar que el incidente existe
    const { data: incident, error: incError } = await supabase
      .from('incidents')
      .select('*')
      .eq('id', id)
      .single();

    if (incError || !incident) {
      return NextResponse.json(
        { error: 'Incidente no encontrado' },
        { status: 404 }
      );
    }

    if (incident.status === 'escalated') {
      return NextResponse.json(
        { error: 'Este incidente ya fue escalado a Protección Civil' },
        { status: 400 }
      );
    }

    // Actualizar el incidente a escalado
    const { data, error } = await supabase
      .from('incidents')
      .update({
        status: 'escalated',
        escalated_at: new Date().toISOString(),
        escalated_notes: body.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error escalating incident:', error);
      return NextResponse.json(
        { error: 'Error al escalar el incidente' },
        { status: 500 }
      );
    }

    // En un entorno real, aquí se enviaría a Protección Civil por email/API
    console.log('[ESCALATION] Incidente escalado a Protección Civil:', {
      id: data.id,
      type: data.incident_type,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      photo_url: data.photo_url,
      escalated_notes: data.escalated_notes,
      escalated_at: data.escalated_at,
    });

    return NextResponse.json({
      incident: data,
      message:
        'Incidente escalado exitosamente a Protección Civil. Los datos han sido preparados para envío.',
    });
  } catch (err) {
    console.error(
      'Unexpected error in POST /api/incidents/[id]/escalate:',
      err
    );
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
