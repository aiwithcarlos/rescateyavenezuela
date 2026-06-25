import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { CreateVolunteerPayload } from '@/types';

// ============================================
// POST /api/incidents/[id]/volunteers
// Registrarse como voluntario para un incidente
// ============================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: incidentId } = await params;
    const body: CreateVolunteerPayload = await request.json();

    if (!body.device_id) {
      return NextResponse.json(
        { error: 'Se requiere device_id' },
        { status: 400 }
      );
    }

    // Verificar que el incidente existe y no está lleno
    const { data: incident, error: incError } = await supabase
      .from('incidents')
      .select('id, status, volunteer_count, max_volunteers')
      .eq('id', incidentId)
      .single();

    if (incError || !incident) {
      return NextResponse.json(
        { error: 'Incidente no encontrado' },
        { status: 404 }
      );
    }

    if (incident.status === 'resolved' || incident.status === 'escalated') {
      return NextResponse.json(
        { error: 'Este incidente ya no está activo' },
        { status: 400 }
      );
    }

    // Validar habilidades
    const validAbilities = ['brazos', 'pala_herramientas', 'vehiculo', 'maquinaria'];
    const abilities = (body.abilities || []).filter((a) =>
      validAbilities.includes(a)
    );

    const { data, error } = await supabase
      .from('volunteers')
      .insert({
        incident_id: incidentId,
        device_id: body.device_id,
        display_name: body.display_name || null,
        abilities,
        status: 'going',
      })
      .select()
      .single();

    if (error) {
      // Violación de UNIQUE constraint — el usuario ya es voluntario
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya te registraste para ayudar en este incidente' },
          { status: 409 }
        );
      }
      console.error('Error creating volunteer:', error);
      return NextResponse.json(
        { error: 'Error al registrarse como voluntario' },
        { status: 500 }
      );
    }

    return NextResponse.json({ volunteer: data }, { status: 201 });
  } catch (err) {
    console.error(
      'Unexpected error in POST /api/incidents/[id]/volunteers:',
      err
    );
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
