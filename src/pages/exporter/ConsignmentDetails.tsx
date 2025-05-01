import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/globals/exporter/Header";
import Footer from "@/components/globals/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { QRCodeSVG } from "qrcode.react";
import { API_URL } from "@/lib/routes";
import useAuth from "@/hooks/use-auth";
import useUserProfile from "@/hooks/use-profile";

import {
  Consignment,
  ConsignmentResponse,
  DueDiligenceReport,
  DueDiligenceResponse,
} from "@/lib/types";

function ConsignmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"details" | "traceability">(
    "details"
  );
  const [consignment, setConsignment] = useState<Consignment | null>(null);
  const [dueDiligenceReport, setDueDiligenceReport] =
    useState<DueDiligenceReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();
  // Use the useUserProfile hook for profile data
  const { profile, loading: profileLoading } = useUserProfile(authToken);

  useEffect(() => {
    const fetchConsignmentData = async () => {
      try {
        setLoading(true);

        const consignmentResponse = await fetch(
          `${API_URL}exporter/consignment/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!consignmentResponse.ok) {
          throw new Error("Failed to fetch consignment details");
        }
        const consignmentData: ConsignmentResponse =
          await consignmentResponse.json();
        setConsignment(consignmentData.consignment);

        const dueDiligenceResponse = await fetch(
          `${API_URL}exporter/due-diligence/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!dueDiligenceResponse.ok) {
          throw new Error("Failed to fetch due diligence report");
        }
        const dueDiligenceData: DueDiligenceResponse =
          await dueDiligenceResponse.json();
        setDueDiligenceReport(dueDiligenceData.report);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    if (id) {
      fetchConsignmentData();
    }
  }, [id, authToken]);

  // Format date function
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (loading || profileLoading) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error || !consignment) {
    return (
      <section
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(to bottom, #112D3E 50%, #F6F9FF 50%)",
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white text-xl">
            Error: {error || "Consignment not found"}
          </p>
        </div>
        <Footer />
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
        {/* GREETING */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar>
            <AvatarFallback>
              {profile
                ? getInitials(profile.firstName, profile.lastName)
                : getInitials(
                    consignment.exporterId.firstName,
                    consignment.exporterId.lastName
                  )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-[#C0C9DDE5]">Greetings,</p>
            <p className="font-semibold text-xl text-white">
              {profile
                ? `${profile.firstName} ${profile.lastName}`
                : `${consignment.exporterId.firstName} ${consignment.exporterId.lastName}`}
            </p>
          </div>
        </div>

        {/* Page Title */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-transparent mt-10 mb-5"
        >
          <img src="/images/back.png" alt="Back" className="w-5 h-5" />
          <span className="text-white text-2xl font-semibold">
            Consignment Details
          </span>
        </button>

        {/* MAIN CARD */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 flex flex-col gap-10">
          {/* HEADER INFO */}
          <div className="flex justify-between items-start flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-lg text-[#0F2A38]">
                  {consignment.consignmentId}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#E0D7F8] text-[#6F42C1C9] text-xs font-semibold">
                  {consignment.blockchainStatus === "confirmed"
                    ? "Exported"
                    : consignment.blockchainStatus}
                </span>
              </div>
              <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
                <p>
                  <span className="text-[#0F2A38] font-medium">Variety:</span>{" "}
                  {Array.from(
                    new Set(
                      consignment.lotIds.flatMap((lot) =>
                        lot.batchIds.flatMap((batch) =>
                          batch.harvestIds.map(
                            (harvest) => harvest.coffeeVariety
                          )
                        )
                      )
                    )
                  ).join(", ")}
                </p>
                <p>
                  <span className="text-[#0F2A38] font-medium">Submitted:</span>{" "}
                  {formatDate(consignment.createdAt)}
                </p>
                <p>
                  <span className="text-[#0F2A38] font-medium">Processor:</span>{" "}
                  {consignment.lotIds[0]?.processorId.firstName}{" "}
                  {consignment.lotIds[0]?.processorId.lastName}
                </p>
                <p>
                  <span className="text-[#0F2A38] font-medium">Exporter:</span>{" "}
                  {consignment.exporterId.firstName}{" "}
                  {consignment.exporterId.lastName}
                </p>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "details"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Consignment details
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === "traceability"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-500"
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
                  <h3 className="text-[#0F2A38] font-semibold mb-4">
                    Consignment summary ({consignment.lotIds.length}{" "}
                    {consignment.lotIds.length === 1 ? "lot" : "lots"})
                  </h3>
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
                      {consignment.lotIds.map((lot) => (
                        <tr key={lot._id} className="border-t">
                          <td className="p-3">{lot.lotId}</td>
                          <td className="p-3">
                            {Array.from(
                              new Set(
                                lot.batchIds.flatMap((batch) =>
                                  batch.harvestIds.map(
                                    (harvest) => harvest.coffeeVariety
                                  )
                                )
                              )
                            ).join(", ")}
                          </td>
                          <td className="p-3">{lot.totalOutputWeight} kg</td>
                          <td className="p-3">
                            {lot.processorId.firstName}{" "}
                            {lot.processorId.lastName}
                          </td>
                          <td className="p-3">
                            {formatDate(lot.dateReceived)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex flex-col gap-2 text-sm text-gray-700 mt-6">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Total consignment weight:
                      </span>
                      <span>{consignment.totalWeight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Exporter:
                      </span>
                      <span>
                        {consignment.exporterId.firstName}{" "}
                        {consignment.exporterId.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Destination country:
                      </span>
                      <span>{consignment.destinationCountry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        UCDA Export permit number:
                      </span>
                      <span>UCDA/EXP/0653/2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Shipping details:
                      </span>
                      <span>{consignment.shippingMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Quality notes:
                      </span>
                      <span>
                        {consignment.lotIds[0]?.batchIds[0]?.processingDetails
                          .grading || "N/A"}{" "}
                        {consignment.lotIds[0]?.batchIds[0]?.harvestIds[0]
                          ?.coffeeVariety || ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-[#0F2A38]">
                        Export date:
                      </span>
                      <span>{formatDate(consignment.exportDate)}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-[#0F2A38] font-medium mb-2">
                      Certificate of origin
                    </p>
                    <div className="flex items-center gap-3 border border-gray-300 rounded-md p-3 bg-gray-50 w-fit">
                      <img
                        src="/images/image-placeholder.svg"
                        alt="File"
                        className="w-5 h-5"
                      />
                      <span className="text-gray-600">
                        uganda_origin_cert_2025.jpg
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-[#0F2A38] font-medium mb-2">
                      Exporter details
                    </p>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md">
                      <img
                        src="/images/location-placeholder-colored.png"
                        alt="Location"
                        className="w-6 h-6"
                      />
                      <div>
                        <p className="font-semibold text-[#0F2A38] text-sm">
                          {consignment.lotIds[0]?.exporterFacility || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <img
                            src="/images/location-placeholder-bw.png"
                            alt="Pin"
                            className="w-3.5 h-3.5"
                          />
                          {consignment.lotIds[0]?.batchIds[0]?.harvestIds[0]
                            ?.farm?.location || "Uganda"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {dueDiligenceReport && (
                    <div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                        <p>
                          <strong>Lots:</strong>{" "}
                          {dueDiligenceReport.lots.length}{" "}
                          {dueDiligenceReport.lots.length === 1
                            ? "lot"
                            : "lots"}
                        </p>
                        <p>
                          <strong>Lot weight:</strong>{" "}
                          {dueDiligenceReport.consignmentOverview.totalWeight}kg
                        </p>
                        <p>
                          <strong>Batches:</strong>{" "}
                          {dueDiligenceReport.lots.reduce(
                            (acc, lot) => acc + lot.batches.length,
                            0
                          )}{" "}
                          batches
                        </p>
                        <p>
                          <strong>Product type:</strong> Green Coffee beans
                        </p>
                        <p>
                          <strong>HS Code:</strong> 0901.11 – Coffee, not
                          roasted, not decaffeinated
                        </p>
                        <p>
                          <strong>Trade name:</strong> Uganda{" "}
                          {dueDiligenceReport.lots[0]?.batches[0]?.harvests[0]
                            ?.coffeeVariety || "Coffee"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-[#0F2A38] font-semibold mb-3 text-sm">
                          Traceable Batches in this Consignment
                        </h3>
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
                            {dueDiligenceReport.lots.flatMap((lot) =>
                              lot.batches.map((batch) => (
                                <tr key={batch.batchId} className="border-t">
                                  <td className="p-3">{batch.batchId}</td>
                                  <td className="p-3">
                                    {batch.harvests[0]?.farm.farmName || "N/A"}
                                  </td>
                                  <td className="p-3">
                                    {batch.harvests[0]?.farm.location || "N/A"}
                                  </td>
                                  <td className="p-3">
                                    {batch.totalWeight} kg
                                  </td>
                                  <td className="p-3">
                                    <QRCodeSVG
                                      value={batch.batchId}
                                      size={40}
                                      bgColor="#FFFFFF"
                                      fgColor="#000000"
                                      level="H"
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="text-sm text-gray-700 mb-6">
                        <h3 className="font-semibold text-[#0F2A38] mb-2">
                          Compliance
                        </h3>
                        <ul className="list-disc pl-5">
                          <li>
                            All farms verified deforestation-free post-2020 by
                            UCDA.
                          </li>
                          <li>
                            Complies with EUDR, GDPR, Uganda Data Protection
                            Act.
                          </li>
                          <li>
                            All batches sourced from farms with verified
                            geolocation polygons.
                          </li>
                          {dueDiligenceReport.lots[0]?.batches[0]?.harvests[0]?.cultivationMethods?.includes(
                            "organic"
                          ) && <li>Organic cultivation methods verified.</li>}
                          {dueDiligenceReport.lots[0]?.batches[0]?.harvests[0]?.certifications?.includes(
                            "Fair Trade"
                          ) && <li>Fair Trade certification verified.</li>}
                        </ul>
                      </div>

                      <Button
                        onClick={() =>
                          navigate(`/due-diligence-report/${id}`, {
                            state: { report: dueDiligenceReport },
                          })
                        }
                        className="bg-[#0F2A38] text-white text-sm"
                      >
                        Download Due Diligence Report
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* RIGHT - TIMELINE */}
            <div className="w-1/3">
              <h3 className="text-[#0F2A38] font-semibold mb-4">Timeline</h3>
              <div className="flex flex-col gap-6 text-sm text-gray-700">
                {[
                  {
                    color: "green",
                    label: `Submitted by ${consignment.exporterId.firstName} ${consignment.exporterId.lastName} (${consignment.exporterId._id})`,
                    date: formatDate(consignment.createdAt),
                  },
                  {
                    color: "blue",
                    label: `Delivered by ${consignment.lotIds[0]?.processorId.firstName || ""} ${consignment.lotIds[0]?.processorId.lastName || ""} (${consignment.lotIds[0]?.processorId._id || ""})`,
                    date: formatDate(consignment.lotIds[0]?.dateReceived || ""),
                  },
                  {
                    color: "purple",
                    label: `Exported by ${consignment.exporterId.firstName} ${consignment.exporterId.lastName} (${consignment.exporterId._id})`,
                    date: formatDate(consignment.exportDate),
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-1 bg-${step.color}-100 p-1 rounded-full`}
                    >
                      <div
                        className={`bg-${step.color}-600 w-2.5 h-2.5 rounded-full`}
                      ></div>
                    </div>
                    <div>
                      <p>{step.label}</p>
                      <p className="text-xs text-gray-400">{step.date}</p>
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
