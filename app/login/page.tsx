"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "cadastro">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { createClient } = await import("@/lib/supabase-client");
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { nome } },
        });
        if (error) throw error;
        setSuccess("Conta criada! Verifique seu email para confirmar.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "Invalid login credentials") setError("Email ou senha incorretos.");
      else if (msg === "User already registered") setError("Este email já está cadastrado.");
      else if (msg.includes("rate limit")) setError("Muitas tentativas. Aguarde alguns minutos.");
      else if (msg.includes("invalid")) setError("Email inválido. Use um email real.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const { createClient } = await import("@/lib/supabase-client");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/` },
    });
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <div className="loginLogo"><Logo /></div>
        <div className="loginTabs">
          <button className={`loginTab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); setSuccess(""); setShowPassword(false); }}>Entrar</button>
          <button className={`loginTab ${mode === "cadastro" ? "active" : ""}`}
            onClick={() => { setMode("cadastro"); setError(""); setSuccess(""); setShowPassword(false); }}>Criar conta</button>
        </div>
        {error && <div className="loginError">⚠ {error}</div>}
        {success && <div className="loginSuccess">✓ {success}</div>}
        <form onSubmit={handleSubmit} className="loginForm">
          {mode === "cadastro" && (
            <div className="loginField">
              <label>Nome completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                placeholder="Seu nome" required autoComplete="name" />
            </div>
          )}
          <div className="loginField">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" required autoComplete="email" />
          </div>
          <div className="loginField">
            <div className="loginFieldLabelRow">
              <label>Senha</label>
              {mode === "login" && <a href="/login/recuperar" className="loginForgot">Esqueci minha senha</a>}
            </div>
            <div className="loginPasswordWrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={mode === "cadastro" ? "Mínimo 6 caracteres" : "Sua senha"}
                required
                minLength={6}
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
          <button type="submit" className="loginSubmit" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        <div className="loginDivider"><span>ou</span></div>
        <button className="loginGoogle" onClick={handleGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </button>
        <p className="loginFooterNote">
          Ao continuar você concorda com nossa{" "}
          <a href="/politica-de-privacidade">Política de Privacidade</a>
        </p>
      </div>
    </div>
  );
}
