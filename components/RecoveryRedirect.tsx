'use client'

// components/RecoveryRedirect.tsx
// Resgate do link "esqueci minha senha".
//
// O Supabase só honra o `redirectTo` do e-mail se a URL estiver na allowlist do
// projeto (Authentication > URL Configuration > Redirect URLs). Se não estiver,
// ele descarta o destino e joga o usuário na Site URL — a HOME — com os tokens
// no fragmento da URL (#access_token=...&type=recovery). A pessoa então cai num
// site normal, sem nenhum campo de senha, e não consegue concluir a troca.
//
// Este componente cobre esse caso: em qualquer página, se o fragmento indicar
// uma recuperação de senha, ele abre a sessão com os tokens recebidos e leva
// para /login/redefinir. Continua funcionando normalmente se a allowlist for
// corrigida — aí o fragmento nem chega aqui.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DESTINO = '/login/redefinir'

export function RecoveryRedirect() {
  const router = useRouter()

  useEffect(() => {
    // O cliente do Supabase consome e limpa o fragmento assim que é criado, então
    // lemos antes de instanciá-lo.
    const hash = window.location.hash
    if (!hash || !hash.includes('type=recovery')) return
    // Já estamos na página de redefinir? Ela mesma cuida do resto.
    if (window.location.pathname === DESTINO) return

    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    if (!access_token || !refresh_token) return

    ;(async () => {
      const { createClient } = await import('@/lib/supabase-client')
      const supabase = createClient()
      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      // Limpa os tokens da barra de endereço antes de sair da página — evita que
      // fiquem no histórico do navegador ou num print de tela.
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      router.replace(error ? '/login/recuperar?erro=link' : DESTINO)
    })()
  }, [router])

  return null
}
