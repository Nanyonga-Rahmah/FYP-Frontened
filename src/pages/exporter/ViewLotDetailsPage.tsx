import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ConfirmDeliveryForm } from "@/components/exporter/modals/ConfirmDeliveryModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/lib/routes";

interface Farm {
  name: string;
  size: number;
  location: string;
  trees: number;
  established: number;
}

interface Batch {
  batchId: string;
  varieties: string[];
  weight: number;
  location: string;
  deliveredDate: string;
}

interface Consignment {
  consignmentId: string;
  destinationCountry: string;
  destinationPort: string;
  shippingMethod: string;
  exportDate: string;
  notes: string;
}

interface TimelineEvent {
  type: string;
  user: string;
  userId: string;
  date: string;
}

interface LotDetails {
  lotId: string;
  status: string;
  submittedDate: string;
  varieties: string[];
  totalWeight: number;
  processorName: string;
  exporterFacility: string;
  comments: string;
  batches: Batch[];
  batchCount: number;
  farms: Farm[];
}

interface ExporterInfo {
  receivedWeight: number;
  dateReceived: string;
  receiptNotes: string;
  exporterName: string;
  consignment: Consignment;
}

interface LotData {
  lotDetails: LotDetails;
  exporterInfo: ExporterInfo;
  timelineEvents: TimelineEvent[];
}

interface ApiResponse {
  success: boolean;
  lot: LotData;
}

function ViewLotDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"lot" | "exporter">("lot");
  const [confirmDeliveryOpen, setConfirmDeliveryOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [lotData, setLotData] = useState<LotData | null>(null);
  const [loading, setLoading] = useState(true);

 const { authToken } = useAuth();
  const { profile } = useUserProfile(authToken);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLotData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}exporter/lots/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setLotData(data.lot);
      } catch (error) {
        console.error("Error fetching lot data:", error);
        toast({
          title: "Error",
          description: "Failed to load lot data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLotData();
    }
  }, [id, refreshData, toast, API_URL]);

  const handleDeliverySuccess = () => {
    setRefreshData((prev) => !prev);
    toast({
      title: "Success",
      description: "Lot has been successfully marked as delivered",
    });
  };

  const getInitials = (): string => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
    }
    return "RA"; 
  };

  const formatVarieties = (varieties: string[] | undefined): string => {
    if (!varieties || varieties.length === 0) return "N/A";
    return varieties.join(", ");
  };

  const getStatusBadgeClass = (status: string | undefined): string => {
    if (!status) return "bg-gray-100 text-gray-700";

    switch (status.toLowerCase()) {
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "exported":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString; 
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center">
        <p>Loading lot details...</p>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
      }}
    >
      <Header />
      <section className="flex-1 px-20 pt-10 pb-20">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gray-400 text-white font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5]">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Rahmah Akello"}
              </span>
            </div>
          </div>
          <div>
            <Button className="bg-[#E7B35A] text-white rounded-md px-4 py-2">
              {lotData?.exporterInfo.exporterName || "Coffee Exporters Ltd"}
            </Button>
          </div>
        </div>

        {/* Page Title */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-transparent mt-10"
        >
          <img src="/images/back.png" alt="Back" className="w-5 h-5" />
          <span className="text-white text-2xl font-semibold">Lot Details</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm p-10 flex flex-col gap-8 border border-gray-200">
          {/* Lot header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg text-[#0F2A38]">
                  {lotData?.lotDetails.lotId || id}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(lotData?.lotDetails.status)}`}
                >
                  {lotData?.lotDetails.status || "Unknown"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-gray-600 text-sm mt-2">
                <p>
                  <span className="font-medium text-[#0F2A38]">Variety:</span>{" "}
                  {formatVarieties(lotData?.lotDetails.varieties)}
                </p>
                <p>
                  <span className="font-medium text-[#0F2A38]">Submitted:</span>{" "}
                  {lotData?.lotDetails.submittedDate || "N/A"}
                </p>
                <p>
                  <span className="font-medium text-[#0F2A38]">Processor:</span>{" "}
                  {lotData?.lotDetails.processorName || "N/A"}
                </p>
              </div>
            </div>
            {lotData?.lotDetails.status !== "exported" && (
              <Button
                className="bg-[#0F2A38] text-white rounded-md"
                onClick={() => setConfirmDeliveryOpen(true)}
              >
                Mark Delivered
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("lot")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "lot"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Lot details
            </button>
            <button
              onClick={() => setActiveTab("exporter")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "exporter"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
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
                    <h3 className="text-[#0F2A38] font-semibold mb-4">
                      Lot summary ({lotData?.lotDetails.batchCount || 0}{" "}
                      batches)
                    </h3>
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
                          {lotData?.lotDetails.batches &&
                          lotData.lotDetails.batches.length > 0 ? (
                            lotData.lotDetails.batches.map((batch) => (
                              <tr key={batch.batchId} className="border-t">
                                <td className="p-3">{batch.batchId}</td>
                                <td className="p-3">
                                  {formatVarieties(batch.varieties)}
                                </td>
                                <td className="p-3">{batch.weight} kg</td>
                                <td className="p-3">{batch.location}</td>
                                <td className="p-3">{batch.deliveredDate}</td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-t">
                              <td
                                colSpan={5}
                                className="p-3 text-center text-gray-500"
                              >
                                No batch data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Additional info */}
                  <div className="flex flex-col gap-2 text-gray-700 text-sm">
                    {/* Total lot weight */}
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Total lot weight:
                      </span>
                      <span>{lotData?.lotDetails.totalWeight || 0}kg</span>
                    </div>

                    {/* Processing unit */}
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Processing unit:
                      </span>
                      <span>
                        {lotData?.lotDetails.exporterFacility || "N/A"}
                      </span>
                    </div>

                    {/* Comments */}
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Comments:
                      </span>
                      <span className="text-right max-w-md">
                        {lotData?.lotDetails.comments || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Farm details */}
                  <div>
                    <h3 className="text-[#0F2A38] font-semibold mb-4">
                      Farm details
                    </h3>
                    <div className="flex flex-col gap-3">
                      {lotData?.lotDetails.farms &&
                      lotData.lotDetails.farms.length > 0 ? (
                        lotData.lotDetails.farms.map((farm, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-md"
                          >
                            <img
                              src="/images/farm-area.png"
                              alt="Farm"
                              className="w-10 h-10"
                            />
                            <div>
                              <p className="font-semibold text-[#0F2A38]">
                                {farm.name} ({farm.size} Hectares)
                              </p>
                              <p className="text-gray-500 text-sm">
                                {farm.location}, Uganda
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 border border-gray-200 rounded-md text-gray-500">
                          No farm details available
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Exporter Info */}
                  <div className="flex flex-col gap-6 text-sm text-gray-700">
                    {/* Delivery Summary */}
                    <div>
                      <h3 className="text-[#0F2A38] font-semibold mb-4">
                        Delivery summary
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                          <span className="font-medium text-[#0F2A38]">
                            Weight received:
                          </span>
                          <span>
                            {lotData?.exporterInfo.receivedWeight || 0} kg
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-[#0F2A38]">
                            Date received:
                          </span>
                          <span>
                            {lotData?.exporterInfo.dateReceived || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-[#0F2A38]">
                            Notes:
                          </span>
                          <span>
                            {lotData?.exporterInfo.receiptNotes || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Export Details */}
                    {lotData?.exporterInfo.consignment && (
                      <div>
                        <h3 className="text-[#0F2A38] font-semibold mb-4">
                          Export details
                        </h3>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Exporter:
                            </span>
                            <span>{lotData.exporterInfo.exporterName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Destination country:
                            </span>
                            <span>
                              {
                                lotData.exporterInfo.consignment
                                  .destinationCountry
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Destination port:
                            </span>
                            <span>
                              {lotData.exporterInfo.consignment.destinationPort}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Shipping method:
                            </span>
                            <span>
                              {lotData.exporterInfo.consignment.shippingMethod}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Export date:
                            </span>
                            <span>
                              {formatDate(
                                lotData.exporterInfo.consignment.exportDate
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-[#0F2A38]">
                              Notes:
                            </span>
                            <span>
                              {lotData.exporterInfo.consignment.notes}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Attachments - We can keep this static or implement later */}
                    <div>
                      <h3 className="text-[#0F2A38] font-semibold mb-4">
                        Attachments
                      </h3>
                      <div className="border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center gap-3">
                        <img
                          src="/images/image-placeholder.svg"
                          alt="File"
                          className="w-5 h-5"
                        />
                        <span className="text-gray-600">
                          Export documentation
                        </span>
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
                {lotData?.timelineEvents &&
                  lotData.timelineEvents.length > 1 && (
                    <div className="absolute top-2 left-2 w-px h-full bg-gray-300"></div>
                  )}

                {/* Timeline Steps */}
                {lotData?.timelineEvents &&
                lotData.timelineEvents.length > 0 ? (
                  lotData.timelineEvents.map((event, index) => {
                    let bgColor, dotColor;

                    switch (event.type) {
                      case "created":
                        bgColor = "bg-green-100";
                        dotColor = "bg-green-600";
                        break;
                      case "delivered":
                        bgColor = "bg-blue-100";
                        dotColor = "bg-blue-600";
                        break;
                      case "exported":
                        bgColor = "bg-purple-100";
                        dotColor = "bg-purple-600";
                        break;
                      default:
                        bgColor = "bg-gray-100";
                        dotColor = "bg-gray-600";
                    }

                    return (
                      <div
                        key={index}
                        className="relative flex items-center gap-3"
                      >
                        <div
                          className={`relative z-10 w-5 h-5 ${bgColor} rounded-full flex items-center justify-center`}
                        >
                          <div
                            className={`w-2.5 h-2.5 ${dotColor} rounded-full`}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <p>{`${event.type.charAt(0).toUpperCase() + event.type.slice(1)} by ${event.user} (ID# ${event.userId.slice(-6)})`}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(event.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-500">
                    No timeline events available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Delivery Modal */}
      <ConfirmDeliveryForm
        open={confirmDeliveryOpen}
        onClose={() => setConfirmDeliveryOpen(false)}
        lotId={id || ""}
        onSuccess={handleDeliverySuccess}
      />

      <Footer />
    </section>
  );
}

export default ViewLotDetailsPage;
