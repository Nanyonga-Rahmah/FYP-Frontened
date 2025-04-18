import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApproveFarmerModal from "./ApproveFarmerModal";
import RejectFarmerModal from "./RejectFarmerModal";

type Farmer = {
    name: string;
    phone: string;
    email: string;
    idNumber: string;
    subcounty: string;
    status: string;
    date: string;
};

interface Props {
    farmer: Farmer;
    onClose: () => void;
}

export default function ViewFarmerModal({ farmer, onClose }: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    const handleApprove = (notes: string) => {
        console.log("✅ Approved farmer with notes:", notes);
        setShowApprovalModal(false);
        // Submit approval logic
    };

    const handleReject = (notes: string) => {
        console.log("❌ Rejected farmer with notes:", notes);
        setShowRejectionModal(false);
        // Submit rejection logic
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
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 bg-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">KYC-001</p>
                            <span
                                className={`text-white text-xs px-3 py-1 rounded-full ${farmer.status === "Approved"
                                        ? "bg-[#3AB85E]"
                                        : farmer.status === "Rejected"
                                            ? "bg-[#FF5C5C]"
                                            : "bg-[#339DFF]"
                                    }`}
                            >
                                {farmer.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="text-gray-500">UserID</div>
                            <div className="font-medium text-right text-black">U-09M</div>

                            <div className="text-gray-500">Name</div>
                            <div className="font-medium text-black text-right">{farmer.name}</div>

                            <div className="text-gray-500">Phone</div>
                            <div className="font-medium text-black text-right">{farmer.phone}</div>

                            <div className="text-gray-500">Email</div>
                            <div className="font-medium text-black text-right">{farmer.email}</div>

                            <div className="text-gray-500">ID Number</div>
                            <div className="font-medium text-black text-right">{farmer.idNumber}</div>

                            <div className="text-gray-500">Cooperative membership number</div>
                            <div className="text-black text-right">BG-090mn</div>

                            <div className="text-gray-500">Sub-county</div>
                            <div className="font-medium text-black text-right">{farmer.subcounty}</div>

                            <div className="text-gray-500">Cooperative</div>
                            <div className="font-medium text-black text-right">Bugisu Cooperative Union</div>

                            <div className="text-gray-500">Date submitted</div>
                            <div className="font-medium text-black text-right">{farmer.date}</div>
                        </div>

                        {/* ID Photos */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-black">ID Photo</h3>
                            <div className="space-y-2">
                                {["/images/front-id.jpg", "/images/back-id.jpg"].map((src, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                                        onClick={() => handleImageClick(src)}
                                    >
                                        <img src="/images/image-placeholder.svg" alt="icon" className="w-5 h-5 mr-2" />
                                        <span className="text-sm text-black">{src.split("/").pop()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Passport Photo */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-black">Passport size Photo</h3>
                            <div
                                className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                                onClick={() => handleImageClick("/images/passport.jpg")}
                            >
                                <img src="/images/image-placeholder.svg" alt="icon" className="w-5 h-5 mr-2" />
                                <span className="text-sm text-black">Mary.jpg</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-1 text-sm">
                            <h3 className="font-medium">Timeline</h3>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <p className="text-black">{farmer.name} #U-09M created account</p>
                                <span className="ml-auto text-gray-500">2025-03-28 10:30:15</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                <p className="text-black">Kayongo #U-09M rejected Mary</p>
                                <span className="ml-auto text-gray-500">2025-03-28 11:30:15</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
                        <Button variant="outline" onClick={onClose}>Close</Button>
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
