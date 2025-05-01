import { useState, useEffect } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAuth from "@/hooks/use-auth";
import { API_URL } from "@/lib/routes";
import { useToast } from "@/components/ui/use-toast";

interface Farm {
  _id: string;
  farmName: string;
  location: string;
  latitude: number;
  longitude: number;
  farmSize: number;
  numberofTrees: number;
  cultivationMethods: string[];
  certifications: string[];
  yearEstablished: string;
}

interface Harvest {
  _id: string;
  coffeeVariety: string;
  weight: number;
  harvestPeriod: {
    start: string;
    end: string;
  };
  plantingPeriod: {
    start: string;
    end: string;
  };
  farm: Farm;
  cultivationMethods: string[];
  certifications: string[];
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Batch {
  _id: string;
  batchId: string;
  farmerId: User;
  harvestIds: Harvest[];
  totalWeight: number;
  submissionDate: string;
  processorId: User;
  processingDetails: {
    dryingMethod: string;
    grading: string;
    certification: string | null;
    outputWeight: number | null;
  };
  numberOfBagsReceived: number;
  dateReceived: string;
  receiptNotes: string;
  status: string;
  blockchainTxHash: string;
  blockchainStatus: string;
  qrCodeUrl: string;
  createdAt: string;
}

interface Lot {
  _id: string;
  lotId: string;
  processorId: User;
  batchIds: Batch[];
  totalOutputWeight: number;
  exporterFacility: string;
  comments: string;
  dataHash: string;
  blockchainTxHash: string;
  blockchainStatus: string;
  status: string;
  qrCodeUrl: string;
  qrCodeImageUrl: string;
  creationDate: string;
  createdAt: string;
  updatedAt: string;
  dateReceived?: string;
  exporterId?: string;
  receiptNotes?: string;
  receivedWeight?: number;
  consignmentId?: string;
}

interface LotResponse {
  success: boolean;
  lot: Lot;
}

function LotDetailsPage() {
  const [activeTab, setActiveTab] = useState("Lot details");
  const [lot, setLot] = useState<Lot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams<{ id?: string; lotId?: string }>();
  const location = useLocation();
  const { authToken } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user] = useState({
    firstName: "Mary",
    lastName: "Nantongo",
  });

  const getLotId = () => {
    if (params.id) return params.id;
    if (params.lotId) return params.lotId;

    const searchParams = new URLSearchParams(location.search);
    const queryId = searchParams.get("id") || searchParams.get("lotId");
    if (queryId) return queryId;

    if (
      location.state &&
      typeof location.state === "object" &&
      "lotId" in location.state
    ) {
      return location.state.lotId;
    }

    console.warn(
      "No lot ID found in route parameters, query, or state. Using fallback ID."
    );
    return "LOT-1745564220148-966";
  };

  const lotId = getLotId();

  const tabs = ["Lot details", "Exporter info"];

