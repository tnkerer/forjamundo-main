import type { Translations } from "./pt-BR";

export const en: Translations = {
  // Language metadata
  _meta: {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },

  // Landing Page
  landing: {
    title: "Under Construction",
    subtitle: "We're preparing something amazing for you. Stay tuned!",
    subscribeTitle: "Stay Updated",
    subscribeDesc: "Leave your email to receive news about our games and releases.",
    emailPlaceholder: "your@email.com",
    submitButton: "Subscribe",
    submittingButton: "Sending...",
    successMessage: "Thank you! You'll receive our news soon.",
    errorMessage: "Error subscribing. Please try again.",
    feedbackButton: "Access Feedback Form →",
    backToHome: "← Back to homepage",
  },

  // Feedback Form
  feedback: {
    pageTitle: "Playtest",
    pageTitleHighlight: "Feedback Form",
    publisher: "Forjamundo Editora",

    // Session section
    sessionTitle: "Session Info",
    gameName: "Game Name",
    gameNamePlaceholder: "E.g.: Folkloria",
    date: "Date",
    yourName: "Your Name",
    yourNamePlaceholder: "Playtester name",
    playerCount: "Number of Players",
    playerCountPlaceholder: "E.g.: 4",
    version: "Version / Iteration",
    versionPlaceholder: "E.g.: v3.2",
    versionHint: "If unsure, leave blank.",
    duration: "Session Duration",
    durationPlaceholder: "E.g.: 45 min",

    // Scale section
    scaleTitle: "Scale Rating",
    scaleHint: "1 = Very Poor / 10 = Excellent",

    // Scale questions
    scaleQuestions: [
      { num: 1, title: "Overall Fun", desc: "How fun was it to play this game?" },
      { num: 2, title: "Engagement", desc: "Did you feel involved and interested throughout the session?" },
      { num: 3, title: "Rules Clarity", desc: "Were the rules easy to understand and follow?" },
      { num: 4, title: "Turn Flow", desc: "Did the game flow well, without long pauses or confusion between turns?" },
      { num: 5, title: "Player Agency", desc: "Did you feel your decisions mattered to the outcome?" },
      { num: 6, title: "Balance", desc: "Did the game feel fair and balanced between players?" },
      { num: 7, title: "Theme", desc: "Was the game's theme clear and immersive during play?" },
      { num: 8, title: "Pacing", desc: "Did the game length feel appropriate? (1 = too long, 10 = perfect)" },
      { num: 9, title: "Tension & Excitement", desc: "Did the session feel competitive and exciting?" },
      { num: 10, title: "Player Interaction", desc: "Was there enough interesting interaction between players?" },
      { num: 11, title: "Learning Curve", desc: "How quickly did you feel comfortable playing?" },
      { num: 12, title: "Replayability", desc: "Would you like to play this game again?" },
      { num: 13, title: "Components & Usability", desc: "Were the components practical and easy to use?" },
      { num: 14, title: "Overall Impression", desc: "What's your overall rating for this game in this session?" },
    ],

    // Open questions section
    openTitle: "Open Questions",
    openPlaceholder: "Write your answer here...",

    openQuestions: [
      { num: 15, title: "Memorable Moment", desc: "What was the most memorable and/or fun moment of the session? Describe what happened." },
      { num: 16, title: "Frustrations", desc: "What frustrated or confused you the most during the game? Describe the situation." },
      { num: 17, title: "Suggested Change", desc: "If you could change one thing about the game, what would it be and why?" },
      { num: 18, title: "Elevator Pitch", desc: "How would you describe this game to a friend who has never played it?" },
    ],

    // Actions
    submitButton: "Submit Feedback",
    submittingButton: "Submitting...",
    clearButton: "Clear Form",
    clearConfirm: "Are you sure you want to clear all answers?",
    errorPrefix: "Error submitting:",
    errorSuffix: "Please try again.",

    // Success page
    successTitle: "Feedback Submitted!",
    successMessage: "Thank you for your time. Your responses are essential to help us improve the game.",
    submitAnother: "Submit Another Feedback",

    // Footer
    footerCredit: "Based on methodologies by Jamey Stegmaier (Stonemaier Games) and Adam Porter (Adam in Wales)",
  },
};
