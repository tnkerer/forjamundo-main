import type { FC } from "react";
import { useTranslation, getAvailableLocales, type LocaleCode } from "../i18n";

// ── Flag SVGs (inline for performance) ───────────────────────────────
const flags: Record<LocaleCode, JSX.Element> = {
  "pt-BR": (
    // Brazilian flag
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#009B3A" />
      <path d="M18 6L32 18L18 30L4 18L18 6Z" fill="#FEDF00" />
      <circle cx="18" cy="18" r="7" fill="#002776" />
      <path
        d="M11.5 16.5C14 14 22 14 24.5 16.5"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  ),
  "en": (
    // US flag
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="18" fill="#B22234" />
      <rect y="3" width="36" height="2.5" fill="white" />
      <rect y="8" width="36" height="2.5" fill="white" />
      <rect y="13" width="36" height="2.5" fill="white" />
      <rect y="18" width="36" height="2.5" fill="white" />
      <rect y="23" width="36" height="2.5" fill="white" />
      <rect y="28" width="36" height="2.5" fill="white" />
      <rect y="33" width="36" height="2.5" fill="white" />
      <rect width="18" height="18" fill="#3C3B6E" />
      <g fill="white">
        <circle cx="3" cy="2" r="0.8" />
        <circle cx="6" cy="2" r="0.8" />
        <circle cx="9" cy="2" r="0.8" />
        <circle cx="12" cy="2" r="0.8" />
        <circle cx="15" cy="2" r="0.8" />
        <circle cx="4.5" cy="4" r="0.8" />
        <circle cx="7.5" cy="4" r="0.8" />
        <circle cx="10.5" cy="4" r="0.8" />
        <circle cx="13.5" cy="4" r="0.8" />
        <circle cx="3" cy="6" r="0.8" />
        <circle cx="6" cy="6" r="0.8" />
        <circle cx="9" cy="6" r="0.8" />
        <circle cx="12" cy="6" r="0.8" />
        <circle cx="15" cy="6" r="0.8" />
        <circle cx="4.5" cy="8" r="0.8" />
        <circle cx="7.5" cy="8" r="0.8" />
        <circle cx="10.5" cy="8" r="0.8" />
        <circle cx="13.5" cy="8" r="0.8" />
        <circle cx="3" cy="10" r="0.8" />
        <circle cx="6" cy="10" r="0.8" />
        <circle cx="9" cy="10" r="0.8" />
        <circle cx="12" cy="10" r="0.8" />
        <circle cx="15" cy="10" r="0.8" />
        <circle cx="4.5" cy="12" r="0.8" />
        <circle cx="7.5" cy="12" r="0.8" />
        <circle cx="10.5" cy="12" r="0.8" />
        <circle cx="13.5" cy="12" r="0.8" />
        <circle cx="3" cy="14" r="0.8" />
        <circle cx="6" cy="14" r="0.8" />
        <circle cx="9" cy="14" r="0.8" />
        <circle cx="12" cy="14" r="0.8" />
        <circle cx="15" cy="14" r="0.8" />
        <circle cx="4.5" cy="16" r="0.8" />
        <circle cx="7.5" cy="16" r="0.8" />
        <circle cx="10.5" cy="16" r="0.8" />
        <circle cx="13.5" cy="16" r="0.8" />
      </g>
    </svg>
  ),
};

// ── Styles ───────────────────────────────────────────────────────────
const styles = `
  .lang-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    gap: 8px;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px;
    border-radius: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(8px);
  }

  .lang-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: transparent;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lang-btn:hover {
    transform: scale(1.1);
  }

  .lang-btn.active {
    border-color: #623C15;
    box-shadow: 0 0 0 2px rgba(98, 60, 21, 0.2);
  }

  .lang-btn svg {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 600px) {
    .lang-toggle {
      top: 12px;
      right: 12px;
      padding: 4px;
      gap: 6px;
    }

    .lang-btn {
      width: 32px;
      height: 32px;
    }
  }
`;

// ── Component ────────────────────────────────────────────────────────
export const LanguageToggle: FC = () => {
  const { locale, setLocale } = useTranslation();
  const availableLocales = getAvailableLocales();

  return (
    <>
      <style>{styles}</style>
      <div className="lang-toggle">
        {availableLocales.map(({ code, name }) => (
          <button
            key={code}
            className={`lang-btn ${locale === code ? "active" : ""}`}
            onClick={() => setLocale(code)}
            title={name}
            aria-label={`Switch to ${name}`}
          >
            {flags[code]}
          </button>
        ))}
      </div>
    </>
  );
};
