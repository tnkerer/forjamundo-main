import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { Resend } from "resend";
import { z } from "zod";
import path from "path";

// ── Config ──────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || "3001", 10);
const DB_PATH = process.env.DATABASE_PATH || "./feedback.db";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@forjamundo.com.br";
const TO_EMAIL = process.env.TO_EMAIL || "contato@forjamundo.com.br";

// Admin credentials
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "#Ph16019222";

// ── Database ────────────────────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    game_name   TEXT,
    session_date TEXT,
    player_name TEXT,
    player_count INTEGER,
    version     TEXT,
    duration    TEXT,
    scales      TEXT    NOT NULL,  -- JSON object
    open_answers TEXT   NOT NULL,  -- JSON object
    raw_json    TEXT    NOT NULL   -- full payload for safe keeping
  );

  CREATE TABLE IF NOT EXISTS subscribers (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    email       TEXT    NOT NULL UNIQUE
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO feedback (game_name, session_date, player_name, player_count, version, duration, scales, open_answers, raw_json)
  VALUES (@game_name, @session_date, @player_name, @player_count, @version, @duration, @scales, @open_answers, @raw_json)
`);

const insertSubscriber = db.prepare(`
  INSERT OR IGNORE INTO subscribers (email) VALUES (@email)
`);

// ── Validation ──────────────────────────────────────────────────────
const FeedbackSchema = z.object({
  sessao: z.object({
    nomeDoJogo: z.string().default(""),
    data: z.string().default(""),
    seuNome: z.string().default(""),
    numeroDeJogadores: z.union([z.string(), z.number()]).default(""),
    versao: z.string().default(""),
    duracaoDaPartida: z.string().default(""),
  }),
  escalas: z.record(z.string(), z.number().nullable()),
  perguntasAbertas: z.record(z.string(), z.string()),
});

const SubscribeSchema = z.object({
  email: z.string().email("Email inválido"),
});

// ── Basic Auth Middleware ───────────────────────────────────────────
function basicAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Access"');
    res.status(401).json({ message: "Autenticação necessária" });
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    next();
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Access"');
    res.status(401).json({ message: "Credenciais inválidas" });
  }
}

// ── Email (Resend) ──────────────────────────────────────────────────
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function sendNotificationEmail(data: z.infer<typeof FeedbackSchema>) {
  if (!resend) {
    console.log("⚠ Resend not configured — skipping email notification");
    return;
  }

  const scaleRows = Object.entries(data.escalas)
    .map(([label, val]) => {
      const score = val ?? "—";
      const bar = val ? "█".repeat(val) + "░".repeat(10 - val) : "—";
      return `<tr><td style="padding:6px 12px;border-bottom:1px solid #2a2a2a;color:#ccc;">${label}</td><td style="padding:6px 12px;border-bottom:1px solid #2a2a2a;text-align:center;color:#39ff14;font-weight:700;">${score}</td><td style="padding:6px 12px;border-bottom:1px solid #2a2a2a;font-family:monospace;color:#555;font-size:12px;">${bar}</td></tr>`;
    })
    .join("");

  const openRows = Object.entries(data.perguntasAbertas)
    .filter(([, v]) => v.trim())
    .map(
      ([label, val]) =>
        `<div style="margin-bottom:16px;"><strong style="color:#39ff14;">${label}</strong><p style="margin:4px 0 0;color:#ccc;line-height:1.6;">${val}</p></div>`
    )
    .join("");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0e0e0e;color:#e8e8e8;padding:32px;">
      <h1 style="color:#39ff14;font-size:24px;margin:0 0 4px;">Novo Feedback de Playtest</h1>
      <p style="color:#888;margin:0 0 24px;">Forjamundo Editora</p>

      <table style="width:100%;margin-bottom:24px;color:#ccc;font-size:14px;">
        <tr><td style="padding:4px 0;"><strong>Jogo:</strong> ${data.sessao.nomeDoJogo || "—"}</td><td style="padding:4px 0;"><strong>Data:</strong> ${data.sessao.data || "—"}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Playtester:</strong> ${data.sessao.seuNome || "Anônimo"}</td><td style="padding:4px 0;"><strong>Jogadores:</strong> ${data.sessao.numeroDeJogadores || "—"}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Versão:</strong> ${data.sessao.versao || "—"}</td><td style="padding:4px 0;"><strong>Duração:</strong> ${data.sessao.duracaoDaPartida || "—"}</td></tr>
      </table>

      <h2 style="color:#39ff14;font-size:16px;margin:0 0 12px;">Escalas</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
        ${scaleRows}
      </table>

      ${openRows ? `<h2 style="color:#39ff14;font-size:16px;margin:0 0 12px;">Perguntas Abertas</h2>${openRows}` : ""}

      <hr style="border:none;border-top:1px solid #2a2a2a;margin:24px 0;" />
      <p style="color:#555;font-size:12px;margin:0;">Enviado automaticamente pelo sistema de playtest — forjamundo.com.br</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `🎲 Playtest: ${data.sessao.nomeDoJogo || "Sem nome"} — ${data.sessao.seuNome || "Anônimo"}`,
      html,
    });
    console.log("✉ Email sent to", TO_EMAIL);
  } catch (err) {
    console.error("✉ Email failed:", err);
  }
}

// ── Express ─────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", feedbackCount: (db.prepare("SELECT COUNT(*) as c FROM feedback").get() as any).c });
});

// Submit feedback
app.post("/api/feedback", async (req, res) => {
  try {
    const parsed = FeedbackSchema.parse(req.body);
    const rawJson = JSON.stringify(parsed, null, 2);

    insertStmt.run({
      game_name: parsed.sessao.nomeDoJogo,
      session_date: parsed.sessao.data,
      player_name: parsed.sessao.seuNome,
      player_count: Number(parsed.sessao.numeroDeJogadores) || null,
      version: parsed.sessao.versao,
      duration: parsed.sessao.duracaoDaPartida,
      scales: JSON.stringify(parsed.escalas),
      open_answers: JSON.stringify(parsed.perguntasAbertas),
      raw_json: rawJson,
    });

    // Fire-and-forget email
    sendNotificationEmail(parsed).catch(console.error);

    res.status(201).json({ success: true, message: "Feedback recebido com sucesso!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: err.errors });
    } else {
      console.error("Server error:", err);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  }
});

// Subscribe to newsletter
app.post("/api/subscribe", (req, res) => {
  try {
    const parsed = SubscribeSchema.parse(req.body);
    const result = insertSubscriber.run({ email: parsed.email.toLowerCase() });

    if (result.changes === 0) {
      res.status(200).json({ success: true, message: "Email já cadastrado!" });
    } else {
      res.status(201).json({ success: true, message: "Email cadastrado com sucesso!" });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, message: err.errors[0]?.message || "Email inválido" });
    } else {
      console.error("Subscribe error:", err);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
  }
});

// List subscribers (protected)
app.get("/api/subscribers", basicAuth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC").all();
  res.json(rows);
});

// List feedback (protected)
app.get("/api/feedback", basicAuth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 100").all();
  res.json(rows);
});

// Export as CSV (protected)
app.get("/api/feedback/csv", basicAuth, (_req, res) => {
  const rows = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all() as any[];
  if (!rows.length) {
    res.status(404).send("No data");
    return;
  }

  const scaleKeys = Object.keys(JSON.parse(rows[0].scales));
  const openKeys = Object.keys(JSON.parse(rows[0].open_answers));

  const headers = [
    "id", "created_at", "game_name", "session_date", "player_name",
    "player_count", "version", "duration",
    ...scaleKeys,
    ...openKeys,
  ];

  const csvRows = rows.map((r) => {
    const scales = JSON.parse(r.scales);
    const opens = JSON.parse(r.open_answers);
    return [
      r.id, r.created_at, r.game_name, r.session_date, r.player_name,
      r.player_count, r.version, r.duration,
      ...scaleKeys.map((k) => scales[k] ?? ""),
      ...openKeys.map((k) => `"${(opens[k] || "").replace(/"/g, '""')}"`),
    ].join(",");
  });

  const csv = [headers.join(","), ...csvRows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=playtest_feedback.csv");
  res.send(csv);
});

// ── Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔨 Forjamundo Playtest API`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   DB: ${path.resolve(DB_PATH)}`);
  console.log(`   Email: ${resend ? "enabled" : "disabled (no RESEND_API_KEY)"}\n`);
});
