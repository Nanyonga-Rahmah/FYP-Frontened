import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { QRCode } from "react-qrcode-logo"; // Assuming you will use react-qrcode-logo or another QR code generator


function ConsignmentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"details" | "traceability">("details");

    return (
        <section
            className="min-h-screen flex flex-col"
            style={{ background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)" }}
        >
            <Header />
            <section className="flex-1 px-20 pt-10 pb-20">
                {/* GREETING */}
                <div className="flex items-center gap-3 mb-6">
                    <Avatar>
                        <AvatarFallback>MN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-[#C0C9DDE5]">Greetings,</p>
                        <p className="font-semibold text-xl text-white">Mary Nantongo</p>
                    </div>
                </div>

                {/* Page Title */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-transparent mt-10 mb-5">
                    <img src="/images/back.png" alt="Back" className="w-5 h-5" />
                    <span className="text-white text-2xl font-semibold">Consignment Details</span>
                </button>

                {/* MAIN CARD */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 flex flex-col gap-10">
                    {/* HEADER INFO */}
                    <div className="flex justify-between items-start flex-wrap gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-lg text-[#0F2A38]">{id}</span>
                                <span className="px-3 py-1 rounded-full bg-[#E0D7F8] text-[#6F42C1C9] text-xs font-semibold">
                                    Exported
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                                <p>
                                    <span className="text-[#0F2A38] font-medium">Variety:</span> Robusta, Arabica
                                </p>
                                <p>
                                    <span className="text-[#0F2A38] font-medium">Submitted:</span> Nov 30, 2026
                                </p>
                                <p>
                                    <span className="text-[#0F2A38] font-medium">Processor:</span> Kyagalanyi Processors
                                </p>
                                <p>
                                    <span className="text-[#0F2A38] font-medium">Exporter:</span> Green Coffee Farm
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex gap-3">
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "details" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                                }`}
                            onClick={() => setActiveTab("details")}
                        >
                            Consignment details
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "traceability" ? "bg-black text-white" : "bg-gray-100 text-gray-500"
                                }`}
                            onClick={() => setActiveTab("traceability")}
                        >
                            Traceability report
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="flex mt-2">
                        {/* LEFT */}
                        <div className="w-2/3 pr-10">
                            {activeTab === "details" ? (
                                <>
                                    <h3 className="text-[#0F2A38] font-semibold mb-4">Consignment summary (40 lots)</h3>
                                    <table className="w-full border border-gray-200 text-sm text-gray-700 rounded-md overflow-hidden">
                                        <thead className="bg-gray-100 text-gray-500">
                                            <tr>
                                                <th className="text-left p-3">Lot ID</th>
                                                <th className="text-left p-3">Variety</th>
                                                <th className="text-left p-3">Weight</th>
                                                <th className="text-left p-3">Processor</th>
                                                <th className="text-left p-3">Delivered Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="p-3">LT-001</td>
                                                <td className="p-3">Arabica</td>
                                                <td className="p-3">20 kg</td>
                                                <td className="p-3">James Muthoni</td>
                                                <td className="p-3">Nov 31, 2026</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="p-3">LT-001</td>
                                                <td className="p-3">Arabica, Robusta</td>
                                                <td className="p-3">20 kg</td>
                                                <td className="p-3">James Muthoni</td>
                                                <td className="p-3">Nov 31, 2026</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="flex flex-col gap-2 text-sm text-gray-700 mt-6">
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Total consignment weight:</span><span>4000kg</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Exporter:</span><span>Coffee World Ltd</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Destination country:</span><span>Germany</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">UCDA Export permit number:</span><span>UCDA/EXP/0653/2025</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Shipping details:</span><span>Maersk Line - Container #MAEU4712390</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Quality notes:</span><span>Grade AA Arabica, Moisture: 11.5%, Screen 17/18</span></div>
                                        <div className="flex justify-between"><span className="font-medium text-[#0F2A38]">Export date:</span><span>May 3, 2027</span></div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-sm text-[#0F2A38] font-medium mb-2">Certificate of origin</p>
                                        <div className="flex items-center gap-3 border border-gray-300 rounded-md p-3 bg-gray-50 w-fit">
                                            <img src="/images/image-placeholder.svg" alt="File" className="w-5 h-5" />
                                            <span className="text-gray-600">uganda_origin_cert_2025.jpg</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-sm text-[#0F2A38] font-medium mb-2">Exporter details</p>
                                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                                            <img src="/images/location-placeholder-colored.png" alt="Location" className="w-6 h-6" />
                                            <div>
                                                <p className="font-semibold text-[#0F2A38] text-sm">ABC Coffee Exporters Ltd</p>
                                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                                    <img src="/images/location-placeholder-bw.png" alt="Pin" className="w-3.5 h-3.5" />
                                                    Kabarole, Uganda
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                                        <p><strong>Lots:</strong> 40 lots</p>
                                        <p><strong>Lot weight:</strong> 5000kg</p>
                                        <p><strong>Batches:</strong> 600 batches</p>
                                        <p><strong>Product type:</strong> Green Coffee beans</p>
                                        <p><strong>HS Code:</strong> 0901.11 – Coffee, not roasted, not decaffeinated</p>
                                        <p><strong>Trade name:</strong> Uganda Robusta, Screen 16</p>
                                    </div>

                                    <div>
                                        <h3 className="text-[#0F2A38] font-semibold mb-3 text-sm">Traceable Batches in this Consignment</h3>
                                        <table className="w-full border border-gray-200 text-sm text-gray-700 rounded-md overflow-hidden mb-4">
                                            <thead className="bg-gray-100 text-gray-500">
                                                <tr>
                                                    <th className="text-left p-3">Batch ID</th>
                                                    <th className="text-left p-3">Farm name</th>
                                                    <th className="text-left p-3">Farm location</th>
                                                    <th className="text-left p-3">Weight</th>
                                                    <th className="text-left p-3">QR</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-t">
                                                    <td className="p-3">BH-001</td>
                                                    <td className="p-3">Mary’s plot</td>
                                                    <td className="p-3">Mbale</td>
                                                    <td className="p-3">40kg</td>
                                                    <td className="p-3">
                                                        <QRCode value="BH-001" size={40} />
                                                    </td>
                                                </tr>
                                                <tr className="border-t">
                                                    <td className="p-3">BH-001</td>
                                                    <td className="p-3">Mary’s plot</td>
                                                    <td className="p-3">Mbale</td>
                                                    <td className="p-3">40kg</td>
                                                    <td className="p-3">
                                                        <QRCode value="BH-001" size={40} />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="text-sm text-gray-700 mb-6">
                                        <h3 className="font-semibold text-[#0F2A38] mb-2">Compliance</h3>
                                        <ul className="list-disc pl-5">
                                            <li>All farms verified deforestation-free post-2020 by UCDA.</li>
                                            <li>Complies with EUDR, GDPR, Uganda Data Protection Act.</li>
                                            <li>All batches sourced from farms with verified geolocation polygons.</li>
                                        </ul>
                                    </div>

                                    <Button className="bg-[#0F2A38] text-white text-sm rounded-md px-4 py-2 w-fit">
                                        Download Due Diligence Report
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* RIGHT - TIMELINE */}
                        <div className="w-1/3">
                            <h3 className="text-[#0F2A38] font-semibold mb-4">Timeline</h3>
                            <div className="flex flex-col gap-6 text-sm text-gray-700">
                                {[
                                    { color: "green", label: "Submitted by Jane Smith(user ID#456)" },
                                    { color: "blue", label: "Delivered by Jane Smith(user ID#456)" },
                                    { color: "purple", label: "Exported by Green Coffee(user ID #456)" },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 bg-${step.color}-100 p-1 rounded-full`}>
                                            <div className={`bg-${step.color}-600 w-2.5 h-2.5 rounded-full`}></div>
                                        </div>
                                        <div>
                                            <p>{step.label}</p>
                                            <p className="text-xs text-gray-400">2025-03-28 10:30:15</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </section>
    );
}

export default ConsignmentDetailsPage;
