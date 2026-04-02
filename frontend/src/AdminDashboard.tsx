import { useState, useEffect, useCallback, Fragment } from "react";
import type { FC } from "react";
import { globalStyles, ForjamundoLogo } from "./shared";

const API_URL = import.meta.env.VITE_API_URL || "";

// ── Types ─────────────────────────────────────────────────────────────────
interface Subscriber {
  id: number;
  created_at: string;
  email: string;
}

interface FeedbackRow {
  id: number;
  created_at: string;
  game_name: string;
  session_date: string;
  player_name: string;
  player_count: number | null;
  version: string;
  duration: string;
  scales: string;
  open_answers: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────
function makeAuth(user: string, pass: string) {
  return "Basic " + btoa(`${user}:${pass}`);
}

function fmtDateTime(s: string) {
  if (!s) return "—";
  try {
    const d = new Date(s.replace(" ", "T"));
    return d.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return s; }
}

function fmtDate(s: string) {
  if (!s) return "—";
  try {
    const d = new Date(s.includes("T") ? s : s + "T12:00:00");
    return d.toLocaleDateString("pt-BR");
  } catch { return s; }
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function subsToCsv(rows: Subscriber[]) {
  return [
    "id,email,inscrito_em",
    ...rows.map(r => `${r.id},"${r.email}","${r.created_at}"`),
  ].join("\n");
}

function feedbackRowToCsv(row: FeedbackRow) {
  const scales = JSON.parse(row.scales || "{}") as Record<string, number | null>;
  const opens = JSON.parse(row.open_answers || "{}") as Record<string, string>;
  const sk = Object.keys(scales);
  const ok = Object.keys(opens);
  const headers = [
    "id", "created_at", "game_name", "session_date", "player_name",
    "player_count", "version", "duration", ...sk, ...ok,
  ];
  const values = [
    row.id, `"${row.created_at}"`,
    `"${(row.game_name || "").replace(/"/g, '""')}"`,
    `"${(row.session_date || "").replace(/"/g, '""')}"`,
    `"${(row.player_name || "").replace(/"/g, '""')}"`,
    row.player_count ?? "",
    `"${(row.version || "").replace(/"/g, '""')}"`,
    `"${(row.duration || "").replace(/"/g, '""')}"`,
    ...sk.map(k => scales[k] ?? ""),
    ...ok.map(k => `"${(opens[k] || "").replace(/"/g, '""')}"`),
  ];
  return [headers.join(","), values.join(",")].join("\n");
}

// ── Styles ────────────────────────────────────────────────────────────────
const dashStyles = `
  .dash-wrap {
    position: relative;
    z-index: 1;
    max-width: 1060px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .dash-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .dash-header .logo-svg {
    width: 110px;
    height: auto;
    fill: var(--accent);
  }

  .dash-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 0.08em;
    color: var(--fg);
    flex: 1;
  }

  .dash-title span { color: var(--accent); }

  .logout-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    padding: 8px 18px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--fg-muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .logout-btn:hover { border-color: var(--fg-muted); color: var(--fg); }

  .tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 24px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 4px;
    width: fit-content;
  }

  .tab-btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    padding: 8px 24px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--fg-muted);
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-btn.active {
    background: var(--accent);
    color: var(--bg);
  }

  .tab-badge {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    background: rgba(255,255,255,0.25);
    border-radius: 20px;
    padding: 1px 7px;
    line-height: 1.4;
  }

  .tab-btn:not(.active) .tab-badge {
    background: var(--accent-dim);
    color: var(--accent);
  }

  .panel { animation: fadeInUp 0.3s ease both; }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .toolbar-info { font-size: 0.85rem; color: var(--fg-muted); }
  .toolbar-info strong { color: var(--fg); font-size: 1rem; }

  .toolbar-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  .btn-sm {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    padding: 7px 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
  }

  .btn-sm:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-sm-primary { background: var(--accent); color: var(--bg); }
  .btn-sm-primary:not(:disabled):hover {
    box-shadow: 0 0 12px var(--accent-glow);
    transform: translateY(-1px);
  }

  .btn-sm-ghost {
    background: transparent;
    color: var(--fg-muted);
    border: 1px solid var(--border);
  }
  .btn-sm-ghost:hover { border-color: var(--fg-muted); color: var(--fg); }

  .btn-sm-danger {
    background: transparent;
    color: #b42828;
    border: 1px solid rgba(180,40,40,0.3);
  }
  .btn-sm-danger:hover { background: rgba(180,40,40,0.08); border-color: #b42828; }

  .table-wrap {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }

  .data-table thead th {
    background: rgba(98,60,21,0.08);
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: var(--accent);
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }

  .data-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }

  .data-table tbody tr:last-child { border-bottom: none; }
  .data-table tbody tr:hover { background: rgba(98,60,21,0.03); }
  .data-table tbody tr.expanded-row { background: rgba(98,60,21,0.05); }

  .data-table td {
    padding: 11px 16px;
    color: var(--fg);
    vertical-align: middle;
  }

  .td-muted { color: var(--fg-muted); font-size: 0.8rem; }
  .td-actions { white-space: nowrap; }
  .td-actions-inner { display: flex; gap: 6px; justify-content: flex-end; }

  .id-chip {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    color: var(--fg-muted);
    background: var(--border);
    border-radius: 4px;
    padding: 2px 6px;
  }

  .expand-row-content {
    background: rgba(246, 237, 223, 0.6);
    border-bottom: 2px solid var(--accent);
  }

  .expand-inner {
    padding: 20px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  @media (max-width: 700px) {
    .expand-inner { grid-template-columns: 1fr; }
  }

  .expand-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--border);
  }

  .scale-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
    font-size: 0.8rem;
  }

  .scale-lbl {
    flex: 1;
    color: var(--fg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .scale-val {
    font-weight: 700;
    color: var(--accent);
    min-width: 20px;
    text-align: right;
    font-size: 0.9rem;
  }

  .scale-bar {
    width: 70px;
    height: 5px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .scale-bar-fill { height: 100%; border-radius: 3px; background: var(--accent); }

  .open-item { margin-bottom: 14px; }
  .open-item:last-child { margin-bottom: 0; }

  .open-lbl {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--fg-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 4px;
  }

  .open-text {
    font-size: 0.83rem;
    color: var(--fg);
    line-height: 1.55;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 8px 12px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .open-empty { color: var(--fg-muted); font-style: italic; }

  .empty-state {
    padding: 48px 24px;
    text-align: center;
    color: var(--fg-muted);
    font-size: 0.9rem;
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 8px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .row-clickable { cursor: pointer; user-select: none; }

  /* Login */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .login-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 48px 40px;
    width: 100%;
    max-width: 380px;
    text-align: center;
  }

  .login-card .logo-svg {
    width: 150px;
    height: auto;
    fill: var(--accent);
    margin-bottom: 20px;
  }

  .login-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.08em;
    margin-bottom: 4px;
  }

  .login-sub { font-size: 0.85rem; color: var(--fg-muted); margin-bottom: 28px; }

  .lf { margin-bottom: 14px; text-align: left; }

  .lf label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--fg-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 5px;
  }

  .lf input {
    width: 100%;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    color: var(--fg);
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .lf input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-dim);
  }

  .login-err {
    background: rgba(180,40,40,0.08);
    border: 1px solid rgba(180,40,40,0.25);
    border-radius: 6px;
    padding: 9px 14px;
    font-size: 0.85rem;
    color: #b42828;
    margin-bottom: 12px;
    text-align: left;
  }

  .login-btn { width: 100%; margin-top: 4px; }

  @media (max-width: 600px) {
    .dash-title { font-size: 1.4rem; }
    .data-table { font-size: 0.8rem; }
    .data-table td, .data-table thead th { padding: 9px 12px; }
    .login-card { padding: 36px 24px; }
  }
`;

// ── Login Form ────────────────────────────────────────────────────────────
const LoginForm: FC<{
  onLogin: (user: string, pass: string) => Promise<boolean>;
}> = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await onLogin(user, pass);
    if (!ok) {
      setError("Usuário ou senha incorretos.");
      setLoading(false);
    }
  }

