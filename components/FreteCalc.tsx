"use client";

import { useState } from "react";
import { Truck, MapPin } from "lucide-react";

/* ─────────────────────────────────────────────
   Cotação REAL via Melhor Envio (rota /api/frete/calcular,
   que consulta os contratos da loja). O CEP também passa
   pelo ViaCEP só para exibir a cidade de destino.
───────────────────────────────────────────── */

const FRETE_GRATIS_ACIMA = 199; // R$ — mesmo valor da barra do carrinho

type OpcaoFrete = {
  id: number;
  nome: string;
  transportadora: string;
  preco: number;
  prazo: number;
};

type FreteResultado = {
  cidade: string;
  uf: string;
  opcoes: OpcaoFrete[];
  gratis: boolean;
};

type FreteCalcProps = {
  /** subtotal atual (preço × quantidade) para aplicar frete grátis */
  subtotal?: number;
  /** itens a cotar (SKU + quantidade). Sem itens, não há o que cotar. */
  itens: { sku: string; quantidade: number }[];
};

function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function FreteCalc({ subtotal = 0, itens }: FreteCalcProps) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<FreteResultado | null>(null);

  async function calcular() {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setErro("Digite um CEP válido (8 dígitos)");
      setResultado(null);
      return;
    }
    if (!itens.length) {
      setErro("Escolha a quantidade primeiro.");
      return;
    }

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      // Cidade (só exibição) e cotação real, em paralelo
      const [viaRes, cotRes] = await Promise.all([
        fetch(`https://viacep.com.br/ws/${digits}/json/`).then((r) => r.json()).catch(() => null),
        fetch("/api/frete/calcular", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cep: digits, itens }),
        }),
      ]);

      const cot = await cotRes.json().catch(() => null);
      if (!cotRes.ok || !cot?.opcoes) {
        setErro(cot?.error || "Não foi possível cotar o frete. Tente novamente.");
        return;
      }
      if (cot.opcoes.length === 0) {
        setErro("Nenhuma transportadora atende esse CEP no momento.");
        return;
      }

      // Mostra as 3 melhores: mais barata + até 2 alternativas mais rápidas
      const porPreco: OpcaoFrete[] = cot.opcoes;
      const maisBarata = porPreco[0];
      const maisRapidas = [...porPreco]
        .sort((a, b) => a.prazo - b.prazo || a.preco - b.preco)
        .filter((o) => o.id !== maisBarata.id)
        .slice(0, 2);

      setResultado({
        cidade: viaRes?.localidade || "",
        uf: viaRes?.uf || "",
        opcoes: [maisBarata, ...maisRapidas],
        // Frete grátis: >= R$199 com destino na Grande SP (CEP começando em 0)
        gratis: digits.startsWith("0") && subtotal >= FRETE_GRATIS_ACIMA,
      });
    } catch {
      setErro("Erro ao cotar o frete. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="freteCalc">
      <div className="freteCalcTitle">
        <Truck size={15} />
        <span>Calcule o frete e prazo de entrega</span>
      </div>

      <div className="freteCalcRow">
        <input
          className="freteCalcInput"
          inputMode="numeric"
          placeholder="Seu CEP"
          value={cep}
          maxLength={9}
          onChange={(e) => {
            setCep(maskCep(e.target.value));
            setErro(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && calcular()}
          aria-label="CEP para cálculo de frete"
        />
        <button
          className="freteCalcBtn"
          onClick={calcular}
          disabled={loading}
        >
          {loading ? "..." : "Calcular"}
        </button>
      </div>

      <a
        className="freteCalcLink"
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
      >
        Não sei meu CEP
      </a>

      {erro && <div className="freteCalcErro">{erro}</div>}

      {resultado && (
        <div className="freteCalcResultado">
          {resultado.cidade && (
            <div className="freteCalcDestino">
              <MapPin size={13} />
              <span>{resultado.cidade} — {resultado.uf}</span>
            </div>
          )}
          {resultado.opcoes.map((o) => (
            <div className="freteCalcOpcao" key={o.id}>
              <div>
                <strong>{o.transportadora} {o.nome}</strong>
                <span>Chega em até {o.prazo} dia{o.prazo === 1 ? "" : "s"} út{o.prazo === 1 ? "il" : "eis"}</span>
              </div>
              {resultado.gratis ? (
                <em className="freteCalcGratis">Grátis</em>
              ) : (
                <em>{brl(o.preco)}</em>
              )}
            </div>
          ))}
          {!resultado.gratis && (
            <div className="freteCalcHint">
              Frete grátis em compras acima de {brl(FRETE_GRATIS_ACIMA)} para a Grande São Paulo
            </div>
          )}
        </div>
      )}
    </div>
  );
}
