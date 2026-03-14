import { useState, useCallback, useMemo, type FC, type ChangeEvent } from "react";
import { ForjamundoLogo, globalStyles } from "./shared";

// ── Data ────────────────────────────────────────────────────────────
const SCALE_QUESTIONS = [
  { num: 1, title: "Diversão Geral", desc: "Quão divertido foi jogar este jogo?" },
  { num: 2, title: "Engajamento", desc: "Você se sentiu envolvido e interessado durante toda a partida?" },
  { num: 3, title: "Clareza das Regras", desc: "As regras foram fáceis de entender e seguir?" },
  { num: 4, title: "Fluidez do Turno", desc: "O jogo fluiu bem, sem pausas longas ou confusão entre os turnos?" },
  { num: 5, title: "Agência do Jogador", desc: "Você sentiu que suas decisões importavam para o resultado?" },
  { num: 6, title: "Equilíbrio", desc: "O jogo pareceu justo e equilibrado entre os jogadores?" },
  { num: 7, title: "Temática", desc: "O tema do jogo ficou claro e envolvente durante a partida?" },
  { num: 8, title: "Ritmo / Pacing", desc: "A duração do jogo pareceu adequada? (1 = muito longo, 10 = perfeito)" },
  { num: 9, title: "Tensão e Emoção", desc: "Você sentiu que a partida foi disputada e emocionante?" },
  { num: 10, title: "Interação entre Jogadores", desc: "Houve interação suficiente e interessante entre os jogadores?" },
  { num: 11, title: "Curva de Aprendizado", desc: "Quão rápido você se sentiu confortável jogando?" },
  { num: 12, title: "Rejogabilidade", desc: "Você gostaria de jogar este jogo novamente?" },
  { num: 13, title: "Componentes e Usabilidade", desc: "Os componentes foram práticos e fáceis de usar?" },
  { num: 14, title: "Impressão Geral", desc: "Qual sua nota geral para este jogo nesta sessão?" },
] as const;

const OPEN_QUESTIONS = [
  { num: 15, title: "Momento Memorável", desc: "Qual foi o momento mais memorável e/ou divertido da partida? Descreva o que aconteceu." },
  { num: 16, title: "Frustrações", desc: "O que mais te frustrou ou confundiu durante o jogo? Descreva a situação." },
  { num: 17, title: "Sugestão de Mudança", desc: "Se você pudesse mudar uma única coisa no jogo, o que mudaria e por quê?" },
  { num: 18, title: "Elevator Pitch", desc: "Como você descreveria este jogo para um amigo que nunca jogou?" },
] as const;

const API_URL = import.meta.env.VITE_API_URL || "";

// ── Types ───────────────────────────────────────────────────────────
interface SessionData {
  nomeDoJogo: string;
  data: string;
  seuNome: string;
  numeroDeJogadores: string;
  versao: string;
  duracaoDaPartida: string;
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
  const today = new Date().toISOString().split("T")[0];

  const [session, setSession] = useState<SessionData>({
    nomeDoJogo: "",
    data: today,
    seuNome: "",
    numeroDeJogadores: "",
    versao: "",
    duracaoDaPartida: "",
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
    const totalFields = SCALE_QUESTIONS.length + OPEN_QUESTIONS.length + 6;
    let filled = Object.keys(scales).length;
    filled += Object.values(openAnswers).filter((v) => v.trim()).length;
    filled += Object.values(session).filter((v) => v.trim()).length;
    return Math.min((filled / totalFields) * 100, 100);
  }, [scales, openAnswers, session]);

  // Submit
  const handleSubmit = useCallback(async () => {
    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      sessao: session,
      escalas: Object.fromEntries(
        SCALE_QUESTIONS.map((q) => [q.title, scales[q.num] ?? null])
      ),
      perguntasAbertas: Object.fromEntries(
        OPEN_QUESTIONS.map((q) => [q.title, openAnswers[q.num] ?? ""])
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
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    }
  }, [session, scales, openAnswers]);

