import { X, CornerUpRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ApproveHarvestsModal from "./ApproveHarvestsModal"
import RejectHarvestsModal from "./RejectHarvestsModal";

interface HarvestProps {
    onClose: () => void;
    harvest: any;
}

export default function ViewHarvestsModal({ onClose, harvest }: HarvestProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const handleImageClick = (imageSrc: string) => {
        setSelectedImage(imageSrc);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };


    // const statusColor =
    //     harvest.status === "Approved"
    //         ? "bg-[#3AB85E]"
    //         : harvest.status === "Rejected"
    //             ? "bg-[#FF5C5C]"
    //             : harvest.status === "Flagged"
    //                 ? "bg-[#E7B35A]"
    //                 : "bg-[#339DFF]";

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                <div className="bg-white w-full max-w-2xl rounded-md shadow-xl relative overflow-hidden">
                    <div className="px-6 py-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-lg text-black">Harvest Details</h2>
                        <button onClick={onClose} className="text-gray-700 bg-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
                        {/* Location Summary */}
                        <div className="border border-yellow-400 bg-[#FFF8E7] rounded-md p-4 flex gap-4 items-start">
                            <img src="/images/farm-outline.png" alt="farm-icon" className="w-20 h-20 object-contain" />
                            {/* Right: farm info */}
                            <div className="grid gap-1 text-sm w-full">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium text-black">{harvest.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Coordinates</span>
                                    <span className="font-medium text-black">{harvest.coordinates}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Perimeter</span>
                                    <span className="font-medium text-[#004C3F]">{harvest.perimeter}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Area</span>
                                    <span className="font-medium text-[#004C3F]">{harvest.area}</span>
                                </div>
                            </div>
                            {/* Optional: corner icon */}
                            <button
                                onClick={() => {
                                    // Navigate to view farm map page
                                    // Replace with useNavigate() if using React Router
                                    window.location.href = "/view-farm-map";
                                }}
                                className="p-1 bg-[#FFF8E7]"
                                title="View farm polygon on map"
                            >
                                <CornerUpRight className="w-5 h-5 text-yellow-500 self-start cursor-pointer" />
                            </button>                    </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="text-gray-500">Harvest ID</div>
                            <div className="font-medium text-black text-right">{harvest.id}</div>

                            <div className="text-gray-500">Farm</div>
                            <div className="font-medium text-black text-right">{harvest.farm} <span className="text-sm text-gray-400 ml-2">{harvest.farmId}</span></div>

                            <div className="text-gray-500">Coffee variety</div>
                            <div className="font-medium text-black text-right">{harvest.coffeeVariety}</div>

                            <div className="text-gray-500">Number of bags</div>
                            <div className="font-medium text-black text-right">{harvest.bags}</div>

                            <div className="text-gray-500">Expected yield</div>
                            <div className="font-medium text-black text-right">{harvest.expectedYield}</div>

                            <div className="text-gray-500">Date of planting</div>
                            <div className="font-medium text-black text-right">{harvest.dateOfPlanting}</div>

                            <div className="text-gray-500">Harvest period</div>
                            <div className="font-medium text-black text-right">{harvest.harvestPeriod}</div>

                            <div className="text-gray-500">Date added</div>
                            <div className="font-medium text-black text-right">{harvest.dateAdded}</div>

                            <div className="text-gray-500">Farming methods</div>
                            <div className="font-medium text-black text-right">{harvest.methods?.join(", ")}</div>

                            <div className="text-gray-500">Farmer</div>
                            <div className="font-medium text-black text-right">{harvest.farmer}</div>
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-black">images of Harvest</h3>
                            <div
                                className="flex items-center bg-gray-100 border rounded px-3 py-2 cursor-pointer"
                                onClick={() => handleImageClick("/images/coffeeleaf.jpg")}
                            >
                                <img src="/images/image-placeholder.svg" alt="icon" className="w-5 h-5 mr-2" />
                                <span className="text-sm text-black">Coffee.jpg</span>
                            </div>
                        </div>

                        {/* Audit Logs */}
                        <div>
                            <h3 className="text-sm font-medium text-black mb-1">Audit Logs</h3>
                            <div className="text-sm border-l-4 pl-3 border-blue-500 space-y-1">
                                {harvest.auditLogs.map((log: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <p className="text-black">
                                            <span className="mr-2" style={{ color: log.text.includes('rejected') ? '#FF5C5C' : '#3AB85E' }}>●</span>
                                            {log.text}
                                        </p>
                                        <p className="text-gray-500 text-xs">{log.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <div className="flex gap-2">
                            <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowRejectionModal(true)}>Reject</Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowApprovalModal(true)}>Approve</Button>
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
            <ApproveHarvestsModal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                onApprove={() => { }}
            />
            <RejectHarvestsModal
                isOpen={showRejectionModal}
                onClose={() => setShowRejectionModal(false)}
                onReject={() => { }}
            />
        </>
    );
}
