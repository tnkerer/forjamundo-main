# Forjamundo — Playtest Feedback System

Sistema de coleta de feedback de playtest da Forjamundo Editora.

## Arquitetura

```
playtest-feedback/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── App.tsx    # Formulário interativo
│       └── main.tsx   # Entry point
├── backend/           # Express + TypeScript + SQLite
│   └── src/
│       └── index.ts   # API + email (Resend)
└── railway.json       # Deploy config
```

## Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express, better-sqlite3, Resend (email)
- **Database**: SQLite (lightweight, zero-config, persists on Railway volume)
- **Deploy**: Railway (monorepo com dois services)

## Setup Local

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Editar com suas keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Deploy no Railway

1. Criar novo projeto no Railway
2. Conectar o repo do GitHub
3. Criar dois services:
   - **backend**: Root Directory = `backend`, Start Command = `npm run start`
   - **frontend**: Root Directory = `frontend`, Start Command = `npm run preview -- --host --port $PORT`
4. No backend, adicionar volume montado em `/data` para persistir o SQLite
5. Configurar variáveis de ambiente no backend:
   - `RESEND_API_KEY` — API key do Resend (https://resend.com)
   - `FROM_EMAIL`
   - `TO_EMAIL`
   - `DATABASE_PATH` — /data/feedback.db
   - `CORS_ORIGIN` — URL do frontend no Railway

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3001` |
| `DATABASE_PATH` | Caminho do SQLite | `./feedback.db` |
| `RESEND_API_KEY` | Key do Resend (opcional) | — |
| `FROM_EMAIL` | Remetente |  |
| `TO_EMAIL` | Destinatário |  |
| `CORS_ORIGIN` | Origem permitida | `http://localhost:5173` |

> **Nota**: O email via Resend é opcional. Sem a API key, os feedbacks são salvos no banco normalmente, apenas sem notificação por email.
