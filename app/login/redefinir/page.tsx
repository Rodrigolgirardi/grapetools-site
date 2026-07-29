"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  // Um toggle só para os dois campos: quem clica no olho quer conferir o que
  // digitou — esconder um e mostrar o outro não ajuda em nada.
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [temSessao, setTemSessao] = useState<boolean | null>(null);

  // O link de recuperação chega com os tokens no fragmento da URL; ao instanciar
  // o cliente do Supabase, ele lê o fragmento e abre a sessão. Aqui só conferimos
  // que deu certo — e limpamos o fragmento, senão o access_token fica à vista na
  // barra de endereço e no histórico do navegador.
  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase-client");
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setTemSessao(!!data.session);
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import("@/lib/supabase-client");
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo"><Logo /></div>
        <h1 style={{ fontSize: "1.25rem", textAlign: "center", marginBottom: 20 }}>
          Criar nova senha
        </h1>

        {temSessao === false && (
          <div className="loginError">
            ⚠ Link inválido ou expirado. <a href="/login/recuperar">Pedir um novo link</a>.
          </div>
        )}
        {error && <div className="loginError">⚠ {error}</div>}
        {success && <div className="loginSuccess">✓ Senha alterada! Redirecionando...</div>}

        {temSessao && !success && (
          <form onSubmit={handleSubmit} className="loginForm">
            <div className="loginField">
              <label>Nova senha</label>
              <div className="loginPasswordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="loginPasswordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    /* olho fechado */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    /* olho aberto */
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="loginField">
              <label>Confirmar nova senha</label>
              <div className="loginPasswordWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>
            <button type="submit" className="loginSubmit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
