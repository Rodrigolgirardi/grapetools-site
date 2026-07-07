// lib/cupom.ts
// Busca/valida cupom. SÓ SERVIDOR (usa o admin client que ignora RLS). O cliente
// nunca lê a tabela `cupons` direto — sempre passa pelo servidor.
import { createAdminClient } from '@/lib/supabase-admin'

export type Cupom = {
  codigo: string
  desconto_percent: number
  vendedor: string | null
  comissao_percent: number
  ativo: boolean
}

// Retorna o cupom ATIVO com esse código (case-insensitive), ou null se não existe,
// está inativo, ou a tabela ainda não foi criada (migração 007 não rodada).
export async function buscarCupomAtivo(codigo: string): Promise<Cupom | null> {
  const cod = String(codigo || '').trim().toUpperCase()
  if (!cod) return null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('cupons')
      .select('codigo, desconto_percent, vendedor, comissao_percent, ativo')
      .eq('codigo', cod)
      .eq('ativo', true)
      .maybeSingle()
    if (error || !data) return null
    return {
      codigo: data.codigo as string,
      desconto_percent: Number(data.desconto_percent) || 0,
      vendedor: (data.vendedor as string) || null,
      comissao_percent: Number(data.comissao_percent) || 0,
      ativo: !!data.ativo,
    }
  } catch {
    return null
  }
}
