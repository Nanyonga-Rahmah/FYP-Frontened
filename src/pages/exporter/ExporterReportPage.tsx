import { useEffect, useState } from "react";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import ExporterReportsTable from "@/components/exporter/tables/ExporterReportTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import GenerateReportDropdown from "@/components/exporter/dropdowns/GenerateReportDropDown";
import GenerateReportModal from "@/components/exporter/modals/GenerateReportModal";
import GenerateModalSuccess from "@/components/exporter/modals/GenerateReportSuccess";
import html2pdf from "html2pdf.js";
import DeforestationAssessmentReport from "@/components/exporter/reports/DeforestationAssessmentReport"; // Add others as needed
import { v4 as uuidv4 } from "uuid";

interface Report {
    id: string;
    name: string;
    consignmentId: string;
    type: string;
    generatedOn: string;
}

const mockReports: Report[] = [
    {
        id: "rpt-001",
        name: "Mission Kawumbi🥭",
        consignmentId: "CS-001",
        type: "Due Diligence Statement",
        generatedOn: "Nov 30, 2026",
    },
    {
        id: "rpt-002",
        name: "Coffee 2024 DDS",
        consignmentId: "CS-001",
        type: "Due Diligence Statement",
        generatedOn: "Nov 30, 2026",
    },
    {
        id: "rpt-003",
        name: "Coffee 2024 deforestation report",
        consignmentId: "CS-001",
        type: "Deforestation assessment",
        generatedOn: "Nov 30, 2026",
    },
    {
        id: "rpt-004",
        name: "Coffee 2024 traceability",
        consignmentId: "CS-001",
        type: "Traceability report",
        generatedOn: "Nov 30, 2026",
    },
    {
        id: "rpt-005",
        name: "Coffee 2024 deforestation report",
        consignmentId: "CS-001",
        type: "Deforestation assessment",
        generatedOn: "Nov 30, 2026",
    },
];

function ExporterReportsPage() {
    const { authToken } = useAuth();
    const { profile } = useUserProfile(authToken);
    const [reports, setReports] = useState<Report[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [renderKey, setRenderKey] = useState(uuidv4());

    // New state for modals
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedReportType, setSelectedReportType] = useState("Deforestation assessment");
    const [reportMeta, setReportMeta] = useState<{ name: string; type: string }>({ name: "", type: "" });

    const getInitials = () =>
        profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "BO";

    useEffect(() => {
        setReports(mockReports);
    }, []);

    useEffect(() => {
        if (showSuccessModal) {
            setRenderKey(uuidv4()); // Force re-render of hidden report
        }
    }, [reportMeta, showSuccessModal]);


    const filteredReports = reports.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDropdownSelect = (type: string) => {
        setSelectedReportType(type);
        setShowGenerateModal(true);
    };

    const handleSuccess = (meta: { name: string; type: string }) => {
        setReportMeta(meta);
        setShowSuccessModal(true);
    };

    const handleDownload = () => {
        setTimeout(() => {
          const element = document.getElementById("deforestation-report-pdf");
          if (element) {
            html2pdf()
              .set({
                margin: 0,
                filename: `${reportMeta.name}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
              })
              .from(element)
              .save();
      
            setShowSuccessModal(false);
          } else {
            console.error("PDF element not found.");
          }
        }, 100); // Delay ensures DOM fully renders
      };      

    const renderReportComponent = () => {
        switch (reportMeta.type) {
            case "Deforestation assessment":
                return <DeforestationAssessmentReport />;
            // Add others as needed
            default:
                return null;
        }
    };


    return (
        <section
            className="min-h-screen"
            style={{
                background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
            }}
        >
            <Header />

            <section className="px-20 py-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-400 text-white font-bold">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="text-[#C0C9DDE5]">Greetings,</span>
                            <br />
                            <span className="font-semibold text-xl text-white">
                                {profile ? `${profile.firstName} ${profile.lastName}` : "Brian Opio"}
                            </span>
                        </div>
                    </div>
                    <Button className="bg-[#E7B35A] text-white rounded-md px-4 py-2">
                        ABC Coffee Processing Ltd
                    </Button>
                </div>

                <div className="rounded-t-md mt-12 pt-12">
                    <div className="flex justify-between items-center px-6 pt-6">
                        <h2 className="text-white text-xl font-semibold">
                            Reports ({filteredReports.length})
                        </h2>
                        <div className="flex items-center gap-3">
                            <Input
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-[#0F2A38] text-white w-48 border border-gray-300 rounded-md px-3 py-2"
                            />
                            <Button
                                variant="outline"
                                className="bg-[#0F2A38] text-white border border-gray-300 rounded-md flex items-center gap-2 px-4"
                            >
                                <CalendarIcon className="w-4 h-4" />
                                11 Nov - 12 Nov
                            </Button>
                            <GenerateReportDropdown onSelect={handleDropdownSelect} />
                        </div>
                    </div>
                </div>

                <div className="bg-white mx-6 mt-8 rounded-md shadow-md">
                    <ExporterReportsTable reports={filteredReports} />
                </div>

                <div className="flex justify-center py-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Page 1 of 50</span>
                        <Button className="bg-[#FBBF24] text-white text-sm px-4 py-1.5 rounded-md">
                            Next Page &gt;
                        </Button>
                    </div>
                </div>
            </section>

            <section className="fixed bottom-0 w-full">
                <Footer />
            </section>

            {/* Modals and PDF hidden render */}
            <GenerateReportModal
                open={showGenerateModal}
                onClose={() => setShowGenerateModal(false)}
                selectedType={selectedReportType}
                onSuccess={handleSuccess}
            />

            <GenerateModalSuccess
                open={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                fileName={reportMeta.name}
                onDownload={handleDownload}
            />

            <div key={renderKey} id="report-pdf" className="hidden">
                {renderReportComponent()}
            </div>
        </section>
    );
}

export default ExporterReportsPage;
