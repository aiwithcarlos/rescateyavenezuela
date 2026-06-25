import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { UpdateVolunteerPayload } from '@/types';

// ============================================
// PATCH /api/volunteers/[id]
// Actualizar estado del voluntario (llegó/canceló)
// ============================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateVolunteerPayload = await request.json();

    if (!body.device_id) {
      return NextResponse.json(
        { error: 'Se requiere device_id' },
        { status: 400 }
      );
    }

    if (!body.status || !['en_camino', 'llego_al_lugar', 'cancelado'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser: en_camino, llego_al_lugar, o cancelado' },
        { status: 400 }
      );
    }

    // Verificar que el voluntario existe y pertenece al device
    const { data: volunteer, error: volError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('id', id)
      .single();

    if (volError || !volunteer) {
      return NextResponse.json(
        { error: 'Registro de voluntario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el device_id coincide (seguridad básica)
    if (volunteer.device_id !== body.device_id) {
      return NextResponse.json(
        { error: 'No tienes permiso para actualizar este registro' },
        { status: 403 }
      );
    }

    const updates: Record<string, any> = {
      status: body.status,
      updated_at: new Date().toISOString(),
    };

    if (body.status === 'llego_al_lugar') {
      updates.arrived_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating volunteer:', error);
      return NextResponse.json(
        { error: 'Error al actualizar el estado' },
        { status: 500 }
      );
    }

    return NextResponse.json({ volunteer: data });
  } catch (err) {
    console.error('Unexpected error in PATCH /api/volunteers/[id]:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
