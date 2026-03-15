// Type for translation structure (allows any string values)
export interface Translations {
  _meta: {
    code: string;
    name: string;
    flag: string;
  };
  landing: {
    title: string;
    subtitle: string;
    subscribeTitle: string;
    subscribeDesc: string;
    emailPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successMessage: string;
    errorMessage: string;
    feedbackButton: string;
    backToHome: string;
  };
  feedback: {
    pageTitle: string;
    pageTitleHighlight: string;
    publisher: string;
    sessionTitle: string;
    gameName: string;
    gameNamePlaceholder: string;
    date: string;
    yourName: string;
    yourNamePlaceholder: string;
    playerCount: string;
    playerCountPlaceholder: string;
    version: string;
    versionPlaceholder: string;
    versionHint: string;
    duration: string;
    durationPlaceholder: string;
    scaleTitle: string;
    scaleHint: string;
    scaleQuestions: Array<{ num: number; title: string; desc: string }>;
    openTitle: string;
    openPlaceholder: string;
    openQuestions: Array<{ num: number; title: string; desc: string }>;
    submitButton: string;
    submittingButton: string;
    clearButton: string;
    clearConfirm: string;
    errorPrefix: string;
    errorSuffix: string;
    successTitle: string;
    successMessage: string;
    submitAnother: string;
    footerCredit: string;
  };
}

export const ptBR: Translations = {
  // Language metadata
  _meta: {
    code: "pt-BR",
    name: "Português",
    flag: "🇧🇷",
  },

  // Landing Page
  landing: {
    title: "Em Construção",
    subtitle: "Estamos preparando algo incrível para você. Em breve, novidades!",
    subscribeTitle: "Fique por dentro",
    subscribeDesc: "Deixe seu e-mail para receber novidades sobre nossos jogos e lançamentos.",
    emailPlaceholder: "seu@email.com",
    submitButton: "Cadastrar",
    submittingButton: "Enviando...",
    successMessage: "Obrigado! Você receberá nossas novidades em breve.",
    errorMessage: "Erro ao cadastrar. Tente novamente.",
    feedbackButton: "Acessar Folha de Feedback →",
    backToHome: "← Voltar para página inicial",
  },

  // Feedback Form
  feedback: {
    pageTitle: "Formulário de Avaliação de",
    pageTitleHighlight: "Playtest",
    publisher: "Forjamundo Editora",

    // Session section
    sessionTitle: "Dados da Sessão",
    gameName: "Nome do Jogo",
    gameNamePlaceholder: "Ex: Folkloria",
    date: "Data",
    yourName: "Seu Nome",
    yourNamePlaceholder: "Nome do playtester",
    playerCount: "Número de Jogadores",
    playerCountPlaceholder: "Ex: 4",
    version: "Versão / Iteração",
    versionPlaceholder: "Ex: v3.2",
    versionHint: "Caso não tenha certeza, deixe em branco.",
    duration: "Duração da Partida",
    durationPlaceholder: "Ex: 45 min",

    // Scale section
    scaleTitle: "Avaliação em Escala",
    scaleHint: "1 = Muito Ruim / 10 = Excelente",

    // Scale questions
    scaleQuestions: [
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
    ],

    // Open questions section
    openTitle: "Perguntas Abertas",
    openPlaceholder: "Escreva sua resposta aqui...",

    openQuestions: [
      { num: 15, title: "Momento Memorável", desc: "Qual foi o momento mais memorável e/ou divertido da partida? Descreva o que aconteceu." },
      { num: 16, title: "Frustrações", desc: "O que mais te frustrou ou confundiu durante o jogo? Descreva a situação." },
      { num: 17, title: "Sugestão de Mudança", desc: "Se você pudesse mudar uma única coisa no jogo, o que mudaria e por quê?" },
      { num: 18, title: "Elevator Pitch", desc: "Como você descreveria este jogo para um amigo que nunca jogou?" },
    ],

    // Actions
    submitButton: "Enviar Feedback",
    submittingButton: "Enviando...",
    clearButton: "Limpar Formulário",
    clearConfirm: "Tem certeza que deseja limpar todas as respostas?",
    errorPrefix: "Erro ao enviar:",
    errorSuffix: "Tente novamente.",

    // Success page
    successTitle: "Feedback Enviado!",
    successMessage: "Obrigado por dedicar seu tempo. Suas respostas são essenciais para melhorarmos o jogo.",
    submitAnother: "Enviar Outro Feedback",

    // Footer
    footerCredit: "Baseado nas metodologias de Jamey Stegmaier (Stonemaier Games) e Adam Porter (Adam in Wales)",
  },
};
