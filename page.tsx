'use client'

// app/cliente/page.tsx
// Área do cliente — protegida pelo middleware
// Exibe perfil, histórico de pedidos, favoritos

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth, getFirstName } from '@/hooks/useAuth'

interface Profile {
  id: string
  nome: string | null
  email: string | null
  cnpj: string | null
  telefone: string | null
}

export default function ClientePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/cliente')
      return
    }

    if (user) {
      loadProfile(user.id)
    }
  }, [user, loading])

  async function loadProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    } else {
      // Perfil ainda não existe — usa dados do auth
      setProfile({
        id: userId,
        nome: user?.user_metadata?.full_name || null,
        email: user?.email || null,
        cnpj: null,
        telefone: null,
      })
    }
    setProfileLoading(false)
  }

  if (loading || profileLoading) {
    return (
      <main className="clientePage">
        <div className="clienteLoading">
          <div className="clienteLoadingSpinner" />
          <p>Carregando sua conta…</p>
        </div>
      </main>
    )
  }

  const firstName = getFirstName(user)

  return (
    <main className="clientePage">
      <div className="clienteContainer">
        {/* Header da página */}
        <div className="clienteHeader">
          <div className="clienteAvatar">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="clienteTitle">Olá, {firstName}!</h1>
            <p className="clienteSubtitle">{user?.email}</p>
          </div>
        </div>

        {/* Cards de ação rápida */}
        <div className="clienteCards">
          <a href="/pedidos" className="clienteCard">
            <div className="clienteCardIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <p className="clienteCardTitle">Meus pedidos</p>
              <p className="clienteCardDesc">Acompanhe seus pedidos</p>
            </div>
            <svg className="clienteCardArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>

          <a href="/favoritos" className="clienteCard">
            <div className="clienteCardIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <p className="clienteCardTitle">Favoritos</p>
              <p className="clienteCardDesc">Produtos salvos</p>
            </div>
            <svg className="clienteCardArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>

          <a href="/cliente/perfil" className="clienteCard">
            <div className="clienteCardIcon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p className="clienteCardTitle">Meu perfil</p>
              <p className="clienteCardDesc">Dados cadastrais e endereço</p>
            </div>
            <svg className="clienteCardArrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>

        {/* Dados do perfil (placeholder até /cliente/perfil existir) */}
        {profile && (profile.cnpj || profile.telefone) && (
          <div className="clienteProfileCard">
            <h2 className="clienteSection">Dados da empresa</h2>
            {profile.cnpj && (
              <p className="clienteProfileItem">
                <span>CNPJ</span>
                <strong>{profile.cnpj}</strong>
              </p>
            )}
            {profile.telefone && (
              <p className="clienteProfileItem">
                <span>Telefone</span>
                <strong>{profile.telefone}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
