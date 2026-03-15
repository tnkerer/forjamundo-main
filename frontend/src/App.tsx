import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n";
import LandingPage from "./LandingPage";
import FeedbackForm from "./FeedbackForm";

const App = () => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feedback" element={<FeedbackForm />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
};

export default App;