  return (
    <>
      <style>{globalStyles}</style>
      <style>{dashStyles}</style>
      <div className="login-wrap">
        <div className="login-card animate-in">
          <ForjamundoLogo className="logo-svg" />
          <div className="login-title">Dashboard Admin</div>
          <div className="login-sub">Área restrita</div>
          <form onSubmit={handleSubmit}>
            <div className="lf">
              <label htmlFor="adm-user">Usuário</label>
              <input
                id="adm-user"
                type="text"
                value={user}
                onChange={e => setUser(e.target.value)}
                autoFocus
                required
                autoComplete="username"
              />
            </div>
            <div className="lf">
              <label htmlFor="adm-pass">Senha</label>
              <input
                id="adm-pass"
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="login-err">{error}</div>}
            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? "Autenticando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

// ── Expanded Feedback Detail ──────────────────────────────────────────────
const ExpandedFeedback: FC<{ row: FeedbackRow }> = ({ row }) => {
  const scales = JSON.parse(row.scales || "{}") as Record<string, number | null>;
  const opens = JSON.parse(row.open_answers || "{}") as Record<string, string>;

  return (
    <div className="expand-inner">
      <div>
        <div className="expand-title">Escalas</div>
        {Object.entries(scales).map(([lbl, val]) => (
          <div key={lbl} className="scale-row">
            <div className="scale-lbl" title={lbl}>{lbl}</div>
            <div className="scale-val">{val ?? "—"}</div>
            {val !== null && (
              <div className="scale-bar">
                <div className="scale-bar-fill" style={{ width: `${(val / 10) * 100}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <div className="expand-title">Respostas Abertas</div>
        {Object.entries(opens).map(([lbl, val]) => (
          <div key={lbl} className="open-item">
            <div className="open-lbl">{lbl}</div>
            <div className="open-text">
              {val?.trim()
                ? val
                : <span className="open-empty">Não respondida</span>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Subscribers Tab ───────────────────────────────────────────────────────
const SubscribersTab: FC<{
  rows: Subscriber[];
  loading: boolean;
  onDelete: (id: number) => void;
  onExport: () => void;
}> = ({ rows, loading, onDelete, onExport }) => (
  <div className="panel">
    <div className="toolbar">
      <div className="toolbar-info">
        {loading
          ? <><span className="spinner" />Carregando…</>
          : <><strong>{rows.length}</strong> inscrito{rows.length !== 1 ? "s" : ""}</>
        }
      </div>
      <div className="toolbar-actions">
        <button
          className="btn-sm btn-sm-primary"
          onClick={onExport}
          disabled={rows.length === 0}
        >
          ↓ Exportar CSV
        </button>
      </div>
    </div>

    <div className="table-wrap">
      {rows.length === 0 && !loading
        ? <div className="empty-state">Nenhum inscrito encontrado.</div>
        : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Inscrito em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.id}>
                  <td><span className="id-chip">#{s.id}</span></td>
                  <td>{s.email}</td>
                  <td className="td-muted">{fmtDateTime(s.created_at)}</td>
                  <td className="td-actions">
                    <div className="td-actions-inner">
                      <button
                        className="btn-sm btn-sm-danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  </div>
);

// ── Feedback Tab ──────────────────────────────────────────────────────────
const FeedbackTab: FC<{
  rows: FeedbackRow[];
  loading: boolean;
  expandedId: number | null;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onExportAll: () => void;
  onExportOne: (row: FeedbackRow) => void;
}> = ({ rows, loading, expandedId, onToggle, onDelete, onExportAll, onExportOne }) => (
  <div className="panel">
    <div className="toolbar">
      <div className="toolbar-info">
        {loading
          ? <><span className="spinner" />Carregando…</>
          : <>
              <strong>{rows.length}</strong> feedback{rows.length !== 1 ? "s" : ""}
              {rows.length === 100 && <> &nbsp;·&nbsp; mostrando os últimos 100; use <em>Exportar Tudo</em> para todos os registros</>}
            </>
        }
      </div>
      <div className="toolbar-actions">
        <button
          className="btn-sm btn-sm-primary"
          onClick={onExportAll}
          disabled={rows.length === 0}
        >
          ↓ Exportar Tudo (CSV)
        </button>
      </div>
    </div>

    <div className="table-wrap">
      {rows.length === 0 && !loading
        ? <div className="empty-state">Nenhum feedback encontrado.</div>
        : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Jogo</th>
                <th>Playtester</th>
                <th>Jogadores</th>
                <th>Versão</th>
                <th>Data sessão</th>
                <th>Recebido em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <Fragment key={row.id}>
                  <tr
                    className={`row-clickable${expandedId === row.id ? " expanded-row" : ""}`}
                    onClick={() => onToggle(row.id)}
                  >
                    <td><span className="id-chip">#{row.id}</span></td>
                    <td>{row.game_name || <span className="td-muted">—</span>}</td>
                    <td>{row.player_name || <span className="td-muted">Anônimo</span>}</td>
                    <td className="td-muted">{row.player_count ?? "—"}</td>
                    <td className="td-muted">{row.version || "—"}</td>
                    <td className="td-muted">{fmtDate(row.session_date)}</td>
                    <td className="td-muted">{fmtDateTime(row.created_at)}</td>
                    <td
                      className="td-actions"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="td-actions-inner">
                        <button
                          className="btn-sm btn-sm-ghost"
                          onClick={() => onExportOne(row)}
                        >
                          ↓ CSV
                        </button>
                        <button
                          className="btn-sm btn-sm-danger"
                          onClick={() => onDelete(row.id)}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === row.id && (
                    <tr className="expand-row-content">
                      <td colSpan={8}>
                        <ExpandedFeedback row={row} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  </div>
);

// ── Dashboard Shell ───────────────────────────────────────────────────────
const DashboardShell: FC<{ auth: string; onLogout: () => void }> = ({ auth, onLogout }) => {
  const [tab, setTab] = useState<"subscribers" | "feedback">("subscribers");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingFb, setLoadingFb] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const headers = { Authorization: auth };

  const loadSubscribers = useCallback(async () => {
    setLoadingSubs(true);
    try {
      const r = await fetch(`${API_URL}/api/subscribers`, { headers });
      if (r.status === 401) { onLogout(); return; }
      if (r.ok) setSubscribers(await r.json());
    } finally { setLoadingSubs(false); }
  }, [auth]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFeedback = useCallback(async () => {
    setLoadingFb(true);
    try {
      const r = await fetch(`${API_URL}/api/feedback`, { headers });
      if (r.status === 401) { onLogout(); return; }
      if (r.ok) setFeedback(await r.json());
    } finally { setLoadingFb(false); }
  }, [auth]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadSubscribers(); }, [loadSubscribers]);
  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  async function handleDeleteSub(id: number) {
    if (!confirm("Deletar este inscrito permanentemente?")) return;
    const r = await fetch(`${API_URL}/api/subscribers/${id}`, { method: "DELETE", headers });
    if (r.status === 401) { onLogout(); return; }
    if (r.ok) setSubscribers(prev => prev.filter(s => s.id !== id));
  }

  async function handleDeleteFb(id: number) {
    if (!confirm("Deletar este feedback permanentemente?")) return;
    const r = await fetch(`${API_URL}/api/feedback/${id}`, { method: "DELETE", headers });
    if (r.status === 401) { onLogout(); return; }
    if (r.ok) {
      setFeedback(prev => prev.filter(f => f.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  }

  async function handleExportAllFb() {
    const r = await fetch(`${API_URL}/api/feedback/csv`, { headers });
    if (r.status === 401) { onLogout(); return; }
    if (r.ok) downloadCsv(await r.text(), "playtest_feedback.csv");
  }

  return (
    <>
      <style>{globalStyles}</style>
      <style>{dashStyles}</style>
      <div className="dash-wrap">
        <div className="dash-header">
          <ForjamundoLogo className="logo-svg" />
          <div className="dash-title">Dashboard <span>Admin</span></div>
          <button className="logout-btn" onClick={onLogout}>Sair</button>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn${tab === "subscribers" ? " active" : ""}`}
            onClick={() => setTab("subscribers")}
          >
            Inscritos
            <span className="tab-badge">{subscribers.length}</span>
          </button>
          <button
            className={`tab-btn${tab === "feedback" ? " active" : ""}`}
            onClick={() => setTab("feedback")}
          >
            Feedbacks
            <span className="tab-badge">{feedback.length}</span>
          </button>
        </div>

        {tab === "subscribers" && (
          <SubscribersTab
            rows={subscribers}
            loading={loadingSubs}
            onDelete={handleDeleteSub}
            onExport={() => downloadCsv(subsToCsv(subscribers), "inscritos.csv")}
          />
        )}

        {tab === "feedback" && (
          <FeedbackTab
            rows={feedback}
            loading={loadingFb}
            expandedId={expandedId}
            onToggle={id => setExpandedId(prev => prev === id ? null : id)}
            onDelete={handleDeleteFb}
            onExportAll={handleExportAllFb}
            onExportOne={row => downloadCsv(feedbackRowToCsv(row), `feedback_${row.id}.csv`)}
          />
        )}
      </div>
    </>
  );
};

// ── Root Export ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [auth, setAuth] = useState<string | null>(() =>
    sessionStorage.getItem("admin-auth")
  );

  async function handleLogin(user: string, pass: string): Promise<boolean> {
    const a = makeAuth(user, pass);
    try {
      const r = await fetch(`${API_URL}/api/subscribers`, {
        headers: { Authorization: a },
      });
      if (r.ok) {
        sessionStorage.setItem("admin-auth", a);
        setAuth(a);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin-auth");
    setAuth(null);
  }

  if (!auth) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <DashboardShell auth={auth} onLogout={handleLogout} />;
}
