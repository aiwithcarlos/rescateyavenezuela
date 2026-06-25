import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ============================================
// POST /api/upload
// Subir foto a Supabase Storage
// ============================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato de imagen no soportado. Usa JPEG, PNG o WEBP.' },
        { status: 400 }
      );
    }

    // Validar tamaño (máx 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'La imagen es demasiado grande. Máximo 5MB.' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const ext = file.type.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // Subir a Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('incident-photos')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      return NextResponse.json(
        { error: 'Error al subir la imagen' },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('incident-photos')
      .getPublicUrl(fileName);

    return NextResponse.json(
      { url: urlData.publicUrl, path: data.path },
      { status: 201 }
    );
  } catch (err) {
    console.error('Unexpected error in POST /api/upload:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