  // Reset
  const handleReset = useCallback(() => {
    if (!confirm("Tem certeza que deseja limpar todas as respostas?")) return;
    setSession({
      nomeDoJogo: "",
      data: today,
      seuNome: "",
      numeroDeJogadores: "",
      versao: "",
      duracaoDaPartida: "",
    });
    setScales({});
    setOpenAnswers({});
    setStatus("idle");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [today]);

  if (status === "success") {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="container" style={{ textAlign: "center", paddingTop: 120 }}>
          <ForjamundoLogo className="logo-svg" />
          <div style={{ fontSize: "3rem", marginTop: 32, marginBottom: 12 }}>🎲</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "var(--accent)", marginBottom: 8 }}>
            Feedback Enviado!
          </h2>
          <p style={{ color: "var(--fg-muted)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
            Obrigado por dedicar seu tempo. Suas respostas são essenciais para
            melhorarmos o jogo.
          </p>
          <button className="btn btn-secondary" onClick={handleReset}>
            Enviar Outro Feedback
          </button>
          <div className="footer">
            Forjamundo Editora
            <br />
            <a href="https://forjamundo.com.br" target="_blank" rel="noreferrer">
              forjamundo.com.br
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>

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
            Formulário de Avaliação de <span>Playtest</span>
          </h1>
          <p className="subtitle">Forjamundo Editora</p>
        </div>

        {/* Session */}
        <div className="section animate-in" style={{ animationDelay: "0s" }}>
          <div className="section-title">Dados da Sessão</div>
          <div className="field-grid">
            <div className="field">
              <label>Nome do Jogo</label>
              <input
                type="text"
                value={session.nomeDoJogo}
                onChange={handleSessionChange("nomeDoJogo")}
                placeholder="Ex: Folkloria"
              />
            </div>
            <div className="field">
              <label>Data</label>
              <input
                type="date"
                value={session.data}
                onChange={handleSessionChange("data")}
              />
            </div>
            <div className="field">
              <label>Seu Nome</label>
              <input
                type="text"
                value={session.seuNome}
                onChange={handleSessionChange("seuNome")}
                placeholder="Nome do playtester"
              />
            </div>
            <div className="field">
              <label>Número de Jogadores</label>
              <input
                type="number"
                min={1}
                max={20}
                value={session.numeroDeJogadores}
                onChange={handleSessionChange("numeroDeJogadores")}
                placeholder="Ex: 4"
              />
            </div>
            <div className="field">
              <label>Versão / Iteração</label>
              <input
                type="text"
                value={session.versao}
                onChange={handleSessionChange("versao")}
                placeholder="Ex: v3.2"
              />
              <span className="hint">Caso não tenha certeza, deixe em branco.</span>
            </div>
            <div className="field">
              <label>Duração da Partida</label>
              <input
                type="text"
                value={session.duracaoDaPartida}
                onChange={handleSessionChange("duracaoDaPartida")}
                placeholder="Ex: 45 min"
              />
            </div>
          </div>
        </div>

        {/* Scale Questions */}
        <div className="section animate-in" style={{ animationDelay: "0.05s" }}>
          <div className="section-title">Avaliação em Escala</div>
          <p style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginBottom: 20, fontWeight: 300 }}>
            1 = Muito Ruim &nbsp;/&nbsp; 10 = Excelente
          </p>
          {SCALE_QUESTIONS.map((q) => (
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
          <div className="section-title">Perguntas Abertas</div>
          {OPEN_QUESTIONS.map((q) => (
            <div key={q.num} className="open-question">
              <div className="q-header">
                <span className="q-number">{q.num}.</span>
                <span className="q-title">{q.title}</span>
              </div>
              <div className="q-desc">{q.desc}</div>
              <textarea
                value={openAnswers[q.num] ?? ""}
                onChange={(e) => handleOpen(q.num, e.target.value)}
                placeholder="Escreva sua resposta aqui..."
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
              Erro ao enviar: {errorMsg}. Tente novamente.
            </div>
          )}
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Enviando..." : "Enviar Feedback"}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Limpar Formulário
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          Forjamundo Editora
          <br />
          Baseado nas metodologias de Jamey Stegmaier (Stonemaier Games) e Adam
          Porter (Adam in Wales)
          <br />
          <a href="https://forjamundo.com.br" target="_blank" rel="noreferrer">
            forjamundo.com.br
          </a>
        </div>
      </div>
    </>
  );
};

export default FeedbackForm;
