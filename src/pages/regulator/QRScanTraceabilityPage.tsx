import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/globals/regulator/Header";
import Footer from "@/components/globals/Footer";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";

interface TraceabilityReport {
  batchIdentification: {
    batchId: string;
    traceabilityCode: string;
    qrCodeCreatedOn: string;
    harvestPeriod: string;
    volume: string;
    exportedTo: string;
    exportedOn: string;
  };
  farmDetails: {
    farmName: string;
    farmLocation: string;
    farmSize: string;
    yearStarted: number | string;
    cultivationMethods: string;
    certifications: string;
    farmerName: string;
    phoneNumber: string;
    emailAddress: string;
    coordinates: [number, number] | null;
    polygon: {
      type: string;
      coordinates: number[][][];
    } | null;
    cooperativeMembershipNumber?: string;
    numberOfTrees?: number | string;
  } | null;
  processingDetails: {
    processorName: string;
    facilityLocation: string;
    phoneNumber: string;
    emailAddress: string;
    processedPeriod: string;
    destinationCountry: string;
    lotId: string;
    consignmentId: string;
    dryingMethod?: string;
    grading?: string;
    licenseNumber?: string;
  } | null;
  exportDetails: {
    exporterName: string;
    facilityLocation: string;
    emailAddress: string;
    exportDate: string;
    destinationCountry: string;
    destinationPort: string;
    lotId: string;
    consignmentId: string;
  } | null;
  compliance: {
    eudr: string;
    legal: string;
    blockchain: string;
  };
  accessedDate: string;
}

