import type { FC } from "react";

// ── Logo ────────────────────────────────────────────────────────────
export const ForjamundoLogo: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 519.2 299.87" xmlns="http://www.w3.org/2000/svg">
    <polygon points="52.76 215.09 90.98 201.53 91.89 129.13 62.02 124.7 29.93 109.05 0 81.66 21.91 81.66 31.7 85.76 38.35 81.66 111.13 81.66 111.13 202.96 105.26 216.66 111.13 226.44 111.13 269.09 52.24 269.09 52.76 215.09"/>
    <path d="M117.85,81.66h44.48l5.87,7.3v26.87h-7.57s-6.13-3.91-12.39-3.91h-14.35v12.26h15.91l3.52,5.87-.13,14.61h-19.17v38.22l-3.78,7.04,4.04,8.22v30.13h-16.43V81.66Z"/>
    <path d="M226.56,89.87l-4.3-8.21h-42.33l-3.78,4.3v61.44l4.11,6.84-4.11,6.46v60.46l10.83,7.1h33.39l6.19-10.04v-105.32l-4.17-7.44,4.17-6v-9.59ZM211.4,210.59h-14.97l-4.89-16.92v-72.59l3.13-10.96h10.76l5.97,10.37v90.1Z"/>
    <path d="M285.01,86.78l-4.1-5.12h-41.11l-4.2,5.12v141.48h18.42v-22.82l-3.39-7.04,2.22-4.7v-52.3l12.39,1.04.26,85.82h19.51v-80.08l-8.16-7.73,8.16-8.17v-45.5ZM268.63,125.16h-16.37v-17.94h16.37v17.94Z"/>
    <polygon points="293.41 108.92 293.41 86.87 296.67 81.66 305.15 81.66 315.46 85.18 321.85 81.66 340.63 81.66 344.02 88.31 344.02 206.61 337.63 229.44 299.67 229.44 293.41 215.74 293.41 186.53 296.67 178.96 293.41 171.53 293.41 143.09 311.28 143.09 311.28 209.61 324.46 211.57 328.11 204.13 328.11 108.66 293.41 108.92"/>
    <path d="M357.72,81.66l-6.92,6.52v140.08h18.65v-53.6l-2.6-5.87,2.74-6.39v-17.61h18.78v83.47h13.17V81.66h-43.82ZM388.37,127.37l-20.02-1.17v-14.41l4.56.06,8.41-4.95-1.82,2.54h8.87v17.93Z"/>
    <polygon points="407.15 81.66 423.33 81.66 432.59 86.22 441.85 81.66 519.2 81.66 519.2 102.66 428.28 129.13 428.28 201.66 460.76 211.31 460.76 268.83 439.37 268.83 448.24 265.18 428.54 268.83 407.15 268.83 407.15 264.4 411.59 258.66 407.15 246.26 407.15 177 412.37 163.44 407.15 149.74 407.15 81.66"/>
    <path d="M117.88,269.09c.1-.2,0-32.53,0-32.53h11.79l5.67,6.75v4.79h4.84l4.49,4.74,16.54-16.29h6.98v32.53h-9.39v-14.54l-14.13,12.41-14.82-12.41.26,14.54h-12.23Z"/>
    <polygon points="176.15 236.56 176.15 260.68 179.02 269.09 226.57 269.09 226.57 236.56 214.83 236.56 214.83 258.33 207 258.33 207 261.07 198.78 258.53 188.41 258.53 188.41 236.56 176.15 236.56"/>
    <polygon points="235.6 269.09 235.6 236.56 249.95 236.56 274.6 259.31 274.6 236.56 285.02 236.56 285.02 268.6 270.39 268.6 248.18 250.11 248.18 269.09 235.6 269.09"/>
    <path d="M333.29,236.56h-38.44v14.63l2.83,3.03-2.83,4.5v10.37h38.64l9.39-16.26-9.59-16.27ZM326.84,261.26h-21.89v-16.14l22.08-.58,5.77,7.43-5.96,9.29Z"/>
    <path d="M397.11,236.56h-21.79l.85,2.27-5.54-2.27h-16.04l-3.79,2.53v25.7l3.52,4.3h16.31l7.04-2.22-1.5,2.22h21.72l3.65-5.87v-22.69l-4.43-3.97ZM389.54,261.07h-27.32v-16.53h27.32v16.53Z"/>
    <polygon points="519.19 74.09 0 74.09 19.97 64.73 34.73 64.73 39.72 55.47 96.85 28.7 140.54 53.87 161.03 43.24 171.45 43.24 176.44 35.24 176.45 35.24 244.37 0 264.34 12.2 267.65 19.39 276.11 19.39 305.02 37.05 323.67 27.53 338.8 37.09 343.81 46.63 353.9 46.63 375.06 60 421.56 34.8 427.23 34.8 427.23 31.73 438.59 25.57 486.26 54.27 486.27 54.27 489.59 60.88 497.25 60.88 519.19 74.09"/>
  </svg>
);

