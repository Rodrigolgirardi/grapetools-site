"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { createClient } = await import("@/lib/supabase-client");
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/login/redefinir`,
      });
      if (error) throw error;
      setSuccess(
        "Se este email tiver conta, enviamos um link para redefinir a senha. Confira sua caixa de entrada (e o spam)."
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("rate limit")) setError("Muitas tentativas. Aguarde alguns minutos.");
      else setError("Não foi possível enviar o email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo"><Logo /></div>
        <h1 style={{ fontSize: "1.25rem", textAlign: "center", marginBottom: 4 }}>
          Recuperar senha
        </h1>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "0.9375rem", marginBottom: 20 }}>
          Digite seu email e enviaremos um link para criar uma nova senha.
        </p>
        {error && <div className="loginError">⚠ {error}</div>}
        {success && <div className="loginSuccess">✓ {success}</div>}
        {!success && (
          <form onSubmit={handleSubmit} className="loginForm">
            <div className="loginField">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <button type="submit" className="loginSubmit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        )}
        <p className="loginFooterNote">
          <a href="/login">← Voltar para o login</a>
        </p>
      </div>
    </div>
  );
}
