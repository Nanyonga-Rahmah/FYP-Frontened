import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApproveFarmerModal from "./ApproveFarmerModal";
import RejectFarmerModal from "./RejectFarmerModal";
import { AllUsers } from "@/lib/routes"
import useAuth from "@/hooks/use-auth";
type Farmer = {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cooperativeMembershipNumber?: string;
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
  farmer: Farmer;
  onClose: () => void;
  onSubmit?: (status: string, notes: string) => Promise<void>;
}

export default function ViewFarmerModal({ farmer, onClose, onSubmit }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };
const {authToken} = useAuth()
  const handleApprove = async (notes: string) => {
    try {
      const response = await fetch(`${AllUsers}${farmer._id}/status`, {
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
      console.error("Error approving farmer:", error);
    } finally {
      setShowApprovalModal(false);
    }
  };

  const handleReject = async (notes: string) => {
    try {
      const response = await fetch(`${AllUsers}${farmer._id}/status`, {
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
      console.error("Error rejecting farmer:", error);
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
              Farmer Details
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
                KYC-{farmer._id.substring(0, 3)}
              </p>
              <span
                className={`text-white text-xs px-3 py-1 rounded-full ${
                  farmer.kyc.status.toLowerCase() === "approved"
                    ? "bg-[#3AB85E]"
                    : farmer.kyc.status.toLowerCase() === "rejected"
                      ? "bg-[#FF5C5C]"
                      : "bg-[#339DFF]"
                }`}
              >
                {farmer.kyc.status.charAt(0).toUpperCase() +
                  farmer.kyc.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div className="text-gray-500">UserID</div>
              <div className="font-medium text-right text-black">
                U-{farmer._id.substring(0, 3)}
              </div>

              <div className="text-gray-500">Name</div>
              <div className="font-medium text-black text-right">
                {farmer.firstName} {farmer.lastName}
              </div>

              <div className="text-gray-500">Phone</div>
              <div className="font-medium text-black text-right">
                {farmer.phone}
              </div>

              <div className="text-gray-500">Email</div>
              <div className="font-medium text-black text-right">
                {farmer.email}
              </div>

              <div className="text-gray-500">ID Number</div>
              <div className="font-medium text-black text-right">
                {farmer.kyc.nationalIdNumber}
              </div>

              <div className="text-gray-500">Cooperative membership number</div>
              <div className="text-black text-right">
                {farmer.cooperativeMembershipNumber || "BG-090mn"}
              </div>

              <div className="text-gray-500">Sub-county</div>
              <div className="font-medium text-black text-right">
                {farmer.kyc.cooperativeLocation}
              </div>

              <div className="text-gray-500">Cooperative</div>
              <div className="font-medium text-black text-right">
                Bugisu Cooperative Union
              </div>

              <div className="text-gray-500">Date submitted</div>
              <div className="font-medium text-black text-right">
                {formatDate(farmer.kyc.submittedAt)}
              </div>
            </div>

            {/* ID Photos */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-black">ID Photo</h3>
              <div className="space-y-2">
                <div
                  className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                  onClick={() => handleImageClick(farmer.kyc.nationalIdPhoto)}
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
                onClick={() => handleImageClick(farmer.kyc.passportSizePhoto)}
              >
                <img
                  src="/images/image-placeholder.svg"
                  alt="icon"
                  className="w-5 h-5 mr-2"
                />
                <span className="text-sm text-black">
                  {farmer.firstName}.jpg
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1 text-sm">
              <h3 className="font-medium">Timeline</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <p className="text-black">
                  {farmer.firstName} {farmer.lastName} #U-
                  {farmer._id.substring(0, 3)} created account
                </p>
                <span className="ml-auto text-gray-500">
                  {formatDateTime(farmer.kyc.submittedAt)}
                </span>
              </div>
              {farmer.kyc.processedAt && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 ${farmer.kyc.status.toLowerCase() === "approved" ? "bg-green-500" : "bg-red-500"} rounded-full`}
                  ></div>
                  <p className="text-black">
                    {farmer.kyc.status.toLowerCase() === "approved"
                      ? "Approved"
                      : "Rejected"}{" "}
                    by admin
                  </p>
                  <span className="ml-auto text-gray-500">
                    {formatDateTime(farmer.kyc.processedAt)}
                  </span>
                </div>
              )}
            </div>

            {farmer.kyc.adminNotes && (
              <div className="space-y-1">
                <h3 className="font-medium">Admin Notes</h3>
                <div className="bg-gray-100 p-2 rounded text-sm">
                  {farmer.kyc.adminNotes}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {farmer.kyc.status.toLowerCase() === "pending" && onSubmit && (
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