// ── Global Styles ───────────────────────────────────────────────────
export const globalStyles = `
  :root {
    --fg: #3a3a3a;
    --fg-muted: #666;
    --bg: #F6EDDF;
    --bg-card: #efe6d8;
    --bg-input: #fff;
    --accent: #623C15;
    --accent-dim: rgba(98, 60, 21, 0.15);
    --accent-glow: rgba(98, 60, 21, 0.35);
    --border: #d4c9b8;
    --radius: 8px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'IBM Plex Sans', sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.6;
    min-height: 100vh;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  /* Header */
  .header {
    text-align: center;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
  }

  .logo-svg {
    width: 200px;
    height: auto;
    margin-bottom: 20px;
    fill: var(--accent);
  }

  .header h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 5vw, 2.6rem);
    letter-spacing: 0.04em;
    color: var(--fg);
    margin-bottom: 4px;
  }

  .header h1 span { color: var(--accent); }

  .subtitle {
    font-size: 0.95rem;
    color: var(--fg-muted);
    font-weight: 300;
  }

  /* Sections */
  .section {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px 28px;
    margin-bottom: 24px;
    transition: border-color 0.3s;
  }

  .section:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent-dim);
  }

  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.15rem;
    letter-spacing: 0.08em;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Fields */
  .field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 540px) {
    .field-grid { grid-template-columns: 1fr; }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .field label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--fg-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .field input {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 14px;
    color: var(--fg);
    font-family: inherit;
    font-size: 0.95rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .field input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-dim);
  }

  .hint {
    font-size: 0.75rem;
    color: var(--fg-muted);
    font-style: italic;
  }

  /* Scale questions */
  .scale-question {
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
  }

  .scale-question:last-child { border-bottom: none; padding-bottom: 0; }
  .scale-question:first-of-type { padding-top: 0; }

  .q-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 4px;
  }

  .q-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    color: var(--accent);
    min-width: 28px;
  }

  .q-title { font-weight: 600; font-size: 0.95rem; }

  .q-desc {
    font-size: 0.85rem;
    color: var(--fg-muted);
    margin-left: 38px;
    margin-bottom: 14px;
    font-weight: 300;
  }

  .scale-row {
    display: flex;
    gap: 6px;
    margin-left: 38px;
    flex-wrap: wrap;
  }

  /* Open questions */
  .open-question { margin-bottom: 24px; }
  .open-question:last-child { margin-bottom: 0; }

  .open-question textarea {
    width: calc(100% - 38px);
    min-height: 100px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px;
    color: var(--fg);
    font-family: inherit;
    font-size: 0.9rem;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-left: 38px;
  }

  .open-question textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-dim);
  }

  /* Buttons */
  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 0.1em;
    padding: 14px 36px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--accent);
    color: var(--bg);
  }

  .btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 20px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: transparent;
    color: var(--fg-muted);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    border-color: var(--fg-muted);
    color: var(--fg);
  }

  /* Footer */
  .footer {
    text-align: center;
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
    color: var(--fg-muted);
    line-height: 1.8;
  }

  .footer a {
    color: var(--accent);
    text-decoration: none;
  }

  /* Animation */
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-in {
    animation: fadeInUp 0.5s ease both;
  }

  @media print {
    body { background: #fff; color: #3a3a3a; }
    body::before { display: none; }
    .logo-svg { fill: #623C15; }
    .section { border: 1px solid #ccc; break-inside: avoid; }
    .btn { display: none; }
  }
`;
