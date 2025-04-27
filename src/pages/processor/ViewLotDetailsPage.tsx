import { useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function LotDetailsPage() {
  const [activeTab, setActiveTab] = useState("Lot details");

  const tabs = ["Lot details", "Exporter info"];

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
      }}
    >
      <Header />

      <div className="px-4 md:px-10 lg:px-20 py-10 flex-grow">
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-10">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="text-xl">MN</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
            <br />
            <span className="font-semibold text-xl text-white">
              Mary Nantongo
            </span>
          </div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center gap-2 mb-8">
          <ArrowLeft
            className="h-5 w-5 text-white cursor-pointer"
            onClick={() => window.history.back()}
          />
          <h1 className="text-2xl font-semibold text-white">Lot Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
          {/* Lot Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">LT-001</h2>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  Exported
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div>📄 Variety: Robusta, Arabica</div>
                <div>
                  <CalendarDays className="inline-block h-4 w-4 mr-1" />
                  Submitted: Nov 30, 2026
                </div>
                <div>
                  Processor:{" "}
                  <span className="font-semibold">Kyagalanyi Processors</span>
                </div>
                <div>
                  Exporter:{" "}
                  <span className="font-semibold">Green Coffee Farm</span>
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
                    ? "text-white border-b-2 bg-[#202020] border-[#112D3E]"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "Lot details" && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Content */}
              <div className="flex-1 space-y-6">
                {/* Lot Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Lot summary (40 batches)
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="py-2 px-4 text-left">Batch ID</th>
                          <th className="py-2 px-4 text-left">Variety</th>
                          <th className="py-2 px-4 text-left">Weight</th>
                          <th className="py-2 px-4 text-left">Farmer</th>
                          <th className="py-2 px-4 text-left">
                            Delivered Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-2 px-4">BH-001</td>
                          <td className="py-2 px-4">Arabica</td>
                          <td className="py-2 px-4">20 kg</td>
                          <td className="py-2 px-4">James Muthoni</td>
                          <td className="py-2 px-4">Nov 31, 2026</td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-2 px-4">BH-001</td>
                          <td className="py-2 px-4">Arabica, Robusta</td>
                          <td className="py-2 px-4">20 kg</td>
                          <td className="py-2 px-4">James Muthoni</td>
                          <td className="py-2 px-4">Nov 31, 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Total lot weight</span>
                    <span className="font-semibold">4000 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing unit</span>
                    <span className="font-semibold">Coffee World Ltd</span>
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

              {/* Timeline */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="flex flex-col gap-4 text-sm text-gray-700">
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
                    <span>Lot weight received</span>
                    <span className="font-semibold">400kg</span>
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
export default LotDetailsPage;