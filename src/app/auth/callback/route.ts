import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type'); // Recupera el tipo de enlace

  console.log('Debug - Código recibido:', code);
  console.log('Debug - Tipo de enlace:', type);

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Debug - Sesión intercambiada exitosamente.');
    } catch (error) {
      console.error('Error intercambiando código por sesión:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`);
    }
  } else {
    console.warn('Debug - Código no proporcionado en la URL.');
  }

  // Redirige según el tipo
  if (type === 'recovery') {
    console.log('Debug - Redirigiendo a reset-password.');
    return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`);
  } else if (type === 'invite') {
    console.log('Debug - Redirigiendo a welcome.');
    return NextResponse.redirect(`${requestUrl.origin}/auth/welcome`);
  }

  // Redirige al dashboard como fallback
  console.log('Debug - Redirigiendo al dashboard por defecto.');
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}

export const dynamic = 'force-dynamic';
