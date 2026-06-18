import { Truck, Percent, Check } from "lucide-react";
import { formatCurrency, FRETE_GRATIS_MIN, DESCONTO_MAX_PERCENT, DESCONTO_MAX_MIN, descontoCarrinhoPercent } from "@/lib/pricing";

type Props = {
  subtotal: number;
};

export function CartProgressBar({ subtotal }: Props) {
  const temFrete = subtotal >= FRETE_GRATIS_MIN;
  const faltaFrete = Math.max(0, FRETE_GRATIS_MIN - subtotal);

  const descAtual = descontoCarrinhoPercent(subtotal);
  const temMaiorDesc = subtotal >= DESCONTO_MAX_MIN;
  const faltaMaiorDesc = Math.max(0, DESCONTO_MAX_MIN - subtotal);

  // Progresso visual: até o maior desconto (objetivo final da barra)
  const progresso = Math.min((subtotal / DESCONTO_MAX_MIN) * 100, 100);

  return (
    <div className="promoBar" role="status" aria-live="polite">
      <div className="promoBarMsgs">
        <span className="promoBarItem">
          {temFrete ? (
            <Check size={15} className="promoBarIcon" />
          ) : (
            <Truck size={15} className="promoBarIcon" />
          )}
          {temFrete ? (
            <span className="promoBarDone">Frete grátis liberado!</span>
          ) : (
            <span>
              Faltam <span className="promoBarValue">{formatCurrency(faltaFrete)}</span> para o frete grátis
            </span>
          )}
        </span>

        <span className="promoBarItem">
          {temMaiorDesc ? (
            <Check size={15} className="promoBarIcon" />
          ) : (
            <Percent size={15} className="promoBarIcon" />
          )}
          {temMaiorDesc ? (
            <span>Você atingiu o maior desconto: {DESCONTO_MAX_PERCENT}% OFF</span>
          ) : (
            <span className="promoBarDescText">
              <span>
                Faltam <span className="promoBarValue">{formatCurrency(faltaMaiorDesc)}</span> para o maior desconto ({DESCONTO_MAX_PERCENT}%)
              </span>
              {descAtual > 0 && <span className="promoBarTag">você já tem {descAtual}%</span>}
            </span>
          )}
        </span>
      </div>

      <div className="promoBarTrack">
        <div className="promoBarFill" style={{ width: `${progresso}%` }} />
      </div>
    </div>
  );
}
