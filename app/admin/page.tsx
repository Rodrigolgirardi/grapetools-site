// app/admin/page.tsx (SERVER)
// Painel admin: espelho de segurança dos dados reais (direto do Supabase), pra
// conferir pedidos/clientes mesmo se a API do GrapeOne bugar. Só admin acessa.

import { redirect } from "next/navigation";
import { products } from "@/lib/data";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { isAdminEmail } from "@/lib/admin";
import { getPausados } from "@/lib/estoque";
import { AdminPanel } from "@/components/AdminPanel";

export const dynamic = "force-dynamic"; // sempre dados frescos

const LIMITE_PEDIDOS = 300;

export default async function AdminPage() {
  // Defesa em profundidade: além do middleware, confere admin aqui também.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    redirect("/");
  }

  const db = createAdminClient();
  const [pedidosRes, profilesRes, pausados, cuponsRes] = await Promise.all([
    db
      // "*" em vez de lista fixa: deploy-safe pra colunas novas (rastreio, cupom…) —
      // se ainda não existirem, o select não quebra (só não vem o campo).
      .from("pedidos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(LIMITE_PEDIDOS),
    db.from("profiles").select("id, nome, email, cnpj, telefone, created_at"),
    getPausados(),
    // Se a migração 007 ainda não rodou, isto retorna { data:null, error } e o
    // painel simplesmente mostra "nenhum cupom" (não quebra).
    db.from("cupons").select("*").order("created_at", { ascending: false }),
  ]);

  const pedidosRaw = pedidosRes.data || [];
  const profiles = profilesRes.data || [];
  const perfilPorId = new Map(profiles.map((p) => [p.id, p]));

  // Itens dos pedidos listados (1 query só)
  const ids = pedidosRaw.map((p) => p.id);
  const itensRes = ids.length
    ? await db
        .from("pedido_itens")
        .select("pedido_id, sku, descricao, quantidade, preco_unitario")
        .in("pedido_id", ids)
    : { data: [] as Record<string, unknown>[] };
  const itensPorPedido = new Map<string, { descricao: string; sku: string; quantidade: number; preco_unitario: number }[]>();
  for (const it of itensRes.data || []) {
    const pid = it.pedido_id as string;
    const arr = itensPorPedido.get(pid) || [];
    arr.push({
      descricao: (it.descricao as string) || (it.sku as string),
      sku: it.sku as string,
      quantidade: Number(it.quantidade) || 0,
      preco_unitario: Number(it.preco_unitario) || 0,
    });
    itensPorPedido.set(pid, arr);
  }

  const pedidos = pedidosRaw.map((p) => {
    const perfil = perfilPorId.get(p.user_id);
    return {
      id: p.id as string,
      data: p.created_at as string,
      pagoEm: (p.pago_em as string) || "",
      clienteUserId: p.user_id as string,
      clienteNome: (perfil?.nome as string) || "—",
      clienteEmail: (perfil?.email as string) || "—",
      clienteTelefone: (perfil?.telefone as string) || "",
      total: Number(p.total) || 0,
      forma_pagamento: (p.forma_pagamento as string) || "—",
      pagamento_status: (p.pagamento_status as string) || "nao_pago",
      status: (p.status as string) || "pendente",
      rastreio: (p.rastreio as string) || "",
      pagarme_order_id: (p.pagarme_order_id as string) || null,
      // Frete/etiqueta (migração 008; ausentes em pedidos antigos)
      entregaTipo: (p.entrega_tipo as string) || "",
      freteServicoNome: (p.frete_servico_nome as string) || "",
      freteValor: Number(p.frete_valor) || 0,
      temEndereco: !!(p.endereco_entrega as Record<string, unknown> | null)?.cep,
      etiquetaUrl: (p.etiqueta_url as string) || "",
      enderecoEntrega: (p.endereco_entrega as Record<string, string> | null) || null,
      // Menu "⋯" da aba Vendas (migração 009 + colunas de cupom da 007)
      observacao: (p.observacao as string) || "",
      notaAdmin: (p.nota_admin as string) || "",
      nfNumero: (p.nf_numero as string) || "",
      cancelMotivo: (p.cancel_motivo as string) || "",
      cupomCodigo: (p.cupom_codigo as string) || "",
      cupomPercent: Number(p.cupom_desconto_percent) || 0,
      vendedor: (p.vendedor as string) || "",
      comissaoValor: Number(p.comissao_valor) || 0,
      parcelas: Number(p.parcelas) || 1,
      itens: itensPorPedido.get(p.id as string) || [],
    };
  });

  // Clientes com nº de pedidos e total efetivamente pago
  const porCliente = new Map<string, { num: number; totalPago: number }>();
  for (const p of pedidosRaw) {
    const s = porCliente.get(p.user_id as string) || { num: 0, totalPago: 0 };
    s.num += 1;
    if (p.pagamento_status === "pago") s.totalPago += Number(p.total) || 0;
    porCliente.set(p.user_id as string, s);
  }
  const clientes = profiles.map((p) => ({
    userId: p.id as string,
    nome: (p.nome as string) || "—",
    email: (p.email as string) || "—",
    cnpj: (p.cnpj as string) || "",
    telefone: (p.telefone as string) || "",
    criadoEm: p.created_at as string,
    numPedidos: porCliente.get(p.id)?.num || 0,
    totalGasto: porCliente.get(p.id)?.totalPago || 0,
  }));

  const pagos = pedidosRaw.filter((p) => p.pagamento_status === "pago");
  const pendentes = pedidosRaw.filter((p) => p.pagamento_status === "nao_pago");
  const stats = {
    produtos: products.length,
    pedidos: pedidosRaw.length,
    pedidosPagos: pagos.length,
    pedidosPendentes: pendentes.length,
    clientes: profiles.length,
    faturamento: pagos.reduce((s, p) => s + (Number(p.total) || 0), 0),
    aReceber: pendentes.reduce((s, p) => s + (Number(p.total) || 0), 0),
    pedidosNoCap: pedidosRaw.length >= LIMITE_PEDIDOS,
  };

  // Cupons + relatório de comissão (agrupa pedidos PAGOS por vendedor).
  const cupons = (cuponsRes.data || []).map((c) => ({
    id: c.id as string,
    codigo: c.codigo as string,
    desconto_percent: Number(c.desconto_percent) || 0,
    vendedor: (c.vendedor as string) || "",
    comissao_percent: Number(c.comissao_percent) || 0,
    ativo: !!c.ativo,
  }));
  // (Relatório de comissão agora é calculado na própria aba Cupons, por mês,
  // a partir dos pedidos — cada pedido pago guarda comissao_valor da época.)

  return (
    <AdminPanel
      pedidos={pedidos}
      clientes={clientes}
      pausadosIniciais={pausados}
      stats={stats}
      cupons={cupons}
    />
  );
}
