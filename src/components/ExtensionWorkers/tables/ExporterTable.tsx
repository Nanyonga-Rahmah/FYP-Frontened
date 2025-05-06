// components/ExtensionWorkers/tables/ExporterTable.tsx
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewExporterModal from "../modals/ViewExporterModal";
import { AllUsers } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

export type Exporter = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  exporterInfo?: {
    companyName?: string;
    licenseNumber?: string;
  };
  kyc: {
    nationalIdNumber: string;
    nationalIdPhoto: string;
    passportSizePhoto: string;
    cooperativeLocation: string;
    status: string;
    submittedAt: string;
    processedAt?: string;
    adminNotes?: string;
    blockchainTxHash?: string;
  };
  blockchainAddress?: string;
  encryptedPrivateKey?: string;
  role: string;
};

interface ExporterTableRowsProps {
  exporters: Exporter[];
  onStatusUpdate?: (userId: string, status: string, adminNotes: string) => void;
}

export function ExporterTableRows({
  exporters = [],
  onStatusUpdate,
}: ExporterTableRowsProps) {
  const [selectedExporter, setSelectedExporter] = useState<Exporter | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"review" | "view" | null>(null);
  const { authToken } = useAuth();

  const getStatusBadge = (status: string) => {
    const base = "text-white text-xs px-3 py-1 rounded-full";
    switch (status.toLowerCase()) {
      case "pending":
        return `${base} bg-[#339DFF]`;
      case "approved":
        return `${base} bg-[#3AB85E]`;
      case "rejected":
        return `${base} bg-[#FF5C5C]`;
      default:
        return base;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdateKycStatus = async (
    userId: string,
    status: string,
    adminNotes: string
  ) => {
    try {
      const response = await fetch(`${AllUsers}${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      if (onStatusUpdate) {
        onStatusUpdate(userId, status, adminNotes);
      }

      setSelectedExporter(null);
      setViewMode(null);
    } catch (error) {
      console.error("Error updating KYC status:", error);
    }
  };

  if (!exporters || exporters.length === 0) {
    return (
      <div className="w-full text-center py-8">No exporters data available</div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md">
      {selectedExporter && viewMode === "review" && (
        <ViewExporterModal
          exporter={selectedExporter}
          onClose={() => {
            setSelectedExporter(null);
            setViewMode(null);
          }}
          onSubmit={(status, notes) =>
            handleUpdateKycStatus(selectedExporter._id, status, notes)
          }
        />
      )}

      {selectedExporter && viewMode === "view" && (
        <ViewExporterModal
          exporter={selectedExporter}
          onClose={() => {
            setSelectedExporter(null);
            setViewMode(null);
          }}
        />
      )}

      <table className="w-full text-sm">
        <thead className="bg-white text-[#5C6474] border-b border-white">
          <tr>
            <th className="text-left px-6 py-3">Name</th>
            <th className="text-left px-6 py-3">Contacts</th>
            <th className="text-left px-6 py-3">Company Name</th>
            <th className="text-left px-6 py-3">License Number</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Date submitted</th>
            <th className="text-left px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="text-[#222]">
          {exporters.map((exporter, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{`${exporter.firstName} ${exporter.lastName}`}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-sm">{exporter.phone}</div>
                <div className="text-xs text-[#5C6474]">{exporter.email}</div>
              </td>
              <td className="px-6 py-4">
                {exporter.exporterInfo?.companyName || "Not specified"}
              </td>
              <td className="px-6 py-4">
                {exporter.exporterInfo?.licenseNumber || "Not specified"}
              </td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(exporter.kyc.status)}>
                  {exporter.kyc.status.charAt(0).toUpperCase() +
                    exporter.kyc.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                {formatDate(exporter.kyc.submittedAt)}
              </td>
              <td className="px-6 py-4 relative">
                <div className="relative">
                  <button
                    onClick={() => {
                      const allMenus =
                        document.querySelectorAll('[id^="menu-"]');
                      allMenus.forEach((menu) => menu.classList.add("hidden"));

                      const currentMenu = document.getElementById(
                        `menu-${index}`
                      );
                      if (currentMenu) {
                        currentMenu.classList.remove("hidden");
                        setTimeout(() => {
                          currentMenu.classList.add("hidden");
                        }, 5000);
                      }
                    }}
                    className="p-2 rounded bg-white hover:bg-gray-100 focus:outline-none"
                  >
                    <MoreHorizontal className="w-5 h-5 text-black" />
                  </button>
                  <div
                    id={`menu-${index}`}
                    className="absolute right-0 mt-2 z-10 hidden bg-white border border-gray-200 rounded shadow-md w-36"
                  >
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const currentExporter = exporter;
                        setSelectedExporter(currentExporter);
                        setViewMode(
                          currentExporter.kyc.status.toLowerCase() === "pending"
                            ? "review"
                            : "view"
                        );
                      }}
                    >
                      {exporter.kyc.status.toLowerCase() === "pending"
                        ? "Review exporter"
                        : "View exporter"}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center items-center px-6 py-4 border-t border-white">
        <span className="text-sm text-gray-500 mr-4">
          Page 1 of {Math.ceil(exporters.length / 10)}
        </span>
        <Button className="bg-[#E7B35A] hover:bg-[#e0a844] text-white px-4">
          Next Page
        </Button>
      </div>
    </div>
  );
}
