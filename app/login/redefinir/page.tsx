"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [temSessao, setTemSessao] = useState<boolean | null>(null);

  // Ao chegar pelo link, o /auth/callback já criou a sessão. Confirma que existe.
  useEffect(() => {
    (async () => {
      const { createClient } = await import("@/lib/supabase-client");
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setTemSessao(!!data.session);
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="loginField">
              <label>Confirmar nova senha</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repita a senha"
                required
                minLength={6}
                autoComplete="new-password"
              />
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
