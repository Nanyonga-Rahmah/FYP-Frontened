import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, LocateFixed, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import Header from "@/components/globals/Header";
import Footer from "@/components/globals/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MarkDeliveredForm } from "@/components/forms/processorforms/MarkdeliveredForm";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";
import { API_URL } from "@/lib/routes";
import { ProcessingForm } from "@/components/forms/processorforms/ProcessBatchForm";

// TypeScript interfaces for batch data
interface Timeline {
  status: string;
  person: string;
  userId: string;
  date: string;
}

interface HarvestPeriod {
  start: string;
  end: string;
}

interface Harvest {
  _id: string;
  coffeeVariety: [];
  weight: number;
  harvestPeriod: HarvestPeriod;
}

interface Farm {
  name: string;
  location: string;
  size: number;
  coordinates: number[];
  yearEstablished: string;
}

interface ProcessingDetails {
  method: string;
  grading: string;
  outputWeight: number | null;
  processingNotes: string | null;
  certification: string | null;
}

interface ProcessorInfo {
  name: string;
  receivedBags: number;
  dateReceived: string;
  receiptNotes: string;
  processingDetails: ProcessingDetails;
}

interface ExporterInfo {
  name: string;
  exportDate: string;
  destinationCountry: string;
  permitNumber: string;
  qualityNotes: string;
}

interface Document {
  name: string;
  url: string;
  uploadDate: string;
}

interface BatchData {
  batchId: string;
  status: string;
  farmerId: {
    firstName: string;
    lastName: string;
    _id: string;
    email: string;
  };
  submissionDate: string;
  totalWeight: number;
  numberOfBags: number;
  qrCodeUrl: string;
  qrCodeImageUrl?: string;
  comments: string;
  farmingMethods: string[];
  processorInfo: ProcessorInfo | null;
  exporterInfo: ExporterInfo | null;
  harvestIds: Harvest[];
  farms: Farm[];
  documents: Document[];
  timeline: Timeline[];
}

