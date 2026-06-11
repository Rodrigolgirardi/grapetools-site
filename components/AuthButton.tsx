'use client'

// components/AuthButton.tsx
// Substitui o botão estático "Entrar" no Header
// Uso: <AuthButton /> dentro do Header

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth, getFirstName } from '@/hooks/useAuth'

export default function AuthButton() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <div className="authBtn authBtnLoading" aria-hidden="true" />
  }

  if (!user) {
    return (
      <button
        className="authBtn authBtnLogin"
        onClick={() => router.push('/login')}
        aria-label="Entrar na sua conta"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Entrar
      </button>
    )
  }

  const firstName = getFirstName(user)
  const initials = firstName.charAt(0).toUpperCase()

  return (
    <div className="authUserMenu">
      <button className="authUserBtn" aria-label={`Menu do usuário ${firstName}`}>
        <span className="authAvatar" aria-hidden="true">{initials}</span>
        <span className="authUserName">{firstName}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div className="authDropdown" role="menu">
        <a href="/cliente" className="authDropdownItem" role="menuitem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
          Minha conta
        </a>
        <a href="/pedidos" className="authDropdownItem" role="menuitem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Meus pedidos
        </a>
        <div className="authDropdownDivider" role="separator"/>
        <button
          className="authDropdownItem authDropdownLogout"
          onClick={handleLogout}
          role="menuitem"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>
    </div>
  )
}
