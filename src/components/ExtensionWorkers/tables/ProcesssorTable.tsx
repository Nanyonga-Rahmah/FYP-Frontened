// components/ExtensionWorkers/tables/ProcessorTable.tsx
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewProcessorModal from "../modals/ViewProcessorModal";
import { AllUsers } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

export type Processor = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  processorInfo?: {
    facilityName?: string;
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

interface ProcessorTableRowsProps {
  processors: Processor[];
  onStatusUpdate?: (userId: string, status: string, adminNotes: string) => void;
}

export function ProcessorTableRows({
  processors = [],
  onStatusUpdate,
}: ProcessorTableRowsProps) {
  const [selectedProcessor, setSelectedProcessor] = useState<Processor | null>(
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

      setSelectedProcessor(null);
      setViewMode(null);
    } catch (error) {
      console.error("Error updating KYC status:", error);
    }
  };

  if (!processors || processors.length === 0) {
    return (
      <div className="w-full text-center py-8">
        No processors data available
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-md">
      {selectedProcessor && viewMode === "review" && (
        <ViewProcessorModal
          processor={selectedProcessor}
          onClose={() => {
            setSelectedProcessor(null);
            setViewMode(null);
          }}
          onSubmit={(status, notes) =>
            handleUpdateKycStatus(selectedProcessor._id, status, notes)
          }
        />
      )}

      {selectedProcessor && viewMode === "view" && (
        <ViewProcessorModal
          processor={selectedProcessor}
          onClose={() => {
            setSelectedProcessor(null);
            setViewMode(null);
          }}
        />
      )}

      <table className="w-full text-sm">
        <thead className="bg-white text-[#5C6474] border-b border-white">
          <tr>
            <th className="text-left px-6 py-3">Name</th>
            <th className="text-left px-6 py-3">Contacts</th>
            <th className="text-left px-6 py-3">Facility Name</th>
            <th className="text-left px-6 py-3">License Number</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Date submitted</th>
            <th className="text-left px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="text-[#222]">
          {processors.map((processor, index) => (
            <tr key={index} className="border-t border-white">
              <td className="px-6 py-4 font-semibold">{`${processor.firstName} ${processor.lastName}`}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-sm">{processor.phone}</div>
                <div className="text-xs text-[#5C6474]">{processor.email}</div>
              </td>
              <td className="px-6 py-4">
                {processor.processorInfo?.facilityName || "Not specified"}
              </td>
              <td className="px-6 py-4">
                {processor.processorInfo?.licenseNumber || "Not specified"}
              </td>
              <td className="px-6 py-4">
                <span className={getStatusBadge(processor.kyc.status)}>
                  {processor.kyc.status.charAt(0).toUpperCase() +
                    processor.kyc.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                {formatDate(processor.kyc.submittedAt)}
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
                        const currentProcessor = processor;
                        setSelectedProcessor(currentProcessor);
                        setViewMode(
                          currentProcessor.kyc.status.toLowerCase() ===
                            "pending"
                            ? "review"
                            : "view"
                        );
                      }}
                    >
                      {processor.kyc.status.toLowerCase() === "pending"
                        ? "Review processor"
                        : "View processor"}
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
          Page 1 of {Math.ceil(processors.length / 10)}
        </span>
        <Button className="bg-[#E7B35A] hover:bg-[#e0a844] text-white px-4">
          Next Page
        </Button>
      </div>
    </div>
  );
}
