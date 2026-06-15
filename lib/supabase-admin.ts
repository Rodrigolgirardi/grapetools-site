// lib/supabase-admin.ts
// Cliente "admin" do Supabase — usa a service_role key e IGNORA o RLS.
// USE SOMENTE no servidor (Route Handlers / Server Actions).
// NUNCA importe isso em componentes de cliente ("use client") nem exponha a chave.
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local'
    )
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
