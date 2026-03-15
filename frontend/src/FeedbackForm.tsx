import { useState, useCallback, useMemo, type FC, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { ForjamundoLogo, globalStyles } from "./shared";
import { useTranslation } from "./i18n";
import { LanguageToggle } from "./components/LanguageToggle";

const API_URL = import.meta.env.VITE_API_URL || "";

// ── Types ───────────────────────────────────────────────────────────
interface SessionData {
  gameName: string;
  date: string;
  playerName: string;
  playerCount: string;
  version: string;
  duration: string;
}

type Scales = Record<number, number | null>;
type OpenAnswers = Record<number, string>;

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// ── Subcomponents ───────────────────────────────────────────────────
const ScaleButton: FC<{
  value: number;
  selected: boolean;
  onClick: () => void;
}> = ({ value, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",
      border: `2px solid ${selected ? "var(--accent)" : "var(--border)"}`,
      background: selected ? "var(--accent)" : "transparent",
      color: selected ? "var(--bg)" : "var(--fg-muted)",
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontSize: "0.85rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: selected ? "0 0 12px rgba(98,60,21,0.35)" : "none",
    }}
    onMouseEnter={(e) => {
      if (!selected) {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color = "var(--accent)";
        e.currentTarget.style.background = "rgba(98,60,21,0.15)";
      }
    }}
    onMouseLeave={(e) => {
      if (!selected) {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--fg-muted)";
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    {value}
  </button>
);

// ── Main Component ──────────────────────────────────────────────────
const FeedbackForm: FC = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().split("T")[0];

  const [session, setSession] = useState<SessionData>({
    gameName: "",
    date: today,
    playerName: "",
    playerCount: "",
    version: "",
    duration: "",
  });

  const [scales, setScales] = useState<Scales>({});
  const [openAnswers, setOpenAnswers] = useState<OpenAnswers>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSessionChange = useCallback(
    (field: keyof SessionData) => (e: ChangeEvent<HTMLInputElement>) => {
      setSession((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleScale = useCallback((qNum: number, val: number) => {
    setScales((prev) => ({ ...prev, [qNum]: val }));
  }, []);

  const handleOpen = useCallback((qNum: number, val: string) => {
    setOpenAnswers((prev) => ({ ...prev, [qNum]: val }));
  }, []);

  // Progress
  const progress = useMemo(() => {
    const totalFields = t.feedback.scaleQuestions.length + t.feedback.openQuestions.length + 6;
    let filled = Object.keys(scales).length;
    filled += Object.values(openAnswers).filter((v) => v.trim()).length;
    filled += Object.values(session).filter((v) => v.trim()).length;
    return Math.min((filled / totalFields) * 100, 100);
  }, [scales, openAnswers, session, t.feedback.scaleQuestions.length, t.feedback.openQuestions.length]);

  // Submit
  const handleSubmit = useCallback(async () => {
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      sessao: {
        nomeDoJogo: session.gameName,
        data: session.date,
        seuNome: session.playerName,
        numeroDeJogadores: session.playerCount,
        versao: session.version,
        duracaoDaPartida: session.duration,
      },
      escalas: Object.fromEntries(
        t.feedback.scaleQuestions.map((q) => [q.title, scales[q.num] ?? null])
      ),
      perguntasAbertas: Object.fromEntries(
        t.feedback.openQuestions.map((q) => [q.title, openAnswers[q.num] ?? ""])
      ),
    };

    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }, [session, scales, openAnswers, t.feedback.scaleQuestions, t.feedback.openQuestions]);

  // Reset
  const handleReset = useCallback(() => {
    if (!confirm(t.feedback.clearConfirm)) return;
    setSession({
      gameName: "",
      date: today,
      playerName: "",
      playerCount: "",
      version: "",
      duration: "",
    });
    setScales({});
    setOpenAnswers({});
    setStatus("idle");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [today, t.feedback.clearConfirm]);

  if (status === "success") {
    return (
      <>
        <style>{globalStyles}</style>
        <style>{backButtonStyles}</style>
        <LanguageToggle />
        <div className="container" style={{ textAlign: "center", paddingTop: 120 }}>
          <ForjamundoLogo className="logo-svg" />
          <div style={{ fontSize: "3rem", marginTop: 32, marginBottom: 12 }}>🎲</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--accent)", marginBottom: 8 }}>
            {t.feedback.successTitle}
          </h2>
          <p style={{ color: "var(--fg-muted)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
            {t.feedback.successMessage}
          </p>
          <button className="btn btn-secondary" onClick={handleReset}>
            {t.feedback.submitAnother}
          </button>
          <div className="footer">
            {t.feedback.publisher}
            <br />
            <a href="https://forjamundo.com.br" target="_blank" rel="noreferrer">
              forjamundo.com.br
            </a>
          </div>
        </div>
        <Link to="/" className="back-fab">
          {t.landing.backToHome}
        </Link>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

      <LanguageToggle />

      {/* Progress bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: `${progress}%`,
          background: "var(--accent)",
          zIndex: 50,
          transition: "width 0.3s ease",
          boxShadow: "0 0 8px rgba(98,60,21,0.35)",
        }}
      />

      <div className="container">
        {/* Header */}
        <div className="header">
          <ForjamundoLogo className="logo-svg" />
          <h1>
            {t.feedback.pageTitle} <span>{t.feedback.pageTitleHighlight}</span>
          </h1>
          <p className="subtitle">{t.feedback.publisher}</p>
        </div>

        {/* Session */}
        <div className="section animate-in" style={{ animationDelay: "0s" }}>
          <div className="section-title">{t.feedback.sessionTitle}</div>
          <div className="field-grid">
            <div className="field">
              <label>{t.feedback.gameName}</label>
              <input
                type="text"
                value={session.gameName}
                onChange={handleSessionChange("gameName")}
                placeholder={t.feedback.gameNamePlaceholder}
              />
            </div>
            <div className="field">
              <label>{t.feedback.date}</label>
              <input
                type="date"
                value={session.date}
                onChange={handleSessionChange("date")}
              />
            </div>
            <div className="field">
              <label>{t.feedback.yourName}</label>
              <input
                type="text"
                value={session.playerName}
                onChange={handleSessionChange("playerName")}
                placeholder={t.feedback.yourNamePlaceholder}
              />
            </div>
            <div className="field">
              <label>{t.feedback.playerCount}</label>
              <input
                type="number"
                min={1}
                max={20}
                value={session.playerCount}
                onChange={handleSessionChange("playerCount")}
                placeholder={t.feedback.playerCountPlaceholder}
              />
            </div>
            <div className="field">
              <label>{t.feedback.version}</label>
              <input
                type="text"
                value={session.version}
                onChange={handleSessionChange("version")}
                placeholder={t.feedback.versionPlaceholder}
              />
              <span className="hint">{t.feedback.versionHint}</span>
            </div>
            <div className="field">
              <label>{t.feedback.duration}</label>
              <input
                type="text"
                value={session.duration}
                onChange={handleSessionChange("duration")}
                placeholder={t.feedback.durationPlaceholder}
              />
            </div>
          </div>
        </div>

        {/* Scale Questions */}
        <div className="section animate-in" style={{ animationDelay: "0.05s" }}>
          <div className="section-title">{t.feedback.scaleTitle}</div>
          <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: 20, fontWeight: 300 }}>
            {t.feedback.scaleHint}
          </p>
          {t.feedback.scaleQuestions.map((q) => (
            <div key={q.num} className="scale-question">
              <div className="q-header">
                <span className="q-number">{q.num}.</span>
                <span className="q-title">{q.title}</span>
              </div>
              <div className="q-desc">{q.desc}</div>
              <div className="scale-row">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <ScaleButton
                    key={n}
                    value={n}
                    selected={scales[q.num] === n}
                    onClick={() => handleScale(q.num, n)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Open Questions */}
        <div className="section animate-in" style={{ animationDelay: "0.1s" }}>
          <div className="section-title">{t.feedback.openTitle}</div>
          {t.feedback.openQuestions.map((q) => (
            <div key={q.num} className="open-question">
              <div className="q-header">
                <span className="q-number">{q.num}.</span>
                <span className="q-title">{q.title}</span>
              </div>
              <div className="q-desc">{q.desc}</div>
              <textarea
                value={openAnswers[q.num] ?? ""}
                onChange={(e) => handleOpen(q.num, e.target.value)}
                placeholder={t.feedback.openPlaceholder}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ textAlign: "center", marginTop: 8 }}>
          {status === "error" && (
            <div
              style={{
                background: "rgba(255,68,68,0.1)",
                border: "1px solid rgba(255,68,68,0.3)",
                borderRadius: 8,
                padding: "14px 20px",
                marginBottom: 20,
                color: "#ff6b6b",
                fontSize: "0.9rem",
              }}
            >
              {t.feedback.errorPrefix} {errorMsg}. {t.feedback.errorSuffix}
            </div>
          )}
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? t.feedback.submittingButton : t.feedback.submitButton}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              {t.feedback.clearButton}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          {t.feedback.publisher}
          <br />
          {t.feedback.footerCredit}
          <br />
          <a href="https://forjamundo.com.br" target="_blank" rel="noreferrer">
            forjamundo.com.br
          </a>
        </div>
      </div>

      <Link to="/" className="back-fab">
        {t.landing.backToHome}
      </Link>

      <style>{backButtonStyles}</style>
    </>
  );
};

const backButtonStyles = `
  .back-fab {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 100;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    padding: 14px 24px;
    border-radius: 8px;
    background: rgba(98, 60, 21, 0.9);
    color: #F6EDDF;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    transition: all 0.25s;
    backdrop-filter: blur(8px);
  }

  .back-fab:hover {
    background: #623C15;
    box-shadow: 0 6px 28px rgba(98, 60, 21, 0.4);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    .back-fab {
      bottom: 16px;
      left: 16px;
      right: 16px;
      text-align: center;
      font-size: 0.95rem;
      padding: 12px 18px;
    }
  }
`;

export default FeedbackForm;
