import { useState } from "react";
import { X, FileText, CornerUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApproveFarmModal from "./ApproveFarmModal";
import RejectFarmModal from "./RejectFarmModal";
import { Farm } from "../tables/FarmTable";
import { FarmAdmin } from "@/lib/routes";

interface Props {
  onClose: () => void;
  farm: Farm;
}

export default function ViewFarmModal({ onClose, farm }: Props) {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleApprove = async (notes: string) => {
    try {
      const response = await fetch(`${FarmAdmin}approve-creation/${farm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
          adminNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve farm");
      }

      console.log("✅ Farm approved with notes:", notes);
      setShowApprovalModal(false);
      onClose();
    } catch (error) {
      console.error("Error approving farm:", error);
    }
  };

  const handleReject = async (notes: string) => {
    try {
      const response = await fetch(`${FarmAdmin}approve-creation/${farm._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          adminNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject farm");
      }

      setShowRejectionModal(false);
      onClose();
    } catch (error) {
      console.error("Error rejecting farm:", error);
    }
  };

  const statusColor =
    farm.status === "approved"
      ? "bg-[#3AB85E]"
      : farm.status === "rejected"
        ? "bg-[#FF5C5C]"
        : "bg-[#339DFF]";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getCoordinatesString = () => {
    if (farm.latitude && farm.longitude) {
      return `(${farm.latitude}, ${farm.longitude})`;
    }
    return "Not specified";
  };

  const getPerimeterString = () => {
    return farm.perimeter ? `${farm.perimeter}m` : "Not specified";
  };

  const getAreaString = () => {
    return farm.area ? `${farm.area} sq m` : "Not specified";
  };

  const getFarmerName = () => {
    return farm.farmerId
      ? `${farm.farmerId.firstName} ${farm.farmerId.lastName}`
      : "Unknown";
  };

  // Create audit logs
  const auditLogs = [
    {
      text: `Farm added by ${getFarmerName()}`,
      date: formatDate(farm.createdAt),
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl rounded-md shadow-xl relative overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg text-black">Farm Details</h2>
            <button onClick={onClose} className="text-gray-700 bg-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="border border-yellow-400 bg-[#FFF8E7] rounded-md p-4 flex items-start gap-4">
              {/* Left: farm icon or image */}
              <img
                src="/images/farm-outline.png"
                alt="farm icon"
                className="w-20 h-20 object-contain"
              />

              {/* Right: farm info */}
              <div className="grid gap-1 text-sm w-full">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-black">
                    {farm.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates</span>
                  <span className="font-medium text-black">
                    {getCoordinatesString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perimeter</span>
                  <span className="font-medium text-[#004C3F]">
                    {getPerimeterString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area</span>
                  <span className="font-medium text-[#004C3F]">
                    {getAreaString()}
                  </span>
                </div>
              </div>

              {/* Optional: corner icon */}
              <button
                onClick={() => {
                  // Navigate to view farm map page
                  // Replace with useNavigate() if using React Router
                  window.location.href = `/view-farm-map/${farm._id}`;
                }}
                className="p-1 bg-[#FFF8E7]"
                title="View farm polygon on map"
              >
                <CornerUpRight className="w-5 h-5 text-yellow-500 self-start cursor-pointer" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-black">
                {farm.farmName}
              </h3>
              <span
                className={`text-white text-xs px-3 py-1 rounded-full ${statusColor}`}
              >
                {farm.status.charAt(0).toUpperCase() + farm.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="text-gray-500">Year farm started</div>
              <div className="font-medium text-black text-right">
                {farm.yearEstablished
                  ? new Date(farm.yearEstablished).getFullYear()
                  : "Not specified"}
              </div>

              <div className="text-gray-500">Total coffee trees on farm</div>
              <div className="font-medium text-black text-right">
                {farm.numberofTrees || "Not specified"}
              </div>

              <div className="text-gray-500">Cultivation methods</div>
              <div className="font-medium text-black text-right space-x-2">
                {farm.cultivationMethods && farm.cultivationMethods.length > 0
                  ? farm.cultivationMethods.map((m, i) => (
                      <span key={i}>{m}</span>
                    ))
                  : "Not specified"}
              </div>

              <div className="text-gray-500">Certifications</div>
              <div className="font-medium text-black text-right space-x-2">
                {farm.certifications && farm.certifications.length > 0
                  ? farm.certifications.map((c, i) => <span key={i}>{c}</span>)
                  : "None"}
              </div>

              <div className="text-gray-500">Date added</div>
              <div className="font-medium text-black text-right">
                {formatDate(farm.createdAt)}
              </div>

              <div className="text-gray-500">Farmer</div>
              <div className="font-medium text-black text-right">
                {getFarmerName()}
              </div>
            </div>

            {farm.documents && farm.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black mb-2">
                  Documents
                </h3>
                <div className="space-y-2">
                  {farm.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-gray-100 border rounded px-3 py-2"
                    >
                      <FileText className="w-5 h-5 mr-2 text-black" />
                      <span className="text-sm text-black">{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-black mb-1">
                Audit Logs
              </h3>
              <div className="text-sm border-l-4 pl-3 border-blue-500 space-y-2">
                {auditLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <p className="text-black">
                      <span className="text-blue-500">●</span> {log.text}
                    </p>
                    <p className="text-gray-500 text-xs">{log.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowRejectionModal(true)}
              >
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setShowApprovalModal(true)}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApproveFarmModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleApprove}
      />
      <RejectFarmModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onReject={handleReject}
      />
    </>
  );
}
