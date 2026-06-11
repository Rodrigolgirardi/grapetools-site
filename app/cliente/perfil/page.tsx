'use client'

import "../cliente.css"
import "./perfil.css"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/hooks/useAuth'
import { BackToSite } from '@/components/BackToSite'

interface Profile {
  id: string
  nome: string | null
  email: string | null
  documento: string | null
  telefone: string | null
  endereco: {
    rua?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }
}

function formatCpfCnpj(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
  }
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function docLabel(v: string) {
  const digits = (v || '').replace(/\D/g, '')
  if (digits.length === 0) return 'CPF / CNPJ'
  return digits.length <= 11 ? 'CPF' : 'CNPJ'
}

function formatTelefone(v: string) {
  return v.replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

function formatCEP(v: string) {
  return v.replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    id: '', nome: '', email: '', documento: '', telefone: '',
    endereco: { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
  })
  const [pageLoading, setPageLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [cepLoading, setCepLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) { router.push('/login?redirect=/cliente/perfil'); return }
    if (user) loadProfile(user.id)
  }, [user, loading])

  async function loadProfile(userId: string) {
    const supabase = createClient()
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) {
      setProfile({
        ...data,
        documento: data.cnpj || data.documento || '',
        endereco: data.endereco || { rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '' }
      })
    } else {
      setProfile(p => ({
        ...p,
        id: userId,
        nome: user?.user_metadata?.full_name || user?.user_metadata?.nome || '',
        email: user?.email || '',
      }))
    }
    setPageLoading(false)
  }

  async function buscarCEP(cep: string) {
    const raw = cep.replace(/\D/g, '')
    if (raw.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setProfile(p => ({
          ...p,
          endereco: { ...p.endereco, rua: data.logradouro || '', bairro: data.bairro || '', cidade: data.localidade || '', estado: data.uf || '' }
        }))
      }
    } catch {}
    setCepLoading(false)
  }

  async function handleSave() {
    if (!user) return
    setSaving(true); setError(''); setSaved(false)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      nome: profile.nome,
      email: user.email,
      cnpj: profile.documento,
      telefone: profile.telefone,
      endereco: profile.endereco,
      updated_at: new Date().toISOString(),
    })
    if (error) setError('Erro ao salvar. Tente novamente.')
    else setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  function setEndereco(field: string, value: string) {
    setProfile(p => ({ ...p, endereco: { ...p.endereco, [field]: value } }))
  }

  if (pageLoading) {
    return (
      <main className="clientePage">
        <div className="clienteLoading">
          <div className="clienteLoadingSpinner" />
          <p>Carregando perfil…</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <BackToSite />
      <main className="clientePage">
      <div className="clienteContainer">

        <nav className="perfilBreadcrumb">
          <a href="/cliente">Minha conta</a>
          <span>/</span>
          <span>Meu perfil</span>
        </nav>

        <h1 className="perfilTitle">Meu perfil</h1>
        <p className="perfilSubtitle">Dados cadastrais e endereço de entrega</p>

        {error && <div className="loginError" style={{marginBottom: 16}}>⚠ {error}</div>}
        {saved && <div className="loginSuccess" style={{marginBottom: 16}}>✓ Dados salvos com sucesso!</div>}

        {/* DADOS PESSOAIS */}
        <div className="perfilSection">
          <h2 className="perfilSectionTitle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Dados pessoais
          </h2>
          <div className="perfilGrid">
            <div className="perfilField perfilFieldFull">
              <label>Nome completo</label>
              <input type="text" value={profile.nome || ''} onChange={e => setProfile(p => ({ ...p, nome: e.target.value }))} placeholder="Seu nome completo" />
            </div>
            <div className="perfilField perfilFieldFull">
              <label>E-mail</label>
              <input type="email" value={profile.email || user?.email || ''} disabled className="perfilDisabled" />
              <small>O e-mail não pode ser alterado aqui</small>
            </div>
            <div className="perfilField">
              <label>Telefone / WhatsApp</label>
              <input type="tel" value={profile.telefone || ''} onChange={e => setProfile(p => ({ ...p, telefone: formatTelefone(e.target.value) }))} placeholder="(11) 99999-9999" />
            </div>
            <div className="perfilField">
              <label>{docLabel(profile.documento || '')} <span className="perfilOptional">opcional</span></label>
              <input
                type="text"
                value={profile.documento || ''}
                onChange={e => setProfile(p => ({ ...p, documento: formatCpfCnpj(e.target.value) }))}
                placeholder="CPF ou CNPJ"
              />
              <small>Digite CPF (11 dígitos) ou CNPJ (14 dígitos)</small>
            </div>
          </div>
        </div>

        {/* ENDEREÇO */}
        <div className="perfilSection">
          <h2 className="perfilSectionTitle">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Endereço de entrega
          </h2>
          <div className="perfilGrid">
            <div className="perfilField">
              <label>CEP</label>
              <div className="perfilCepWrap">
                <input type="text" value={profile.endereco?.cep || ''} onChange={e => setEndereco('cep', formatCEP(e.target.value))} onBlur={e => buscarCEP(e.target.value)} placeholder="00000-000" />
                {cepLoading && <span className="perfilCepSpinner" />}
              </div>
              <small>Preencha o CEP para auto-completar</small>
            </div>
            <div className="perfilField">
              <label>Número</label>
              <input type="text" value={profile.endereco?.numero || ''} onChange={e => setEndereco('numero', e.target.value)} placeholder="123" />
            </div>
            <div className="perfilField perfilFieldFull">
              <label>Rua / Avenida</label>
              <input type="text" value={profile.endereco?.rua || ''} onChange={e => setEndereco('rua', e.target.value)} placeholder="Nome da rua" />
            </div>
            <div className="perfilField">
              <label>Complemento <span className="perfilOptional">opcional</span></label>
              <input type="text" value={profile.endereco?.complemento || ''} onChange={e => setEndereco('complemento', e.target.value)} placeholder="Apto, sala, bloco…" />
            </div>
            <div className="perfilField">
              <label>Bairro</label>
              <input type="text" value={profile.endereco?.bairro || ''} onChange={e => setEndereco('bairro', e.target.value)} placeholder="Bairro" />
            </div>
            <div className="perfilField">
              <label>Cidade</label>
              <input type="text" value={profile.endereco?.cidade || ''} onChange={e => setEndereco('cidade', e.target.value)} placeholder="Cidade" />
            </div>
            <div className="perfilField">
              <label>Estado</label>
              <select value={profile.endereco?.estado || ''} onChange={e => setEndereco('estado', e.target.value)}>
                <option value="">Selecione</option>
                {ESTADOS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="perfilActions">
          <a href="/cliente" className="perfilBtnSecondary">Cancelar</a>
          <button className="perfilBtnPrimary" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>

      </div>
    </main>
    </>
  )
}
