// app/auth/callback/route.ts
// Recebe o "code" do Supabase (login Google OAuth e link de recuperar senha),
// troca por uma sessão (grava os cookies) e redireciona para o destino.
//
// Usado por:
//   - Login com Google  -> redirectTo: /auth/callback?next=/
//   - Recuperar senha    -> redirectTo: /auth/callback?next=/login/redefinir

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('Erro ao trocar code por sessão:', error.message)
  }

  // Sem code ou falhou: volta ao login com aviso
  return NextResponse.redirect(`${origin}/login?erro=auth`)
}
