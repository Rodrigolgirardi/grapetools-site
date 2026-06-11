import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Trocas e Devoluções",
  description: "Política de Trocas, Devoluções e Reembolsos da Grape Tools",
};

export default function DevolucoesPage() {
  return (
    <>
      <header className="simpleTop">
        <Logo />
        <a className="secondaryButton" href="/">Voltar ao início</a>
      </header>
      <main className="lgpdPage">
        <div className="lgpdContent">

          <p className="lgpdDate">Última atualização: 08 de junho de 2026</p>
          <h1>Política de Trocas, Devoluções e Reembolsos</h1>
          <p>A <strong>THE GRAPE LTDA</strong>, inscrita no CNPJ nº 60.055.028/0001-58, atua em conformidade com o Código de Defesa do Consumidor e estabelece a presente política para garantir transparência e segurança aos seus clientes.</p>

          <h2>1. Direito de Arrependimento</h2>
          <p>Nos termos do artigo 49 do Código de Defesa do Consumidor, compras realizadas pela internet poderão ser canceladas em até <strong>7 (sete) dias corridos</strong> após o recebimento do produto.</p>
          <p>Para exercer o direito de arrependimento, o produto deverá ser devolvido:</p>
          <ul>
            <li>Sem indícios de uso;</li>
            <li>Em sua embalagem original, sempre que possível;</li>
            <li>Com todos os acessórios, peças, manuais e brindes eventualmente enviados;</li>
            <li>Acompanhado da nota fiscal ou número do pedido.</li>
          </ul>
          <p>Após o recebimento e conferência do produto, o reembolso será realizado integralmente, incluindo o valor do frete originalmente pago pelo cliente.</p>

          <h2>2. Produto com Defeito</h2>
          <p>Caso o produto apresente defeito de fabricação, o cliente poderá entrar em contato conosco dentro dos prazos previstos pelo Código de Defesa do Consumidor. O produto passará por análise técnica e, após a confirmação do defeito, a THE GRAPE LTDA poderá:</p>
          <ul>
            <li>Realizar a troca do produto;</li>
            <li>Efetuar o reparo;</li>
            <li>Conceder crédito para nova compra;</li>
            <li>Realizar o reembolso integral.</li>
          </ul>
          <p>Não serão considerados defeitos de fabricação danos decorrentes de mau uso, instalação inadequada, modificações realizadas pelo usuário, quedas, impactos, acidentes ou desgaste natural pelo uso.</p>

          <h2>3. Produto Recebido em Desacordo com o Pedido</h2>
          <p>Caso o cliente receba produto diferente do adquirido, deverá comunicar nossa equipe em até <strong>7 (sete) dias corridos</strong> após o recebimento. Após a confirmação do erro, providenciaremos a coleta sem custos ao cliente e o envio do produto correto ou o reembolso integral do valor pago.</p>

          <h2>4. Condições para Aprovação da Troca ou Devolução</h2>
          <p>A solicitação poderá ser recusada caso seja constatado:</p>
          <ul>
            <li>Uso do produto;</li>
            <li>Ausência de componentes essenciais;</li>
            <li>Danos causados pelo consumidor;</li>
            <li>Violação ou alteração do produto;</li>
            <li>Informações divergentes da solicitação apresentada.</li>
          </ul>

          <h2>5. Reembolsos</h2>
          <p>Após a aprovação da devolução, o reembolso será realizado conforme o método de pagamento utilizado na compra.</p>
          <h3>Pix</h3>
          <p>O valor será devolvido para conta de titularidade do comprador.</p>
          <h3>Cartão de crédito</h3>
          <p>O estorno será solicitado à administradora do cartão. O prazo para visualização dependerá da política da operadora e da data de fechamento da fatura.</p>
          <h3>Boleto bancário</h3>
          <p>O reembolso será realizado por transferência bancária para conta de titularidade do comprador.</p>

          <h2>6. Cancelamento de Pedidos</h2>
          <p>Pedidos ainda não enviados poderão ser cancelados mediante solicitação do cliente. Caso o pedido já tenha sido despachado, será aplicado o procedimento de devolução previsto nesta política.</p>

          <h2>7. Custos de Envio</h2>
          <p>Nos casos de defeito de fabricação, erro no envio ou exercício do direito de arrependimento dentro do prazo legal, os custos de devolução serão suportados pela THE GRAPE LTDA. Nos demais casos, os custos poderão ser de responsabilidade do cliente.</p>

          <h2>8. Prazo de Análise</h2>
          <p>Após o recebimento do produto devolvido, a análise poderá ocorrer em até <strong>5 (cinco) dias úteis</strong>.</p>

          <h2>9. Contato</h2>
          <div className="lgpdPartners">
            <h3>Fale conosco</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "6px" }}>
              <li><strong>THE GRAPE LTDA</strong> · CNPJ: 60.055.028/0001-58</li>
              <li>E-mail suporte: <a href="mailto:suporte@grapetools.com.br">suporte@grapetools.com.br</a></li>
              <li>E-mail LGPD: <a href="mailto:privacidade@grapetools.com.br">privacidade@grapetools.com.br</a></li>
              <li>Horário: Segunda a Sexta-feira, das 08h às 18h</li>
            </ul>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
