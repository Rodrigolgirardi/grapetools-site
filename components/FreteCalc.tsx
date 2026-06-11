"use client";

import { useState } from "react";
import { Truck, MapPin } from "lucide-react";

/* ─────────────────────────────────────────────
   TABELA DE FRETE (edite aqui os valores/prazos)
   Agrupado por UF. Quando integrar Correios /
   Melhor Envio, basta substituir o estimarFrete().
───────────────────────────────────────────── */
const TABELA_FRETE: Record<string, { preco: number; prazoMin: number; prazoMax: number }> = {
  // Sudeste
  SP: { preco: 14.9, prazoMin: 2, prazoMax: 4 },
  RJ: { preco: 19.9, prazoMin: 3, prazoMax: 6 },
  MG: { preco: 19.9, prazoMin: 3, prazoMax: 6 },
  ES: { preco: 21.9, prazoMin: 4, prazoMax: 7 },
  // Sul
  PR: { preco: 21.9, prazoMin: 4, prazoMax: 7 },
  SC: { preco: 23.9, prazoMin: 4, prazoMax: 8 },
  RS: { preco: 25.9, prazoMin: 5, prazoMax: 9 },
  // Centro-Oeste
  GO: { preco: 24.9, prazoMin: 5, prazoMax: 9 },
  DF: { preco: 24.9, prazoMin: 5, prazoMax: 9 },
  MT: { preco: 28.9, prazoMin: 6, prazoMax: 10 },
  MS: { preco: 27.9, prazoMin: 6, prazoMax: 10 },
  // Nordeste
  BA: { preco: 29.9, prazoMin: 6, prazoMax: 11 },
  PE: { preco: 32.9, prazoMin: 7, prazoMax: 12 },
  CE: { preco: 32.9, prazoMin: 7, prazoMax: 12 },
  RN: { preco: 33.9, prazoMin: 7, prazoMax: 12 },
  PB: { preco: 33.9, prazoMin: 7, prazoMax: 12 },
  AL: { preco: 33.9, prazoMin: 7, prazoMax: 12 },
  SE: { preco: 33.9, prazoMin: 7, prazoMax: 12 },
  MA: { preco: 34.9, prazoMin: 8, prazoMax: 13 },
  PI: { preco: 34.9, prazoMin: 8, prazoMax: 13 },
  // Norte
  TO: { preco: 34.9, prazoMin: 8, prazoMax: 13 },
  PA: { preco: 37.9, prazoMin: 9, prazoMax: 14 },
  AM: { preco: 39.9, prazoMin: 10, prazoMax: 16 },
  RO: { preco: 39.9, prazoMin: 10, prazoMax: 16 },
  AC: { preco: 42.9, prazoMin: 11, prazoMax: 17 },
  RR: { preco: 42.9, prazoMin: 11, prazoMax: 17 },
  AP: { preco: 42.9, prazoMin: 11, prazoMax: 17 },
};

const FRETE_GRATIS_ACIMA = 199; // R$ — mesmo valor da barra do carrinho

type FreteResultado = {
  cidade: string;
  uf: string;
  preco: number;
  prazoMin: number;
  prazoMax: number;
  gratis: boolean;
};

type FreteCalcProps = {
  /** subtotal atual (preço × quantidade) para aplicar frete grátis */
  subtotal?: number;
};

function maskCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

export function FreteCalc({ subtotal = 0 }: FreteCalcProps) {
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

    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();

      if (data.erro) {
        setErro("CEP não encontrado. Confira e tente novamente.");
        return;
      }

      const uf: string = data.uf;
      const faixa = TABELA_FRETE[uf];

      if (!faixa) {
        setErro("Não entregamos nessa região no momento.");
        return;
      }

      setResultado({
        cidade: data.localidade,
        uf,
        preco: faixa.preco,
        prazoMin: faixa.prazoMin,
        prazoMax: faixa.prazoMax,
        gratis: subtotal >= FRETE_GRATIS_ACIMA,
      });
    } catch {
      setErro("Erro ao consultar o CEP. Tente novamente.");
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
          <div className="freteCalcDestino">
            <MapPin size={13} />
            <span>{resultado.cidade} — {resultado.uf}</span>
          </div>
          <div className="freteCalcOpcao">
            <div>
              <strong>Envio padrão</strong>
              <span>
                Chega em {resultado.prazoMin} a {resultado.prazoMax} dias úteis
              </span>
            </div>
            {resultado.gratis ? (
              <em className="freteCalcGratis">Grátis</em>
            ) : (
              <em>
                {resultado.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </em>
            )}
          </div>
          {!resultado.gratis && (
            <div className="freteCalcHint">
              Frete grátis em compras acima de{" "}
              {FRETE_GRATIS_ACIMA.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
