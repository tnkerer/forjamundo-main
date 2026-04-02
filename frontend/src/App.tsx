import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n";
import LandingPage from "./LandingPage";
import FeedbackForm from "./FeedbackForm";
import AdminDashboard from "./AdminDashboard";

const App = () => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  );
};

export default App;
