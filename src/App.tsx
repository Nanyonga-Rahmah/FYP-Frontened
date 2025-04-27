import { HashRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ViewFarmsPage from "./pages/ViewFarms";
import ViewHarvestsPage from "./pages/ViewHarvets";
import ViewBatchPage from "./pages/ViewBatch";

import VerificationPage from "./pages/VerificationPage";
import { AddFarm } from "./components/Farmers/AddFarm";
import { Toaster } from "./components/ui/toaster";


// Extension Worker Imports
import ExtensionWorkerDashboard from "./pages/ew/DashboardPage";
import ApproveKYCPage from "./pages/ew/ApproveKYCPage";
import ApproveFarmPage from "./pages/ew/ApproveFarmPage";
import ApproveHarvestsPage from "./pages/ew/ApproveHarvestsPage";

// Exporter Imports
import ExporterDashboardPage from "./pages/exporter/DashboardPage";
import ViewLotsPage from "./pages/exporter/ViewLotsPage";
import ViewLotDetailsPage from "@/pages/exporter/ViewLotDetailsPage";


function App() {
  return (
    <>
      <Toaster />
      <HashRouter>
        <Routes>
          {/* <Route path="/" element={<SignUpPage />} /> */}
          <Route path="/" element={<ExporterDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-farm" element={<AddFarm />} />
          <Route path="/view-farms" element={<ViewFarmsPage />} />
          <Route path="/view-harvests" element={<ViewHarvestsPage />} />
          <Route path="/view-batch" element={<ViewBatchPage />} />
          <Route path="/ew-dashboard" element={<ExtensionWorkerDashboard />} />
          <Route path="/approve-kyc" element={<ApproveKYCPage />} />
          <Route path="/approve-farms" element={<ApproveFarmPage />} />
          <Route path="/approve-harvests" element={<ApproveHarvestsPage />} />
          <Route path="/manage-farmers" element={<VerificationPage />} />
          <Route path="/exporter-dashboard" element={<ExporterDashboardPage />} />
          <Route path="/view-lots" element={<ViewLotsPage />} />
          <Route path="/view-lot-details/:id" element={<ViewLotDetailsPage />} />



        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
