import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/terms" element={<TermsPage />} />
      {/* "/", plus the old /what-is-tanyatalk and /who-is-tanya deep links */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
