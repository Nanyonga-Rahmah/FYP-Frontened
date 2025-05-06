import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApproveFarmerModal from "./ApproveFarmerModal";
import RejectFarmerModal from "./RejectFarmerModal";
import { AllUsers } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";

type Processor = {
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
};

interface Props {
  processor: Processor;
  onClose: () => void;
  onSubmit?: (status: string, notes: string) => Promise<void>;
}

export default function ViewProcessorModal({
  processor,
  onClose,
  onSubmit,
}: Props) {
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

  const handleApprove = async (notes: string) => {
    try {
      const response = await fetch(`${AllUsers}${processor._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: "approved",
          adminNotes: notes,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Approval failed");

      if (onSubmit) await onSubmit("approved", notes);
    } catch (error) {
      console.error("Error approving processor:", error);
    } finally {
      setShowApprovalModal(false);
    }
  };

  const handleReject = async (notes: string) => {
    try {
      const response = await fetch(`${AllUsers}${processor._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          status: "rejected",
          adminNotes: notes,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Rejection failed");

      if (onSubmit) await onSubmit("rejected", notes);
    } catch (error) {
      console.error("Error rejecting processor:", error);
    } finally {
      setShowRejectionModal(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
        <div className="bg-white w-full max-w-xl rounded-md shadow-xl relative overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg text-center w-full -ml-4 text-black">
              Processor Details
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-700 bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                KYC-{processor._id.substring(0, 3)}
              </p>
              <span
                className={`text-white text-xs px-3 py-1 rounded-full ${
                  processor.kyc.status.toLowerCase() === "approved"
                    ? "bg-[#3AB85E]"
                    : processor.kyc.status.toLowerCase() === "rejected"
                      ? "bg-[#FF5C5C]"
                      : "bg-[#339DFF]"
                }`}
              >
                {processor.kyc.status.charAt(0).toUpperCase() +
                  processor.kyc.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="text-gray-500">UserID</div>
              <div className="font-medium text-right text-black">
                U-{processor._id.substring(0, 3)}
              </div>

              <div className="text-gray-500">Name</div>
              <div className="font-medium text-black text-right">
                {processor.firstName} {processor.lastName}
              </div>

              <div className="text-gray-500">Phone</div>
              <div className="font-medium text-black text-right">
                {processor.phone}
              </div>

              <div className="text-gray-500">Email</div>
              <div className="font-medium text-black text-right">
                {processor.email}
              </div>

              <div className="text-gray-500">ID Number</div>
              <div className="font-medium text-black text-right">
                {processor.kyc.nationalIdNumber}
              </div>

              <div className="text-gray-500">Facility Name</div>
              <div className="text-black text-right">
                {processor.processorInfo?.facilityName || "Not specified"}
              </div>

              <div className="text-gray-500">License Number</div>
              <div className="font-medium text-black text-right">
                {processor.processorInfo?.licenseNumber || "Not specified"}
              </div>

              <div className="text-gray-500">Location</div>
              <div className="font-medium text-black text-right">
                {processor.kyc.cooperativeLocation}
              </div>

              <div className="text-gray-500">Date submitted</div>
              <div className="font-medium text-black text-right">
                {formatDate(processor.kyc.submittedAt)}
              </div>
            </div>

            {/* ID Photos */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-black">ID Photo</h3>
              <div className="space-y-2">
                <div
                  className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                  onClick={() =>
                    handleImageClick(processor.kyc.nationalIdPhoto)
                  }
                >
                  <img
                    src="/images/image-placeholder.svg"
                    alt="icon"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm text-black">national-id.jpg</span>
                </div>
              </div>
            </div>

            {/* Passport Photo */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-black">
                Passport size Photo
              </h3>
              <div
                className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                onClick={() =>
                  handleImageClick(processor.kyc.passportSizePhoto)
                }
              >
                <img
                  src="/images/image-placeholder.svg"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-sm text-black">
                  {processor.firstName}.jpg
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1 text-sm">
              <h3 className="font-medium">Timeline</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <p className="text-black">
                  {processor.firstName} {processor.lastName} #U-
                  {processor._id.substring(0, 3)} created account
                </p>
                <span className="ml-auto text-gray-500">
                  {formatDateTime(processor.kyc.submittedAt)}
                </span>
              </div>
              {processor.kyc.processedAt && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 ${processor.kyc.status.toLowerCase() === "approved" ? "bg-green-500" : "bg-red-500"} rounded-full`}
                  ></div>
                  <p className="text-black">
                    {processor.kyc.status.toLowerCase() === "approved"
                      ? "Approved"
                      : "Rejected"}{" "}
                    by admin
                  </p>
                  <span className="ml-auto text-gray-500">
                    {formatDateTime(processor.kyc.processedAt)}
                  </span>
                </div>
              )}
            </div>

            {processor.kyc.adminNotes && (
              <div className="space-y-1">
                <h3 className="font-medium">Admin Notes</h3>
                <div className="bg-gray-100 p-2 rounded text-sm">
                  {processor.kyc.adminNotes}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {processor.kyc.status.toLowerCase() === "pending" && onSubmit && (
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
            )}
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

      {/* Modals */}
      <ApproveFarmerModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onApprove={handleApprove}
      />
      <RejectFarmerModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onReject={handleReject}
      />
    </>
  );
}
