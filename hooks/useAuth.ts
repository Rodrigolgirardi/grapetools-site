'use client'

// hooks/useAuth.ts
// Hook reutilizável para estado de autenticação em Client Components
import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()

    // Pega a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    // Escuta mudanças de auth em tempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}

// Helper: retorna primeiro nome do usuário
export function getFirstName(user: User | null): string {
  if (!user) return ''
  // full_name = Google OAuth | name = Google OAuth alternativo
  // nome = cadastro email/senha do nosso form
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.nome ||
    'Cliente'
  return fullName.split(' ')[0]
}
