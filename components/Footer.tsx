import { Instagram, Mail, MapPin, Phone, Facebook } from "lucide-react";
import { Logo } from "./Logo";

const WhatsAppIcon = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.031 7.807L0 32l8.418-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.79-1.857l-.486-.29-5.004 1.192 1.257-4.866-.317-.5A13.234 13.234 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.906c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.03 1.294-1.262 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.696.1-.1061.497-.365.398-1.394 1.362-1.394 3.325s1.427 3.856 1.626 4.122c.199.265 2.808 4.287 6.805 6.015.951.41 1.693.655 2.271.839.954.303 1.823.26 2.51.158.765-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div>
          <Logo />
          <p style={{ marginTop: "14px", fontSize: "0.85rem" }}>
            Ferragens, ferramentas e utilidades<br />
            com desconto progressivo por quantidade.
          </p>
          <div className="footerSocial">
            <a href="https://instagram.com/grapetools" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a href="https://facebook.com/grapetools" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3>Atendimento</h3>
          <p><Phone size={15} /> (11) 99999-9999</p>
          <p><Mail size={15} /> contato@grapetools.com.br</p>
          <p><MapPin size={15} /> São Paulo — SP</p>
        </div>

        <div>
          <h3>Institucional</h3>
          <ul className="footerLinks">
            <li><a href="/quem-somos">Quem Somos</a></li>
            <li><a href="/como-comprar">Como Comprar</a></li>
            <li><a href="/politica-de-privacidade">Política de Privacidade (LGPD)</a></li>
            <li><a href="/trocas-e-devolucoes">Troca e Devoluções</a></li>
          </ul>
        </div>

        <div>
          <h3>Baixe nosso app</h3>
          <div className="appButtons">
            <a href="#" className="appBtn" aria-label="Baixar na App Store">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div>
                <small>Download on the</small>
                <strong>App Store</strong>
              </div>
            </a>
            <a href="#" className="appBtn" aria-label="Baixar no Google Play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.64.22.99.14l12.48-7.18-2.76-2.76-10.71 9.8zM.54 1.06C.2 1.4 0 1.96 0 2.72v18.56c0 .76.2 1.32.55 1.65l.08.08 10.4-10.4v-.24L.62.98l-.08.08zM20.37 10.04l-2.62-1.51-3.1 3.1 3.1 3.1 2.64-1.52c.75-.43.75-1.14-.02-1.57v-.6zM3.18.24L15.66 7.4l-2.76 2.76L2.19.37c.3-.17.67-.2.99-.13z"/></svg>
              <div>
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* WHATSAPP + REDES */}
      <div className="footerExtra">
        <div className="footerExtraInner">
          <div className="footerWhats">
            <h3>Compre pelo WhatsApp</h3>
            <p>Para todo o território nacional.<br/>
            <small>Horário de atendimento pelo WhatsApp sujeito à região.</small></p>
            <a
              href="https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1%20equipe%20Grape%20Tools!%20Podemos%20conversar%3F"
              target="_blank"
              rel="noreferrer"
              className="footerWhatsBtn"
            >
              <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.031 7.807L0 32l8.418-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.79-1.857l-.486-.29-5.004 1.192 1.257-4.866-.317-.5A13.234 13.234 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.906c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.03 1.294-1.262 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.325s1.427 3.856 1.626 4.122c.199.265 2.808 4.287 6.805 6.015.951.41 1.693.655 2.271.839.954.303 1.823.26 2.51.158.765-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z"/>
              </svg>
              (11) 9999-9999
            </a>
          </div>

          <div className="footerSocials">
            <h3>Redes Sociais</h3>
            <p>Acompanhe as novidades da Grape Tools em todas as nossas redes.</p>
            <div className="footerSocialsIcons">
              <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="footerSocialIcon whats">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.031 7.807L0 32l8.418-2.003A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.79-1.857l-.486-.29-5.004 1.192 1.257-4.866-.317-.5A13.234 13.234 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.906c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.265.398-1.03 1.294-1.262 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.202-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.2-.233.265-.399.398-.665.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.265 0-.696.1-1.061.497-.365.398-1.394 1.362-1.394 3.325s1.427 3.856 1.626 4.122c.199.265 2.808 4.287 6.805 6.015.951.41 1.693.655 2.271.839.954.303 1.823.26 2.51.158.765-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.365-.265-.763-.464z"/>
                </svg>
              </a>
              <a href="https://instagram.com/grapetools" target="_blank" rel="noreferrer" aria-label="Instagram" className="footerSocialIcon insta">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com/grapetools" target="_blank" rel="noreferrer" aria-label="Facebook" className="footerSocialIcon face">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="https://tiktok.com/@grapetools" target="_blank" rel="noreferrer" aria-label="TikTok" className="footerSocialIcon tiktok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <span>© 2026 The Grape LTDA · Todos os direitos reservados · CNPJ 60.055.028/0001-58</span>
        <a href="https://grapeone.com.br" target="_blank" rel="noreferrer" className="footerDev">
          <span>Developed by</span>
          <img src="/grape-one-logo.png" alt="Grape One" className="footerDevLogo" />
        </a>
      </div>
    </footer>
  );
}
