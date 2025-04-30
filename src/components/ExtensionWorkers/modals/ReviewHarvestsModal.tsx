import { X, CornerUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ApproveHarvestsModal from "./ApproveHarvestsModal";
import RejectHarvestsModal from "./RejectHarvestsModal";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";

interface Harvest {
  _id: string;
  farm: {
    farmName: string;
    location: string;
  } | null;
  farmerId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  weight: number;
  status: string;
  createdAt: string;
  id?: string;
  farmId?: string;
  coordinates?: string;
  perimeter?: string;
  area?: string;
  coffeeVariety?: string;
  expectedYield?: string;
  plantingPeriod?: {
    start: string;
    end: string;
  } | null;
  harvestPeriod?:
    | {
        start: string;
        end: string;
      }
    | string
    | null;
  cultivationMethods?: string[];
  auditLogs?: {
    text: string;
    date: string;
  }[];
}


interface HarvestProps {
  onClose: () => void;
  harvest: Harvest;
}

export default function ReviewHarvestsModal({
  onClose,
  harvest,
}: HarvestProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const { authToken } = useAuth();

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `${API_URL}/admin/harvests/${harvest._id}/approve-flagged`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setShowApprovalModal(false);
        onClose();
      } else {
        console.error("Failed to approve flagged harvest");
      }
    } catch (error) {
      console.error("Error approving flagged harvest:", error);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      const response = await fetch(
        `/api/harvests/${harvest._id}/reject-flagged`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (response.ok) {
        setShowRejectionModal(false);
        onClose();
      } else {
        console.error("Failed to reject flagged harvest");
      }
    } catch (error) {
      console.error("Error rejecting flagged harvest:", error);
    }
  };
  // const statusColor =
  //   harvest.status === "Approved"
  //     ? "bg-[#3AB85E]"
  //     : harvest.status === "Rejected"
  //       ? "bg-[#FF5C5C]"
  //       : harvest.status === "Flagged"
  //         ? "bg-[#E7B35A]"
  //         : "bg-[#339DFF]";
  // const statusColor =
  //   harvest.status === "Approved"
  //     ? "bg-[#3AB85E]"
  //     : harvest.status === "Rejected"
  //       ? "bg-[#FF5C5C]"
  //       : harvest.status === "Flagged"
  //         ? "bg-[#E7B35A]"
  //         : "bg-[#339DFF]";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl rounded-md shadow-xl relative overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg text-black">
              Review Flagged Harvest
            </h2>
            <button onClick={onClose} className="text-gray-700 bg-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Location Summary */}
            <div className="border border-yellow-400 bg-[#FFF8E7] rounded-md p-4 flex gap-4 items-start">
              <img
                src="/images/farm-outline.png"
                alt="farm-icon"
                className="w-20 h-20 object-contain"
              />
              {/* Right: farm info */}
              <div className="grid gap-1 text-sm w-full">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-black">
                    {harvest.farm?.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coordinates</span>
                  <span className="font-medium text-black">
                    {harvest.coordinates || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perimeter</span>
                  <span className="font-medium text-[#004C3F]">
                    {harvest.perimeter || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Area</span>
                  <span className="font-medium text-[#004C3F]">
                    {harvest.area || "N/A"}
                  </span>
                </div>
              </div>
              {/* Optional: corner icon */}
              <button
                onClick={() => {
                  // Navigate to view farm map page
                  window.location.href = `/view-farm-map?id=${harvest._id}`;
                }}
                className="p-1 bg-[#FFF8E7]"
                title="View farm polygon on map"
              >
                <CornerUpRight className="w-5 h-5 text-yellow-500 self-start cursor-pointer" />
              </button>
            </div>

            {/* Flagged Status Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <h3 className="text-amber-700 font-medium mb-1">
                Flagged Harvest
              </h3>
              <p className="text-amber-600 text-sm">
                This harvest has been flagged for review due to potential
                issues. Please check the details carefully before approving or
                rejecting.
              </p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="text-gray-500">Harvest ID</div>
              <div className="font-medium text-black text-right">
                {harvest._id || harvest.id}
              </div>

              <div className="text-gray-500">Farm</div>
              <div className="font-medium text-black text-right">
                {typeof harvest.farm === "object"
                  ? harvest.farm?.farmName
                  : harvest.farm}{" "}
                <span className="text-sm text-gray-400 ml-2">
                  {harvest.farmId}
                </span>
              </div>

              <div className="text-gray-500">Coffee variety</div>
              <div className="font-medium text-black text-right">
                {harvest.coffeeVariety || "N/A"}
              </div>

              <div className="text-gray-500">Number of bags</div>
              <div className="font-medium text-black text-right">
                {harvest.weight ? `${harvest.weight} Bags` : "N/A"}
              </div>

              <div className="text-gray-500">Expected yield</div>
              <div className="font-medium text-black text-right">
                {harvest.expectedYield || "N/A"}
              </div>

              <div className="text-gray-500">Date of planting</div>
              <div className="font-medium text-black text-right">
                {harvest.plantingPeriod?.start || "N/A"}
              </div>

              <div className="text-gray-500">Harvest period</div>
              <div className="font-medium text-black text-right">
                {harvest.harvestPeriod &&
                typeof harvest.harvestPeriod === "object"
                  ? `${harvest.harvestPeriod.start} - ${harvest.harvestPeriod.end}`
                  : harvest.harvestPeriod || "N/A"}
              </div>

              <div className="text-gray-500">Date added</div>
              <div className="font-medium text-black text-right">
                {harvest.createdAt
                  ? new Date(harvest.createdAt).toLocaleDateString()
                  : "N/A"}
              </div>

              <div className="text-gray-500">Farming methods</div>
              <div className="font-medium text-black text-right">
                {harvest.cultivationMethods?.join(", ") || "N/A"}
              </div>

              <div className="text-gray-500">Farmer</div>
              <div className="font-medium text-black text-right">
                {harvest.farmerId
                  ? `${harvest.farmerId.firstName} ${harvest.farmerId.lastName}`
                  : "N/A"}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-black">
                Images of Harvest
              </h3>
              <div
                className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                onClick={() => handleImageClick("/images/coffeeleaf.jpg")}
              >
                <img
                  src="/images/image-placeholder.svg"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-sm text-black">Coffee.jpg</span>
              </div>
            </div>

            {/* Audit Logs */}
            {harvest.auditLogs && harvest.auditLogs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-black mb-1">
                  Audit Logs
                </h3>
                <div className="text-sm border-l-4 pl-3 border-blue-500 space-y-1">
                  {harvest.auditLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="text-black">
                        <span
                          className="mr-2"
                          style={{
                            color: log.text.includes("rejected")
                              ? "#FF5C5C"
                              : "#3AB85E",
                          }}
                        >
                          ●
                        </span>
                        {log.text}
                      </p>
                      <p className="text-gray-500 text-xs">{log.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative bg-white p-4 rounded shadow-xl">
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[80vh] max-w-[90vw] rounded-md"
            />
          </div>
        </div>
      )}

      <ApproveHarvestsModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleApprove}
      />
      <RejectHarvestsModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onReject={handleReject}
      />
    </>
  );
}