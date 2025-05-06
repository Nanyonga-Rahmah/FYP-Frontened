import { useState } from "react";
import Footer from "@/components/globals/Footer";
import Header from "@/components/globals/exporter/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExportConsignmentModal } from "@/components/exporter/modals/ExportConsignmentModal";
import { PreviewConsignmentModal } from "@/components/exporter/modals/PreviewConsignmentModal";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";

// Define interface for consignment data to fix TypeScript errors
interface ConsignmentData {
  lotIds?: string[];
  lot?: string;
  destinationCountry: string;
  destinationPort?: string;
  permitNumber?: string;
  productType?: string;
  hsCode?: string;
  tradeName?: string;
  exportDate: string | null;
  exportVolume?: number;
  shippingMethod?: string;
  shippingDetails?: string;
  qualityNotes?: string;
  certificateFileName?: string;
  certificateFile?: File;
}

// Define interface for action items
interface ActionItem {
  type: "modal" | "link" | "normal";
  name: string;
  description: string;
  imageUrl: string;
  onClick?: () => void;
  to?: string;
}

function ExporterDashboardPage() {
  const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [consignmentData, setConsignmentData] =
    useState<ConsignmentData | null>(null);

  // Get initials for avatar
  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "RA"; // Fallback to default initials
  };

  const actions: ActionItem[] = [
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
      type: "link",
      name: "View Consignments",
      description: "See processors who work with you",
      imageUrl: "/images/view-consignment.png",
      to: "/view-consignment",
    },
    {
      type: "link",
      name: "Reports",
      description: "Download summary reports",
      imageUrl: "/images/inspect.png",
      to: "/view-reports",
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
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Rahmah Akello"}
              </span>
            </div>
          </div>

          <div>
            <Button className="bg-[#E7B35A] text-white rounded-md px-4 py-2">
              ABC Coffee Exporters Ltd
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
          <span className="font-semibold text-xl text-white">
            Quick Actions
          </span>
          <div className="grid lg:grid-cols-3 gap-5 mt-5 mb-10">
            {actions.map((action, index) => (
              <div
                key={index}
                className="bg-white flex flex-col items-center rounded-[10px] max-w-[370px] max-h-[237px] justify-center py-3 shadow-sm cursor-pointer"
                onClick={() => {
                  if (
                    action.type === "modal" &&
                    typeof action.onClick === "function"
                  ) {
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
      <ExportConsignmentModal
        open={isExportModalOpen}
        onOpenChange={(open: boolean) => setIsExportModalOpen(open)}
        onContinue={(data: ConsignmentData) => {
          console.log("Export form data:", data);
          setConsignmentData(data);
          setIsExportModalOpen(false);
          setIsPreviewModalOpen(true);
        }}
      />

      <PreviewConsignmentModal
        open={isPreviewModalOpen}
        onOpenChange={(open: boolean) => setIsPreviewModalOpen(open)}
        consignmentData={consignmentData}
        onBack={() => {
          setIsPreviewModalOpen(false);
          setIsExportModalOpen(true);
        }}
        onConfirm={() => {
          // The API call is now handled inside the PreviewConsignmentModal component
          console.log("Confirmation handled by PreviewConsignmentModal");
        }}
      />

      <section className="fixed bottom-0 w-full">
        <Footer />
      </section>
    </section>
  );
}

export default ExporterDashboardPage;