interface MapContainerProps {
  center: { lat: number; lng: number };
  polygonPaths?: { lat: number; lng: number }[];
  farmName: string;
  location: string;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between text-sm text-gray-700 py-0.5">
    <span className="text-left">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

const MapContainer: React.FC<MapContainerProps> = ({
  center,
  polygonPaths,
  farmName,
  location,
}) => {
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const polygonOptions = {
    fillColor: "rgba(255, 0, 0, 0.2)",
    fillOpacity: 0.3,
    strokeColor: "red",
    strokeOpacity: 1,
    strokeWeight: 2,
  };

  console.log("Map center:", center);
  console.log("Polygon paths:......", polygonPaths);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

  if (!apiKey) {
    return (
      <div className="text-red-500 text-center">
        Error: Google Maps API key is missing.
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={{
          mapTypeId: "satellite",
          mapTypeControl: true,
        }}
      >
        {polygonPaths && polygonPaths.length > 0 && (
          <Polygon paths={polygonPaths} options={polygonOptions} />
        )}
        <Marker position={center} title={`${farmName} - ${location}`} />
      </GoogleMap>
    </LoadScript>
  );
};

const QRScanTraceabilityPage: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [report, setReport] = useState<TraceabilityReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraceabilityData = async () => {
      try {
        if (!batchId) {
          throw new Error("Batch ID is missing");
        }

        const apiUrl = "http://localhost:3001";
        console.log(`Fetching from ${apiUrl}/traceability/${batchId}/qrcode`);

        const response = await fetch(
          `${apiUrl}/traceability/${batchId}/qrcode`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch traceability data: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("API response:", data);

        if (data.success && data.traceabilityReport) {
          setReport(data.traceabilityReport);
        } else {
          throw new Error(data.message || "Invalid traceability data");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching traceability data:", err);
        setError(
          `Error fetching data: ${err instanceof Error ? err.message : "Unknown error"}`
        );
        setLoading(false);
      }
    };

    fetchTraceabilityData();
  }, [batchId]);

  const prepareMapData = () => {
    if (!report?.farmDetails?.coordinates) {
      console.log("No coordinates available in farm details");
      return null;
    }

    // Make sure coordinates are in correct order [lat, lng]
    const center = {
      lat: report.farmDetails.coordinates[0],
      lng: report.farmDetails.coordinates[1],
    };

    let polygonPaths: { lat: number; lng: number }[] | undefined;

    if (
      report.farmDetails.polygon &&
      report.farmDetails.polygon.coordinates &&
      report.farmDetails.polygon.coordinates[0] &&
      report.farmDetails.polygon.coordinates[0].length > 0
    ) {
      // Make sure coordinates are transformed correctly - GeoJSON uses [lng, lat] but Google Maps needs {lat, lng}
      polygonPaths = report.farmDetails.polygon.coordinates[0].map((coord) => ({
        lat: coord[1], // Second value is latitude
        lng: coord[0], // First value is longitude
      }));

      console.log("Polygon paths generated:", polygonPaths);
    } else {
      console.log("No polygon data available in farm details");
    }

    return {
      center,
      polygonPaths,
      farmName: report.farmDetails.farmName,
      location: report.farmDetails.farmLocation,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading traceability data...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">
              Error: {error || "No data found"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mapData = prepareMapData();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow px-8 md:px-32 py-16 max-w-[900px] mx-auto">
        <h2 className="text-center text-2xl font-medium text-[#0F2A38] mb-1">
          Coffee Batch Traceability Report
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Accessed: {report.accessedDate}
        </p>

        <hr className="border-t border-gray-300 mb-8" />

        <h3 className="text-center text-xl font-semibold text-[#0F2A38] mb-8">
          {report.batchIdentification.batchId}
        </h3>

        {/* Section A */}
        <section className="mb-10 space-y-1">
          <h4 className="font-bold text-[#0F2A38] mb-2">
            A. Batch identification
          </h4>
          <InfoRow
            label="Batch ID:"
            value={report.batchIdentification.batchId}
          />
          <InfoRow
            label="Traceability Code:"
            value={report.batchIdentification.traceabilityCode}
          />
          <InfoRow
            label="QR Code Created on:"
            value={report.batchIdentification.qrCodeCreatedOn}
          />
          <InfoRow
            label="Harvest period:"
            value={report.batchIdentification.harvestPeriod}
          />
          <InfoRow label="Volume:" value={report.batchIdentification.volume} />
          <InfoRow
            label="Exported to:"
            value={report.batchIdentification.exportedTo}
          />
          <InfoRow
            label="Exported on:"
            value={report.batchIdentification.exportedOn}
          />
        </section>

        {/* Section B */}
        {report.farmDetails && (
          <section className="mb-10 space-y-1">
            <h4 className="font-bold text-[#0F2A38] mb-2">B. Farm details</h4>
            <InfoRow label="Farm name:" value={report.farmDetails.farmName} />
            <InfoRow
              label="Farm location:"
              value={report.farmDetails.farmLocation}
            />
            <InfoRow label="Farm size:" value={report.farmDetails.farmSize} />
            <InfoRow
              label="Year started:"
              value={report.farmDetails.yearStarted.toString()}
            />
            <InfoRow
              label="Cultivation methods:"
              value={report.farmDetails.cultivationMethods}
            />
            <InfoRow
              label="Certifications:"
              value={report.farmDetails.certifications}
            />
            <InfoRow
              label="Farmer name:"
              value={report.farmDetails.farmerName}
            />
            <InfoRow
              label="Phone number:"
              value={report.farmDetails.phoneNumber}
            />
            <InfoRow
              label="Email address:"
              value={report.farmDetails.emailAddress}
            />

            {mapData ? (
              <div className="mt-10 pt-10">
                <div className="rounded-md w-full shadow-md overflow-hidden">
                  <MapContainer
                    center={mapData.center}
                    polygonPaths={mapData.polygonPaths}
                    farmName={mapData.farmName}
                    location={mapData.location}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mt-1 italic">
                  {report.farmDetails.farmName} –{" "}
                  {report.farmDetails.farmLocation}
                </p>
              </div>
            ) : (
              <p className="text-red-500 text-center mt-10">
                Map data is unavailable for this farm.
              </p>
            )}
          </section>
        )}

        {/* Section C – Processing */}
        {report.processingDetails && (
          <section className="mb-10 space-y-1">
            <h4 className="font-bold text-[#0F2A38] mb-2">
              C. Processing details
            </h4>
            <InfoRow
              label="Processor Name:"
              value={report.processingDetails.processorName}
            />
            <InfoRow
              label="Facility location:"
              value={report.processingDetails.facilityLocation}
            />
            <InfoRow
              label="Phone number:"
              value={report.processingDetails.phoneNumber}
            />
            <InfoRow
              label="Email address:"
              value={report.processingDetails.emailAddress}
            />
            <InfoRow
              label="Processed period:"
              value={report.processingDetails.processedPeriod}
            />
            <InfoRow
              label="Destination country:"
              value={report.processingDetails.destinationCountry}
            />
            <InfoRow label="Lot ID:" value={report.processingDetails.lotId} />
            <InfoRow
              label="Consignment ID:"
              value={report.processingDetails.consignmentId}
            />
          </section>
        )}

        {/* Section D – Export */}
        {report.exportDetails && (
          <section className="mb-10 space-y-1">
            <h4 className="font-bold text-[#0F2A38] mb-2">D. Export details</h4>
            <InfoRow
              label="Exporter Name:"
              value={report.exportDetails.exporterName}
            />
            <InfoRow
              label="Facility location:"
              value={report.exportDetails.facilityLocation}
            />
            <InfoRow
              label="Email address:"
              value={report.exportDetails.emailAddress}
            />
            <InfoRow
              label="Export date:"
              value={report.exportDetails.exportDate}
            />
            <InfoRow
              label="Destination country:"
              value={report.exportDetails.destinationCountry}
            />
            <InfoRow label="Lot ID:" value={report.exportDetails.lotId} />
            <InfoRow
              label="Consignment ID:"
              value={report.exportDetails.consignmentId}
            />
          </section>
        )}

        {/* Section E – Compliance */}
        <section className="mb-10">
          <h4 className="font-bold text-[#0F2A38] mb-2">E. Compliance</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold"> EUDR: </span>
            {report.compliance.eudr}
            <br />
            <span className="font-bold"> Legal: </span>
            {report.compliance.legal ||
              "Complies with GDPR, Uganda's Data Protection Act."}
            <br />
            <span className="font-bold"> Blockchain: </span>
            {report.compliance.blockchain}
            <br />
            <br />
            <span className="font-bold">
              This information is retained for a period of 5 years from{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              as outlined in Article 7.4.1 of the EUDR to facilitate audits and
              compliance checks by competent authorities.
            </span>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QRScanTraceabilityPage;
