import { useState } from "react";
import { X, FileText, CornerUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApproveFarmModal from "./ApproveFarmModal";
import RejectFarmModal from "./RejectFarmModal";

interface FarmData {
    name: string;
    location: string;
    coordinates: string;
    perimeter: string;
    area: string;
    yearStarted: string;
    coffeeTrees: string;
    methods: string[];
    certifications: string[];
    dateAdded: string;
    farmer: string;
    documents: string[];
    status: string;
    notes?: string;
    auditLogs: {
        text: string;
        date: string;
    }[];
}

interface Props {
    onClose: () => void;
    farm: FarmData;
}

export default function ReviewFarmModal({ onClose, farm }: Props) {
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);

    const handleApprove = (notes: string) => {
        console.log("✅ Farm approved with notes:", notes);
        setShowApprovalModal(false);
    };

    const handleReject = (notes: string) => {
        console.log("❌ Farm rejected with notes:", notes);
        setShowRejectionModal(false);
    };

    const statusColor =
        farm.status === "Approved"
            ? "bg-[#3AB85E]"
            : farm.status === "Rejected"
                ? "bg-[#FF5C5C]"
                : "bg-[#339DFF]";

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
                            <img src="/images/farm-outline.png" alt="farm icon" className="w-20 h-20 object-contain" />

                            {/* Right: farm info */}
                            <div className="grid gap-1 text-sm w-full">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium text-black">{farm.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Coordinates</span>
                                    <span className="font-medium text-black">{farm.coordinates}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Perimeter</span>
                                    <span className="font-medium text-[#004C3F]">{farm.perimeter}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Area</span>
                                    <span className="font-medium text-[#004C3F]">{farm.area}</span>
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
                            </button>
                        </div>


                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-black">{farm.name}</h3>
                            <span className={`text-white text-xs px-3 py-1 rounded-full ${statusColor}`}>{farm.status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div className="text-gray-500">Year farm started</div>
                            <div className="font-medium text-black text-right">{farm.yearStarted}</div>

                            <div className="text-gray-500">Total coffee trees on farm</div>
                            <div className="font-medium text-black text-right">{farm.coffeeTrees}</div>

                            <div className="text-gray-500">Cultivation methods</div>
                            <div className="font-medium text-black text-right space-x-2">
                                {farm.methods.map((m, i) => <span key={i}>{m}</span>)}
                            </div>

                            <div className="text-gray-500">Certifications</div>
                            <div className="font-medium text-black text-right space-x-2">
                                {farm.certifications.map((c, i) => <span key={i}>{c}</span>)}
                            </div>

                            <div className="text-gray-500">Date added</div>
                            <div className="font-medium text-black text-right">{farm.dateAdded}</div>

                            <div className="text-gray-500">Farmer</div>
                            <div className="font-medium text-black text-right">{farm.farmer}</div>

                            {farm.status === "Rejected" && (
                                <>
                                    <div className="text-gray-500">Notes</div>
                                    <div className="font-medium text-black text-right">{farm.notes}</div>
                                </>
                            )}

                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-black mb-2">Documents</h3>
                            <div className="space-y-2">
                                {farm.documents.map((doc, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center bg-gray-100 border rounded px-3 py-2"
                                    >
                                        <FileText className="w-5 h-5 mr-2 text-black" />
                                        <span className="text-sm text-black">{doc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-black mb-1">Audit Logs</h3>
                            <div className="text-sm border-l-4 pl-3 border-blue-500 space-y-2">
                                {/* Existing audit logs */}
                                {farm.auditLogs.map((log, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <p className="text-black">
                                            <span className="text-blue-500">●</span> {log.text}
                                        </p>
                                        <p className="text-gray-500 text-xs">{log.date}</p>
                                    </div>
                                ))}

                                {/* Status-based custom log */}
                                {farm.status === "Rejected" && (
                                    <div className="flex justify-between items-center">
                                        <p className="text-black">
                                            <span className="text-[#FF5C5C]">●</span> Farm rejected by Nsereko Julius
                                        </p>
                                        <p className="text-gray-500 text-xs">{new Date().toLocaleString()}</p>
                                    </div>
                                )}

                                {farm.status === "Approved" && (
                                    <div className="flex justify-between items-center">
                                        <p className="text-black">
                                            <span className="text-[#3AB85E]">●</span> Farm approved by Rahma
                                        </p>
                                        <p className="text-gray-500 text-xs">{new Date().toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    <div className="px-6 py-4 border-t bg-white flex justify-between items-center text-black">
                        <Button variant="outline" onClick={onClose}>Close</Button>
                        <div className="flex gap-2">
                            <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowRejectionModal(true)}>
                                Reject
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowApprovalModal(true)}>
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