  useEffect(() => {
    console.log("Component mounted, lot ID:", lotId);

    const fetchLotDetails = async () => {
      if (!lotId) {
        setError("No lot ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching details for lot:", lotId);
        console.log("API URL being used:", `${API_URL}lots/${lotId}`);

        const response = await fetch(`${API_URL}lots/${lotId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          console.error(
            "API error response:",
            response.status,
            response.statusText
          );
          throw new Error(
            `Failed to fetch lot details: ${response.status} ${response.statusText}`
          );
        }

        const data: LotResponse = await response.json();
        console.log("Lot data received:", data);

        if (!data.success || !data.lot) {
          throw new Error("Invalid response format or missing lot data");
        }

        setLot(data.lot);
      } catch (error) {
        console.error("Error fetching lot details:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        toast({
          title: "Error",
          description: "Failed to load lot details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLotDetails();
  }, [lotId, authToken, toast]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getVarieties = (): string => {
    if (!lot) return "";
    const varieties = new Set<string>();
    lot.batchIds.forEach((batch) => {
      batch.harvestIds.forEach((harvest) => {
        varieties.add(harvest.coffeeVariety);
      });
    });
    return Array.from(varieties).join(", ");
  };

  const getFarms = (): Farm[] => {
    if (!lot) return [];
    const farmMap = new Map<string, Farm>();

    lot.batchIds.forEach((batch) => {
      batch.harvestIds.forEach((harvest) => {
        if (harvest.farm && !farmMap.has(harvest.farm._id)) {
          farmMap.set(harvest.farm._id, harvest.farm);
        }
      });
    });

    return Array.from(farmMap.values());
  };

  if (loading) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
        }}
      >
        <Header />
        <div className="px-4 md:px-10 lg:px-20 py-10 flex-grow flex items-center justify-center">
          <p className="text-white">Loading lot details for ID: {lotId}...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error || !lot) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
        }}
      >
        <Header />
        <div className="px-4 md:px-10 lg:px-20 py-10 flex-grow flex items-center justify-center flex-col">
          <p className="text-white">Error: {error || "Lot not found"}</p>
          <p className="text-white mt-2">Lot ID: {lotId}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-white text-blue-600 px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </section>
    );
  }

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
            <AvatarFallback className="text-xl">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
            <br />
            <span className="font-semibold text-xl text-white">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

        {/* Back and Title */}
        <div className="flex items-center gap-2 mb-8">
          <ArrowLeft
            className="h-5 w-5 text-white cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl font-semibold text-white">Lot Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
          {/* Lot Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {lot.lotId}
                </h2>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  {lot.status.charAt(0).toUpperCase() + lot.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div>📄 Variety: {getVarieties()}</div>
                <div>
                  <CalendarDays className="inline-block h-4 w-4 mr-1" />
                  Submitted: {formatDate(lot.creationDate)}
                </div>
                <div>
                  Processor:{" "}
                  <span className="font-semibold">
                    {lot.processorId.firstName} {lot.processorId.lastName}
                  </span>
                </div>
                <div>
                  Exporter:{" "}
                  <span className="font-semibold">{lot.exporterFacility}</span>
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
                    Lot summary ({lot.batchIds.length}{" "}
                    {lot.batchIds.length === 1 ? "batch" : "batches"})
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
                        {lot.batchIds.map((batch) => (
                          <tr key={batch._id} className="border-t">
                            <td className="py-2 px-4">{batch.batchId}</td>
                            <td className="py-2 px-4">
                              {batch.harvestIds
                                .map((h) => h.coffeeVariety)
                                .join(", ")}
                            </td>
                            <td className="py-2 px-4">
                              {batch.totalWeight} kg
                            </td>
                            <td className="py-2 px-4">
                              {batch.farmerId.firstName}{" "}
                              {batch.farmerId.lastName}
                            </td>
                            <td className="py-2 px-4">
                              {formatDate(batch.dateReceived)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Total lot weight</span>
                    <span className="font-semibold">
                      {lot.totalOutputWeight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing unit</span>
                    <span className="font-semibold">
                      {lot.exporterFacility}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments</span>
                    <span className="font-semibold">{lot.comments}</span>
                  </div>
                </div>

                {/* Farm Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Farm details
                  </h3>
                  <div className="space-y-2">
                    {getFarms().map((farm) => (
                      <div
                        key={farm._id}
                        className="border p-3 rounded-lg flex items-center justify-between text-sm text-gray-700"
                      >
                        <div>
                          <div className="font-semibold">
                            {farm.farmName} ({farm.farmSize} Hectares)
                          </div>
                          <div className="text-gray-500 text-xs">
                            📍 {farm.location}
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
                      <span>
                        Submitted by {lot.processorId.firstName}{" "}
                        {lot.processorId.lastName} (user ID#
                        {lot.processorId._id.slice(-4)})
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(lot.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {lot.status === "exported" && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            Delivered
                          </span>
                          <span>
                            Delivered by Exporter (user ID#
                            {lot.exporterId?.slice(-4) || "N/A"})
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {lot.dateReceived
                            ? new Date(lot.dateReceived).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Exported
                          </span>
                          <span>Exported to {lot.exporterFacility}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(lot.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
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
                    <span className="font-semibold">
                      {lot.receivedWeight || "N/A"} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date received</span>
                    <span className="font-semibold">
                      {formatDate(lot.dateReceived || "")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processor</span>
                    <span className="font-semibold">
                      {lot.processorId.firstName} {lot.processorId.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">
                      {lot.receiptNotes || "No receipt notes"}
                    </span>
                  </div>
                </div>

                {/* Export Details */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Export details
                  </h3>
                  <div className="flex justify-between">
                    <span>Destination country</span>
                    <span className="font-semibold">International</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UCDA Export Permit Number</span>
                    <span className="font-semibold">
                      UCDA/EXP/2025/{lot.lotId.slice(-3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Export Date</span>
                    <span className="font-semibold">
                      {formatDate(lot.updatedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exporter</span>
                    <span className="font-semibold">
                      {lot.exporterFacility}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality notes</span>
                    <span className="font-semibold">
                      {lot.batchIds[0]?.processingDetails.grading || "N/A"}
                      {lot.batchIds[0]?.processingDetails.certification
                        ? `, ${lot.batchIds[0]?.processingDetails.certification}`
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping details</span>
                    <span className="font-semibold">
                      {lot.consignmentId
                        ? `Consignment ID: ${lot.consignmentId}`
                        : "Not yet shipped"}
                    </span>
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
                        {lot.exporterFacility}
                      </div>
                      <div className="text-gray-500 text-xs">
                        📍{" "}
                        {lot.batchIds[0]?.harvestIds[0]?.farm?.location ||
                          "Uganda"}
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
                      <span>
                        Submitted by {lot.processorId.firstName}{" "}
                        {lot.processorId.lastName} (user ID#
                        {lot.processorId._id.slice(-4)})
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(lot.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {lot.status === "exported" && (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            Delivered
                          </span>
                          <span>
                            Delivered by Exporter (user ID#
                            {lot.exporterId?.slice(-4) || "N/A"})
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {lot.dateReceived
                            ? new Date(lot.dateReceived).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Exported
                          </span>
                          <span>Exported via {lot.exporterFacility}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(lot.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
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
