import { Suspense, lazy } from "react";
import { Routes, Route, HashRouter } from "react-router-dom"; // Using HashRouter here
import { Toaster } from "./components/ui/toaster";

// Dynamically import pages
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ViewFarmsPage = lazy(() => import("./pages/ViewFarms"));
const ViewHarvestsPage = lazy(() => import("./pages/ViewHarvets"));
const ViewBatchPage = lazy(() => import("./pages/ViewBatch"));
const VerificationPage = lazy(() => import("./pages/VerificationPage"));
import { AddFarm } from "./components/Farmers/AddFarm";
// Extension Worker Pages
const ExtensionWorkerDashboard = lazy(() => import("./pages/ew/DashboardPage"));
const ApproveKYCPage = lazy(() => import("./pages/ew/ApproveKYCPage"));
const ApproveFarmPage = lazy(() => import("./pages/ew/ApproveFarmPage"));
const ApproveHarvestsPage = lazy(
  () => import("./pages/ew/ApproveHarvestsPage")
);

// Processor Pages
const ProcessorDashboardPage = lazy(
  () => import("./pages/processor/ProcessorDashboardPage")
);
const BatchHistory = lazy(() => import("./pages/processor/ViewBatchs"));
const BatchDetailsPage = lazy(
  () => import("./pages/processor/ViewBatchDetails")
);
const ViewFarmersPage = lazy(() => import("./pages/processor/ViewFarmers"));
const LotHistoryPage = lazy(() => import("./pages/processor/ViewLots"));
const LotDetailsPage = lazy(
  () => import("./pages/processor/ViewLotDetailsPage")
);

// Exporter Pages
const ExporterDashboardPage = lazy(
  () => import("./pages/exporter/DashboardPage")
);
const ViewLotsPage = lazy(() => import("./pages/exporter/ViewLotsPage"));
const ViewLotDetailsPage = lazy(
  () => import("./pages/exporter/ViewLotDetailsPage")
);
const ConsignmentPage = lazy(() => import("./pages/exporter/ConsignmentPage"));
const ViewConsignmentDetailsPage = lazy(
  () => import("./pages/exporter/ConsignmentDetails")
);
const DueDiligenceReport = lazy(
  () => import("./pages/exporter/DueDeligenceReport")
);

// Regulator Pages
const QRScanTraceabilityPage = lazy(
  () => import("./pages/regulator/QRScanTraceabilityPage")
);
const RegulatorLandingPage = lazy(
  () => import("./pages/regulator/LandingPage")
);

function App() {
  return (
    <>
      <Toaster />
      {/* Use only one router: HashRouter or BrowserRouter */}
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/" element={<RegulatorLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add-farm" element={<AddFarm />} />
            <Route path="/view-farms" element={<ViewFarmsPage />} />
            <Route path="/view-harvests" element={<ViewHarvestsPage />} />
            <Route path="/view-batch" element={<ViewBatchPage />} />
            <Route path="/approve-harvests" element={<ApproveHarvestsPage />} />
            <Route path="/manage-farmers" element={<VerificationPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Extension Worker Routes */}
            <Route
              path="/ew-dashboard"
              element={<ExtensionWorkerDashboard />}
            />
            <Route path="/approve-kyc" element={<ApproveKYCPage />} />
            <Route path="/approve-farms" element={<ApproveFarmPage />} />
            <Route path="/approve-harvests" element={<ApproveHarvestsPage />} />

            {/* Processor Routes */}
            <Route
              path="/processor-dashboard"
              element={<ProcessorDashboardPage />}
            />
            <Route path="/processor/view-batchs" element={<BatchHistory />} />
            <Route
              path="/processor/view-batchDetails/:batchId"
              element={<BatchDetailsPage />}
            />
            <Route
              path="/processor/view-farmers"
              element={<ViewFarmersPage />}
            />
            <Route path="/processor/view-lots" element={<LotHistoryPage />} />
            <Route
              path="/processor/view-lots/:lotId"
              element={<LotDetailsPage />}
            />

            {/* Exporter Routes */}
            <Route
              path="/exporter-dashboard"
              element={<ExporterDashboardPage />}
            />
            <Route path="/view-lots" element={<ViewLotsPage />} />
            <Route
              path="/view-lot-details/:id"
              element={<ViewLotDetailsPage />}
            />
            <Route path="/view-consignment" element={<ConsignmentPage />} />
            <Route
              path="/view-consignment-details/:id"
              element={<ViewConsignmentDetailsPage />}
            />
            <Route
              path="/due-diligence-report/:consignmentId"
              element={<DueDiligenceReport />}
            />

            {/* Regulator Routes */}
            <Route
              path="/regulator-landing"
              element={<RegulatorLandingPage />}
            />
            <Route
              path="/traceability-report/:batchId"
              element={<QRScanTraceabilityPage />}
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  );
}

export default App;
