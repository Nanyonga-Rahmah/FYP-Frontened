import { HashRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ViewFarmsPage from "./pages/ViewFarms";
import ViewHarvestsPage from "./pages/ViewHarvets";
import ViewBatchPage from "./pages/ViewBatch";
import Map from "./pages/Map";

import VerificationPage from "./pages/VerificationPage";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/view-farms" element={<ViewFarmsPage />} />
          <Route path="/view-harvests" element={<ViewHarvestsPage />} />
          <Route path="/view-batch" element={<ViewBatchPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
