import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConfirmDeliveryForm } from "@/components/exporter/modals/ConfirmDeliveryModal";


function ViewLotDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"lot" | "exporter">("lot");
    const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);

    return (
        <section
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)" }}
        >
            <Header />
            <section className="flex-1 px-20 pt-10 pb-20">
                {/* Greeting */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                            RA
                        </div>
                        <div>
                            <span className="text-[#C0C9DDE5]">Greetings,</span>
                            <br />
                            <span className="font-semibold text-xl text-white">Rahmah Akello</span>
                        </div>
                    </div>
                    <div>
                        <Button className="bg-[#E7B35A] text-white rounded-md px-4 py-2">ABC Coffee Exporters Ltd</Button>
                    </div>
                </div>

                {/* Page Title */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-transparent mt-10">
                    <img src="/images/back.png" alt="Back" className="w-5 h-5" />
                    <span className="text-white text-2xl font-semibold">Lot Details</span>
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col gap-8 border border-gray-200">
                    {/* Lot header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-lg text-[#0F2A38]">{id}</span>
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    Submitted
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-2">
                                <p>
                                    <span className="font-medium text-[#0F2A38]">Variety:</span> Robusta, Arabica
                                </p>
                                <p>
                                    <span className="font-medium text-[#0F2A38]">Submitted:</span> Nov 30, 2026
                                </p>
                                <p>
                                    <span className="font-medium text-[#0F2A38]">Processor:</span> Kyagalanyi Processors
                                </p>
                            </div>
                        </div>
                        <Button
                            className="bg-[#0F2A38] text-white rounded-md"
                            onClick={() => setConfirmDeliveryOpen(true)}
                        >
                            Mark Delivered
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("lot")}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "lot" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            Lot details
                        </button>
                        <button
                            onClick={() => setActiveTab("exporter")}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "exporter" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                                }`}
                        >
                            Exporter info
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex mt-4">
                        {/* Left Column */}
                        <div className="w-2/3 flex flex-col gap-8 pr-6">
                            {activeTab === "lot" ? (
                                <>
                                    {/* Lot summary */}
                                    <div>
                                        <h3 className="text-[#0F2A38] font-semibold mb-4">Lot summary (40 batches)</h3>
                                        <div className="border border-gray-200 rounded-md overflow-hidden">
                                            <table className="w-full text-sm text-gray-700">
                                                <thead className="bg-gray-100 text-gray-500">
                                                    <tr>
                                                        <th className="p-3 text-left">Batch ID</th>
                                                        <th className="p-3 text-left">Variety</th>
                                                        <th className="p-3 text-left">Weight</th>
                                                        <th className="p-3 text-left">Farm location</th>
                                                        <th className="p-3 text-left">Delivered Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-t">
                                                        <td className="p-3">BH-001</td>
                                                        <td className="p-3">Arabica</td>
                                                        <td className="p-3">20 kg</td>
                                                        <td className="p-3">Kasese</td>
                                                        <td className="p-3">Nov 31, 2026</td>
                                                    </tr>
                                                    <tr className="border-t">
                                                        <td className="p-3">BH-001</td>
                                                        <td className="p-3">Arabica, Robusta</td>
                                                        <td className="p-3">20 kg</td>
                                                        <td className="p-3">Mubende</td>
                                                        <td className="p-3">Nov 31, 2026</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Additional info */}
                                    <div className="flex flex-col gap-2 text-gray-700 text-sm">
                                        {/* Total lot weight */}
                                        <div className="flex justify-between">
                                            <span className="font-medium text-[#0F2A38]">Total lot weight:</span>
                                            <span>4000kg</span>
                                        </div>

                                        {/* Processing unit */}
                                        <div className="flex justify-between">
                                            <span className="font-medium text-[#0F2A38]">Processing unit:</span>
                                            <span>Coffee World Ltd</span>
                                        </div>

                                        {/* Comments */}
                                        <div className="flex justify-between">
                                            <span className="font-medium text-[#0F2A38]">Comments:</span>
                                            <span>Handle with care</span>
                                        </div>
                                    </div>

                                    {/* Farm details */}
                                    <div>
                                        <h3 className="text-[#0F2A38] font-semibold mb-4">Farm details</h3>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                                                <img src="/images/farm-area.png" alt="Farm" className="w-10 h-10" />
                                                <div>
                                                    <p className="font-semibold text-[#0F2A38]">Sunrise Coffee Estate (40 Hectares)</p>
                                                    <p className="text-gray-500 text-sm">Kabarole, Uganda</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                                                <img src="/images/farm-area.png" alt="Farm" className="w-10 h-10" />
                                                <div>
                                                    <p className="font-semibold text-[#0F2A38]">Sunrise Coffee Estate (40 Hectares)</p>
                                                    <p className="text-gray-500 text-sm">Kabarole, Uganda</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Exporter Info */}
                                    <div className="flex flex-col gap-6 text-sm text-gray-700">
                                        {/* Delivery Summary */}
                                        <div>
                                            <h3 className="text-[#0F2A38] font-semibold mb-4">Delivery summary</h3>
                                            <div className="flex flex-col gap-4"> {/* vertical gap between fields */}
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Bags received:</span>
                                                    <span>40 bags</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Date received:</span>
                                                    <span>Nov 30, 2026</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Notes:</span>
                                                    <span>Received intact</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Export Details */}
                                        <div>
                                            <h3 className="text-[#0F2A38] font-semibold mb-4">Export details</h3>
                                            <div className="flex flex-col gap-4"> {/* vertical gap between fields */}
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Exporter:</span>
                                                    <span>Coffee World Ltd</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Destination country:</span>
                                                    <span>Germany</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Shipping details:</span>
                                                    <span>Maersk Line - Container #MAEU4712390</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Quality notes:</span>
                                                    <span>Grade AA Arabica, Moisture: 11.5%, Screen 17/18</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium text-[#0F2A38]">Export date:</span>
                                                    <span>May 3, 2027</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Attachments */}
                                        <div>
                                            <h3 className="text-[#0F2A38] font-semibold mb-4">Attachments</h3>
                                            <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center gap-3">
                                                <img src="/images/image-placeholder.svg" alt="File" className="w-5 h-5" />
                                                <span className="text-gray-600">coffee.jpg</span>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>

                        {/* Vertical Divider */}
                        <div className="w-px bg-gray-300 mx-4"></div>

                        {/* Right Column - Timeline */}
                        <div className="w-1/3 pl-6">
                            <h3 className="text-[#0F2A38] font-semibold mb-4">Timeline</h3>
                            <div className="relative flex flex-col gap-6">
                                {/* Vertical Line */}
                                {activeTab === "exporter" && (
                                    <div className="absolute top-2 left-2 w-px h-full bg-gray-300"></div>
                                )}

                                {/* Timeline Steps */}
                                <div className="relative flex items-center gap-3">
                                    <div className="relative z-10 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <p>Submitted by Jane Smith (user ID#456)</p>
                                        <p className="text-xs text-gray-400">2025-03-28 10:30:15</p>
                                    </div>
                                </div>

                                {/* Other steps only if Exporter tab */}
                                {activeTab === "exporter" && (
                                    <>
                                        <div className="relative flex items-center gap-3">
                                            <div className="relative z-10 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                <p>Delivered by Jane Smith (user ID#456)</p>
                                                <p className="text-xs text-gray-400">2025-03-28 10:30:15</p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center gap-3">
                                            <div className="relative z-10 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                <p>Exported by Green Coffee (user ID#456)</p>
                                                <p className="text-xs text-gray-400">2025-03-28 10:30:15</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            <ConfirmDeliveryForm open={confirmDeliveryOpen} onClose={() => setConfirmDeliveryOpen(false)} />

            <Footer />
        </section>
    );
}

export default ViewLotDetailsPage;
