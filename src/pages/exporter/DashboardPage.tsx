"use client";

import { useState } from "react";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/exporter/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LocateFixed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ExportConsignmentModal } from "@/components/exporter/modals/ExportConsignmentModal";
import { PreviewConsignmentModal } from "@/components/exporter/modals/PreviewConsignmentModal";

function ExporterDashboardPage() {
  const navigate = useNavigate();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [consignmentData, setConsignmentData] = useState<any>(null);

  const actions = [
    {
      type: "modal",
      name: "Export Consignment",
      description: "Begin exporting your lots",
      imageUrl: "/images/export-consignment.png",
      onClick: () => setIsExportModalOpen(true),
    },
    {
      type: "link",
      name: "Mark as Delivered",
      description: "Confirm when lots are delivered",
      imageUrl: "/images/mak-delivered.png",
      to: "/confirm-consignment",
    },
    {
      type: "link",
      name: "View Lots",
      description: "See and manage new deliveries",
      imageUrl: "/images/view-lots.png",
      to: "/view-lots",
    },
    {
      type: "normal",
      name: "View Consignments",
      description: "See processors who work with you",
      imageUrl: "/images/view-consignment.png",
    },
    {
      type: "normal",
      name: "Reports",
      description: "Download summary reports",
      imageUrl: "/images/inspect.png",
    },
    {
      type: "normal",
      name: "Help Center",
      description: "Resolve issues, learn EU compliance",
      imageUrl: "/images/help-center.png",
    },
  ];

  return (
    <section
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="px-20 py-10">
        {/* Greeting */}
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>MN</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Rahmah Akello
              </span>
            </div>
          </div>

          <div>
            <Button
              className="bg-[#E7B35A] flex items-center gap-1 rounded-md px-2"
              onClick={() => navigate("/add-farm")}
            >
              <LocateFixed />
              <span>Kabarole, Uganda</span>
            </Button>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {/* Cards */}
          {/* ...Your existing metric cards... */}
        </div>

        {/* Quick Actions */}
        <section className="mt-16">
          <span className="font-semibold text-xl text-white">Quick Actions</span>
          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-white flex flex-col items-center rounded-[10px] max-w-[370px] max-h-[237px] justify-center py-3 shadow-sm cursor-pointer"
                onClick={() => {
                  if (action.type === "modal" && typeof action.onClick === "function") {
                    action.onClick();
                  }
                }}
              >
                <div className="object-cover h-20 w-20 flex justify-center items-center">
                  <img src={action.imageUrl} alt={action.description} />
                </div>

                {action.type === "link" ? (
                  <Link
                    to={action.to!}
                    className="font-semibold text-xl text-[#222222] hover:underline"
                  >
                    {action.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-xl text-[#222222]">
                    {action.name}
                  </span>
                )}
                <span className="font-normal text-sm text-[#5C6474]">
                  {action.description}
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Modals Section */}
      {/* <ExportConsignmentModal
        open={isExportModalOpen}
        onOpenChange={(open) => setIsExportModalOpen(open)}
        onContinue={(data: any) => {
          setConsignmentData(data);        // Save filled data
          setIsExportModalOpen(false);     // Close Export modal
          setIsPreviewModalOpen(true);     // Open Preview modal
        }}
      />

      <PreviewConsignmentModal
        open={isPreviewModalOpen}
        onOpenChange={(open) => setIsPreviewModalOpen(open)}
        consignmentData={consignmentData}
        onBack={() => {
          setIsPreviewModalOpen(false);
          setIsExportModalOpen(true);
        }}
        onConfirm={() => {
          console.log("Confirmed submission:", consignmentData);
          setIsPreviewModalOpen(false);
          // Do something like API call here later
        }}
      /> */}

<ExportConsignmentModal
  open={isExportModalOpen}
  onOpenChange={(open) => setIsExportModalOpen(open)}
  onContinue={(data) => {
    setConsignmentData(data);
    setIsExportModalOpen(false);
    setIsPreviewModalOpen(true);
  }}
/>

<PreviewConsignmentModal
  open={isPreviewModalOpen}
  onOpenChange={(open) => setIsPreviewModalOpen(open)}
  consignmentData={consignmentData}
  onBack={() => {
    setIsPreviewModalOpen(false);
    setIsExportModalOpen(true);
  }}
  onConfirm={() => {
    // TODO: Handle Final Submission API call here
    console.log("Confirmed submission", consignmentData);
    setIsPreviewModalOpen(false);
  }}
/>


      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ExporterDashboardPage;
