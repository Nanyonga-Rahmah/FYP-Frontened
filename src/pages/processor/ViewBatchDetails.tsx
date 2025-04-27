import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, LocateFixed, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Separator } from "@/components/ui/separator";
import { MarkDelivered } from "@/components/Processor/MarkDelivered";

function BatchDetailsPage() {
  const [activeTab, setActiveTab] = useState("Batch details");

  const tabs = ["Batch details", "Processing info", "Exporter info"];

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />
      {/* Top Section */}
      <div className="px-4 md:px-10 lg:px-20 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="text-xl">BO</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                Brian Opio
              </span>
            </div>
          </div>

          <div className="bg-[#E7B35A] flex flex-col rounded-md text-white py-1 px-2">
            <span>ABC Coffee Processing Ltd</span>
            <div className="flex items-center">
              <LocateFixed className="h-4 w-4" />
              <span>Kabarole, Uganda</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-8">
          <ArrowLeft
            className="h-4 w-4 text-white cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl font-semibold text-white">Batch Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
          {/* Batch Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2 ">
              <div className="flex items-center justify-between gap-2 ">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    BH-001
                  </h2>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Submitted
                  </span>
                </div>

                <MarkDelivered />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div>📄 Variety: Robusta, Arabica</div>
                <div>
                  <CalendarDays className="inline-block h-4 w-4 mr-1" />
                  Submitted: Nov 30, 2026
                </div>
                <div>
                  <User className="inline-block h-4 w-4 mr-1" />
                  Farmer: Jane Smith
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-white bg-[#202020] border-b-2 border-[#112D3E]"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Batch details" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side Content */}
              <div className="flex-1">
                {/* Harvest Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Harvests summary (40 bags)
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 text-left">Harvest ID</th>
                          <th className="py-2 px-4 text-left">Variety</th>
                          <th className="py-2 px-4 text-left">Weight</th>
                          <th className="py-2 px-4 text-left">
                            Harvest Period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-2 px-4">HRV-001</td>
                          <td className="py-2 px-4">Arabica</td>
                          <td className="py-2 px-4">20 bags</td>
                          <td className="py-2 px-4">
                            Nov 30, 2025 - Nov 31, 2026
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-2 px-4">HRV-002</td>
                          <td className="py-2 px-4">Arabica, Robusta</td>
                          <td className="py-2 px-4">20 bags</td>
                          <td className="py-2 px-4">
                            Nov 30, 2025 - Nov 31, 2026
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Batch Info */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Total bags</span>
                    <span className="font-semibold">40 bags</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farming methods</span>
                    <span className="font-semibold">Mulching, Weeding</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing units</span>
                    <span className="text-right space-y-1">
                      <div className="font-semibold">Coffee World Ltd</div>
                      <div className="font-semibold">Job Coffee Ltd</div>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments</span>
                    <span className="font-semibold">Handle with care</span>
                  </div>
                </div>

                {/* Farm Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Farm details
                  </h3>
                  <div className="space-y-2">
                    {[1, 2].map((_, idx) => (
                      <div
                        key={idx}
                        className="border p-3 rounded-lg flex items-center justify-between text-sm text-gray-700"
                      >
                        <div>
                          <div className="font-semibold">
                            Sunrise Coffee Estate (40 Hectares)
                          </div>
                          <div className="text-gray-500 text-xs">
                            📍 Kabarole, Uganda
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:flex">
                <Separator orientation="vertical" className="h-full" />
              </div>

              {/* Right Side - Timeline */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="border p-4 rounded-lg text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                      Submitted
                    </span>
                    <span>by Jane Smith (User ID#456)</span>
                  </div>
                  <div className="mt-2 text-gray-500 text-xs">
                    2025-03-28 10:30:15
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Processing info" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side Content */}
              <div className="flex-1 space-y-6">
                {/* Delivery Summary */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery summary
                  </h3>
                  <div className="flex justify-between">
                    <span>Bags received</span>
                    <span className="font-semibold">40 bags</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date received</span>
                    <span className="font-semibold">Nov 30, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">Received intact</span>
                  </div>
                </div>

                {/* Processing Details */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Processing details
                  </h3>
                  <div className="flex justify-between">
                    <span>Processing method</span>
                    <span className="font-semibold">Drying</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing period</span>
                    <span className="font-semibold">
                      Nov 30, 2026 - Dec 12, 2026
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Input bags</span>
                    <span className="font-semibold">40 bags</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Output weight</span>
                    <span className="font-semibold">150 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grading level</span>
                    <span className="font-semibold">AA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exporter facility</span>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">Coffee World Ltd</div>
                      <div className="font-semibold">Job Coffee Ltd</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">Graded, no defects</span>
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Attachments
                  </h3>
                  <div className="border rounded-lg p-2 flex items-center text-gray-700 text-sm">
                    📎 Coffee.jpg
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <QRCodeSVG
                      value="https://www.coffichain.com/batch/BH-001"
                      size={128}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                    />
                    <div className="text-sm">
                      <div>
                        Batch: <span className="font-semibold">BH-001</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Link:</span>
                        <a
                          href="https://www.coffichain.com/batch/BH-001"
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          https://www.coffichain.com/batch/BH-001
                        </a>
                      </div>
                    </div>
                    <Button className="bg-[#112D3E] text-white">
                      Download QR code
                    </Button>
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:flex">
                <Separator orientation="vertical" className="h-full" />
              </div>

              {/* Right Side Content - Timeline */}
              <div className="flex-1 space-y-6">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="flex flex-col gap-4 text-sm text-gray-700">
                  {/* Each timeline entry */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Submitted
                      </span>
                      <span>Submitted by Jane Smith (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        Delivered
                      </span>
                      <span>Delivered by Jane Smith (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                        Processed
                      </span>
                      <span>Processed by Kyagalanyi unit (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Exporter info" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Side Content */}
              <div className="flex-1 space-y-6">
                {/* Delivery Summary */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Delivery summary
                  </h3>
                  <div className="flex justify-between">
                    <span>Weight received</span>
                    <span className="font-semibold">400 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date received</span>
                    <span className="font-semibold">Nov 30, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processor</span>
                    <span className="font-semibold">
                      Green Coffee Processors
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">Received intact</span>
                  </div>
                </div>

                {/* Export Details */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Export details
                  </h3>
                  <div className="flex justify-between">
                    <span>Destination country</span>
                    <span className="font-semibold">USA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UCDA Export Permit Number</span>
                    <span className="font-semibold">EXP-009</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Date</span>
                    <span className="font-semibold">Nov 30, 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exporter</span>
                    <span className="font-semibold">
                      Green Coffee Processors
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality notes</span>
                    <span className="font-semibold">No defect, certified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping details</span>
                    <span className="font-semibold">No defect, certified</span>
                  </div>
                </div>

                {/* Exporter Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Exporter details
                  </h3>
                  <div className="border p-3 rounded-lg flex items-center justify-between text-sm text-gray-700">
                    <div>
                      <div className="font-semibold">
                        ABC Coffee Exporters Ltd
                      </div>
                      <div className="text-gray-500 text-xs">
                        📍 Kabarole, Uganda
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vertical Separator */}
              <div className="hidden lg:flex">
                <Separator orientation="vertical" className="h-full" />
              </div>

              {/* Right Side Content - Timeline */}
              <div className="flex-1 space-y-6">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="flex flex-col gap-4 text-sm text-gray-700">
                  {/* Timeline Entries */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Submitted
                      </span>
                      <span>Submitted by Jane Smith (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        Delivered
                      </span>
                      <span>Delivered by Jane Smith (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                        Processed
                      </span>
                      <span>Processed by Kyagalanyi unit (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        Exported
                      </span>
                      <span>Exported by Green Coffee (user ID#456)</span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      2025-03-28 10:30:15
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </section>
  );
}


export default BatchDetailsPage;