function FarmerBatchDetailsPage() {
  const [activeTab, setActiveTab] = useState("Batch details");
  const [batchData, setBatchData] = useState<BatchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { batchId } = useParams<{ batchId: string }>();
  const { toast } = useToast();
  const { authToken } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(authToken);

  const tabs = ["Batch details", "Processing info", "Exporter info"];

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}batches/${batchId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch batch details");
        }

        const data = await response.json();
        setBatchData(data.batch);
        setError(null);
      } catch (err) {
        setError("Failed to load batch details");
        console.error("Error fetching batch details:", err);
        toast({
          title: "Error",
          description: "Failed to fetch batch details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchData();
    }
  }, [batchId, authToken, toast]);

  if (loading || profileLoading) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
        }}
      >
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-white">Loading batch details...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error || !batchData) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 45%, #F6F9FF 45%)",
        }}
      >
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <p className="text-red-500">{error || "Batch not found"}</p>
        </div>
        <Footer />
      </section>
    );
  }

  const coffeeVarieties = Array.from(
    new Set(batchData.harvestIds?.flatMap((harvest) => harvest.coffeeVariety))
  ).join(", ");

  console.log(batchData);

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
              <AvatarFallback className="text-xl">
                {profile
                  ? profile.firstName.charAt(0) + profile.lastName.charAt(0)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-[#C0C9DDE5] text-sm">Greetings,</span>
              <br />
              <span className="font-semibold text-xl text-white">
                {profile ? `${profile.firstName} ${profile.lastName}` : "User"}
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
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {batchData.batchId}
                  </h2>
                  <span
                    className={`text-xs ${
                      batchData.status === "Submitted"
                        ? "bg-green-100 text-green-700"
                        : batchData.status === "Received"
                          ? "bg-blue-100 text-blue-700"
                          : batchData.status === "Processed"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-purple-100 text-purple-700"
                    } px-2 py-1 rounded-full font-medium`}
                  >
                    {batchData.status}
                  </span>
                </div>

                {batchData.status === "Submitted" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white bg-[#112D3E]"
                      >
                        Mark Delivered
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-black text-2xl font-semibold">
                          Confirm Delivery
                        </DialogTitle>
                        <DialogDescription>
                          Ensure you received this farmer's batch. This action
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <MarkDeliveredForm batchId={batchData.batchId} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                <div>📄 Variety: {coffeeVarieties}</div>
                <div>
                  <CalendarDays className="inline-block h-4 w-4 mr-1" />
                  Submitted: {formatDate(batchData.submissionDate)}
                </div>
                <div>
                  <User className="inline-block h-4 w-4 mr-1 capitalize" />
                  Farmer:{" "}
                  {batchData.farmerId.firstName +
                    " " +
                    batchData.farmerId.lastName}
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
                    Harvests summary ({batchData.numberOfBags} bags)
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
                        {batchData.harvestIds?.map((harvest) => (
                          <tr key={harvest._id} className="border-t">
                            <td className="py-2 px-4 text-black">
                              {harvest._id?.slice(-6)}
                            </td>
                            <td className="py-2 px-4 text-black">
                              {harvest.coffeeVariety}
                            </td>
                            <td className="py-2 px-4 text-black">
                              {harvest.weight} bags
                            </td>
                            <td className="py-2 px-4 text-black">
                              {formatDate(harvest.harvestPeriod.start)} -{" "}
                              {formatDate(harvest.harvestPeriod.end)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Batch Info */}
                <div className="mt-4 space-y-2 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Total bags</span>
                    <span className="font-semibold">
                      {batchData.numberOfBags} bags
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farming methods</span>
                    <span className="font-semibold">
                      {batchData.farmingMethods?.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing units</span>
                    <span className="text-right space-y-1">
                      <div className="font-semibold">
                        {batchData.processorInfo?.name || "Not assigned"}
                      </div>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comments</span>
                    <span className="font-semibold">
                      {batchData.comments || "No comments"}
                    </span>
                  </div>
                </div>

                {/* Farm Details */}
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Farm details
                  </h3>
                  <div className="space-y-2">
                    {batchData.farms?.map((farm, idx) => (
                      <div
                        key={idx}
                        className="border p-3 rounded-lg flex items-center justify-between text-sm text-gray-700"
                      >
                        <div>
                          <div className="font-semibold">
                            {farm.name} ({farm.size} Hectares)
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

              {/* Right Side - Timeline */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  {batchData.timeline?.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span
                          className={`${
                            item.status === "Submitted"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Received"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Processed"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                          } px-2 py-1 rounded-full text-xs`}
                        >
                          {item.status}
                        </span>
                        <span>
                          by {item.person} (User ID#{item.userId})
                        </span>
                      </div>
                      <div className="mt-2 text-gray-500 text-xs">
                        {new Date(item.date).toLocaleString()}
                      </div>
                    </div>
                  ))}
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
                    <span className="font-semibold">
                      {batchData.processorInfo?.receivedBags || "Not received"}{" "}
                      bags
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date received</span>
                    <span className="font-semibold">
                      {batchData.processorInfo?.dateReceived
                        ? formatDate(batchData.processorInfo.dateReceived)
                        : "Not received"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">
                      {batchData.processorInfo?.receiptNotes || "No notes"}
                    </span>
                  </div>
                </div>

                {/* Conditional Processing Form or Message */}
                {batchData.status === "Submitted" && (
                  <p className="text-gray-500 mt-4">
                    Batch must be received before processing can start.
                  </p>
                )}
                {batchData.status === "Received" && (
                  <ProcessingForm batchId={batchData.batchId} />
                )}

                {/* Processing Details */}
                {batchData.processorInfo && (
                  <div className="space-y-2 text-gray-700 text-sm">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Processing details
                    </h3>
                    <div className="flex justify-between">
                      <span>Processing method</span>
                      <span className="font-semibold">
                        {batchData.processorInfo?.processingDetails.method ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing period</span>
                      <span className="font-semibold">
                        {batchData.processorInfo?.dateReceived
                          ? formatDate(batchData.processorInfo.dateReceived)
                          : ""}{" "}
                        -
                        {" " +
                          new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Input bags</span>
                      <span className="font-semibold">
                        {batchData.processorInfo?.receivedBags || 0} bags
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Output weight</span>
                      <span className="font-semibold">
                        {batchData.totalWeight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grading level</span>
                      <span className="font-semibold">
                        {batchData.processorInfo?.processingDetails.grading ||
                          "Not graded"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processor</span>
                      <div className="text-right">
                        <div className="font-semibold">
                          {batchData.processorInfo?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Notes</span>
                      <span className="font-semibold">
                        {batchData.processorInfo?.processingDetails
                          .processingNotes || "No processing notes"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Attachments
                  </h3>
                  {batchData.documents.length > 0 ? (
                    batchData.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-2 flex items-center text-gray-700 text-sm"
                      >
                        📎 {doc.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No attachments available
                    </div>
                  )}

<div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Processor details
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
                  {/* <div className="flex flex-col items-center space-y-2 mt-4">
                    <QRCodeSVG
                      value={
                        batchData.qrCodeUrl ||
                        `https://www.coffichain.com/batch/${batchData.batchId}`
                      }
                      size={128}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                    />
                    <div className="text-sm">
                      <div>
                        Batch:{" "}
                        <span className="font-semibold">
                          {batchData.batchId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Link:</span>
                        <a
                          href={
                            batchData.qrCodeUrl ||
                            `https://www.coffichain.com/batch/${batchData.batchId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {batchData.qrCodeUrl ||
                            `https://www.coffichain.com/batch/${batchData.batchId}`}
                        </a>
                      </div>
                    </div>
                    <Button className="bg-[#112D3E] text-white">
                      Download QR code
                    </Button>
                  </div> */}
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
                  {batchData.timeline?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`${
                            item.status === "Submitted"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Received"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Processed"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                          } px-2 py-1 rounded-full text-xs`}
                        >
                          {item.status}
                        </span>
                        <span>
                          {item.status} by {item.person} (user ID#{item.userId})
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
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
                    <span className="font-semibold">
                      {batchData.totalWeight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date received</span>
                    <span className="font-semibold">
                      {batchData.processorInfo?.dateReceived
                        ? formatDate(batchData.processorInfo.dateReceived)
                        : "Not received"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processor</span>
                    <span className="font-semibold">
                      {batchData.processorInfo?.name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notes</span>
                    <span className="font-semibold">
                      {batchData.processorInfo?.receiptNotes || "No notes"}
                    </span>
                  </div>
                </div>

                {/* Export Details */}
                <div className="space-y-2 text-gray-700 text-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Export details
                  </h3>
                  {batchData.exporterInfo ? (
                    <>
                      <div className="flex justify-between">
                        <span>Destination country</span>
                        <span className="font-semibold">
                          {batchData.exporterInfo.destinationCountry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>UCDA Export Permit Number</span>
                        <span className="font-semibold">
                          {batchData.exporterInfo.permitNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Export Date</span>
                        <span className="font-semibold">
                          {formatDate(batchData.exporterInfo.exportDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exporter</span>
                        <span className="font-semibold">
                          {batchData.exporterInfo.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality notes</span>
                        <span className="font-semibold">
                          {batchData.exporterInfo.qualityNotes}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2 text-gray-700 text-sm">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Export details (Pending)
                        </h3>
                        <div className="flex justify-between">
                          <span>Destination country</span>
                          <span className="font-semibold">
                            To be determined
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>UCDA Export Permit Number</span>
                          <span className="font-semibold">
                            Pending issuance
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Export Date</span>
                          <span className="font-semibold">Pending</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exporter</span>
                          <span className="font-semibold">To be assigned</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality notes</span>
                          <span className="font-semibold">Pending grading</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Exporter Details */}
                <div className="mt-4">
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
                  {batchData.timeline?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`${
                            item.status === "Submitted"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Received"
                                ? "bg-blue-100 text-blue-700"
                                : item.status === "Processed"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                          } px-2 py-1 rounded-full text-xs`}
                        >
                          {item.status}
                        </span>
                        <span>
                          {item.status} by {item.person} (user ID#{item.userId})
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(item.date).toLocaleString()}
                      </span>
                    </div>
                  ))}
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

export default FarmerBatchDetailsPage;
