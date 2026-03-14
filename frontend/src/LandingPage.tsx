import { useState, type FC, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ForjamundoLogo } from "./shared";

const API_URL = import.meta.env.VITE_API_URL || "";

const LandingPage: FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  return (
    <>
      <style>{landingStyles}</style>

      <div className="landing-bg">
        <div className="landing-overlay" />

        <div className="landing-content">
          <ForjamundoLogo className="landing-logo" />

          <h1 className="landing-title">Em Construção</h1>
          <p className="landing-subtitle">
            Estamos preparando algo incrível para você. Em breve, novidades!
          </p>

          <div className="subscribe-section">
            <h2 className="subscribe-title">Fique por dentro</h2>
            <p className="subscribe-desc">
              Deixe seu e-mail para receber novidades sobre nossos jogos e lançamentos.
            </p>

            {status === "success" ? (
              <div className="success-message">
                Obrigado! Você receberá nossas novidades em breve.
              </div>
            ) : (
              <form className="subscribe-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "submitting"}
                />
                <button type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? "Enviando..." : "Cadastrar"}
                </button>
              </form>
            )}

            {status === "error" && (
              <div className="error-message">
                {errorMsg || "Erro ao cadastrar. Tente novamente."}
              </div>
            )}
          </div>

          <div className="landing-footer">
            <a href="https://forjamundo.com.br" target="_blank" rel="noreferrer">
              forjamundo.com.br
            </a>
          </div>
        </div>

        <Link to="/feedback" className="feedback-fab">
          Acessar Folha de Feedback →
        </Link>
      </div>
    </>
  );
};

const landingStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .landing-bg {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('/background.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
  }

  .landing-overlay {
    position: absolute;
    inset: 0;
    background: rgba(246, 237, 223, 0.8);
    pointer-events: none;
  }

  .landing-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 40px 24px;
    max-width: 500px;
    width: 100%;
  }

  .landing-logo {
    width: 220px;
    height: auto;
    fill: #623C15;
    margin-bottom: 40px;
    filter: drop-shadow(0 0 20px rgba(98, 60, 21, 0.3));
  }

  .landing-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 8vw, 4rem);
    color: #3a3a3a;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }

  .landing-subtitle {
    font-size: 1.1rem;
    color: #666;
    font-weight: 300;
    margin-bottom: 60px;
    line-height: 1.6;
  }

  .subscribe-section {
    background: rgba(239, 230, 216, 0.95);
    border: 1px solid #d4c9b8;
    border-radius: 12px;
    padding: 32px 28px;
    backdrop-filter: blur(10px);
  }

  .subscribe-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.4rem;
    color: #623C15;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .subscribe-desc {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 24px;
    font-weight: 300;
  }

  .subscribe-form {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .subscribe-form input {
    flex: 1;
    min-width: 200px;
    background: #fff;
    border: 1px solid #d4c9b8;
    border-radius: 6px;
    padding: 14px 18px;
    color: #3a3a3a;
    font-family: inherit;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .subscribe-form input:focus {
    border-color: #623C15;
    box-shadow: 0 0 0 2px rgba(98, 60, 21, 0.15);
  }

  .subscribe-form input::placeholder {
    color: #999;
  }

  .subscribe-form button {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    padding: 14px 32px;
    border-radius: 6px;
    border: none;
    background: #623C15;
    color: #F6EDDF;
    cursor: pointer;
    transition: all 0.25s;
  }

  .subscribe-form button:hover:not(:disabled) {
    box-shadow: 0 0 20px rgba(98, 60, 21, 0.35), 0 4px 16px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }

  .subscribe-form button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .success-message {
    background: rgba(98, 60, 21, 0.1);
    border: 1px solid rgba(98, 60, 21, 0.3);
    border-radius: 8px;
    padding: 16px 20px;
    color: #623C15;
    font-size: 0.95rem;
  }

  .error-message {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid rgba(255, 68, 68, 0.3);
    border-radius: 8px;
    padding: 12px 16px;
    margin-top: 16px;
    color: #c0392b;
    font-size: 0.9rem;
  }

  .landing-footer {
    margin-top: 48px;
    font-size: 0.85rem;
  }

  .landing-footer a {
    color: #623C15;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .landing-footer a:hover {
    opacity: 0.8;
  }

  .feedback-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 0.08em;
    padding: 16px 28px;
    border-radius: 8px;
    background: #623C15;
    color: #F6EDDF;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    transition: all 0.25s;
  }

  .feedback-fab:hover {
    background: #7a4a1a;
    box-shadow: 0 6px 28px rgba(98, 60, 21, 0.4);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    .feedback-fab {
      bottom: 16px;
      right: 16px;
      left: 16px;
      text-align: center;
      font-size: 1rem;
      padding: 14px 20px;
    }
  }
`;

export default LandingPage;
